import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity';
import { RedisService } from 'src/redis/redis.service';
import axios from 'axios';
import { UserPokemon } from 'src/user-pokemon/user-pokemon.entity';

interface PokemonsAPIResponse { 
  data: { 
    results: { name: string, url: string }[], 
    count: number
  }
}

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    @InjectRepository(UserPokemon)
    private readonly userPokemonRepository: Repository<UserPokemon>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(userId: number, limit: number = 20, offset: number = 0, name: string = '', type: string = ''): Promise<{ pokemons: Pokemon[], count: number }> {
    // Step 1: Handle both name and type together
    if (name && type) {
      const searchResults = await this.searchPokemonByName(userId, name);

      if(!searchResults || !searchResults.pokemons || searchResults.pokemons.length === 0) {
        return {
          pokemons: [], // No match
          count: 0,
        };
      }

      const pokemon = searchResults.pokemons && searchResults.pokemons[0]
      const typeMatch = pokemon && pokemon.type.split(', ').includes(type.toLowerCase())
      return {
        pokemons: typeMatch ? [pokemon] : [], // No match
        count: 0,
      };
    }

    // Step 2: Check if a name or type is provided
    if (name) {
      return this.searchPokemonByName(userId, name);
    }
    // Step 3: Check if a type is provided
    if (type) {
      return this.searchPokemonByType(userId, type, offset, limit);
    }

    // No Filters: Return all Pokémon
    // Check If Exists in Redis Cache
    const cacheKey: string = `pokemon_page_${offset}_${limit}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      return cachedData; // return cached data
    }

    // Always fetch the total count from the external API (static count)
    const apiUrl: string = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const response: PokemonsAPIResponse = await axios.get(apiUrl);

    const totalCount = response.data.count; // Always use the total count from the API

    // Check If Exists in Database
    const pokemons = await this.pokemonRepository.find({
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
    });

    // Step 3: Check if database results match the requested page
    if (pokemons.length === limit) {
      console.log('Returning data from database');

      const enrichedPokemons = await this.enrichWithUserPokemonData(pokemons, userId);
      const dataToCache = { pokemons: enrichedPokemons, count: totalCount };
      await this.redisService.set(cacheKey, dataToCache, 3600);
      return dataToCache; // return database results
    }

    // Fallback to external API if not found in the database
    const pokemonList = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const details = await axios.get(pokemon.url).then((res) => res.data);

        const newPokenon: Pokemon = {
          id: details.id,
          name: details.name || 'Unknown',
          type: details.types.map((t: any) => t.type.name).join(', ') || 'Unknown',
          image: details.sprites.front_default || '',
        }

        return this.insertPokemon(newPokenon);
      })
    );

    // Cache the result
    console.log('Saving data to Redis cache...');
    const enrichedPokemons = await this.enrichWithUserPokemonData(pokemonList, userId);
    const dataToCache = { pokemons: enrichedPokemons, count: totalCount };
    await this.redisService.set(cacheKey, dataToCache, 3600); // Cache result

    return dataToCache; // return external API results
  }

  async findOne(userId: number, id: number): Promise<any> {
    const cacheKey = `pokemon_${id}`;
    const cachedData = await this.redisService.get(cacheKey);
  
    if (cachedData) {
      console.log(`Returning Pokémon with ID ${id} from cache`);
      return cachedData;
    }

    // Fallback to external API if not found in the cache
    console.log(`Fetching Pokémon with ID ${id} from external API`);
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await axios.get(apiUrl);
    const details = response.data;

    const extraDetails = {
      height: details.height,
      weight: details.weight,
      baseExperience: details.base_experience,
      stats: details.stats.map((stat: any) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      abilities: details.abilities.map((ability: any) => ({
        name: ability.ability.name,
      })),
    }
  
    // Check if basic data exists in the database
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });
  
    let newPokemon: Pokemon | undefined;
    if (!pokemon) {
      newPokemon = {
        id: details.id,
        name: details.name || 'Unknown',
        type: details.types.map((t: any) => t.type.name).join(', ') || 'Unknown',
        image: details.sprites.front_default || '',
      };
      await this.insertPokemon(newPokemon);
    }

    // Fetch user-specific data from the user_pokemon table
    const userPokemon = await this.userPokemonRepository.findOne({
      where: { user: { id: userId }, pokemon: { id } },
    });

    const pokemonWithExtras = {
      id,
      name: pokemon?.name || newPokemon?.name || 'Unknown',
      type: pokemon?.type || newPokemon?.type || 'Unknown',
      image: pokemon?.image || newPokemon?.image || '',
      isFavorite: userPokemon?.isFavorite || false,
      nickname: userPokemon?.nickname || null,
      notes: userPokemon?.notes || [],
      extraDetails,
    };

    // Cache the full response
    console.log(`Saving Pokémon with ID ${id} for User ${userId} to cache`);
    await this.redisService.set(cacheKey, pokemonWithExtras, 3600);
  
    return pokemonWithExtras;
  }

  async insertPokemon(pokemon: Pokemon): Promise<Pokemon> {
    pokemon = this.pokemonRepository.create(pokemon);
    // Save to the database
    await this.pokemonRepository.save(pokemon);

    return pokemon;
  }

  async update(id: number, updateData: Pokemon): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    Object.assign(pokemon, updateData); // Merge new data into the existing Pokémon

    await this.redisService.delete(`pokemon_${id}`); // Clear specific Pokémon cache
    await this.redisService.set(`pokemon_${id}`, updateData, 3600); // Update cache

    return this.pokemonRepository.save(pokemon);
  }

  async delete(id: number): Promise<void> {
    const pokemon = await this.pokemonRepository.findOne({ where: { id } });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID ${id} not found`);
    }

    await this.pokemonRepository.remove(pokemon);
    await this.redisService.delete(`pokemon_${id}`); // Clear specific Pokémon cache
  }

  async searchPokemonByName(userId: number, name: string): Promise<{ pokemons: Pokemon[]; count: number }> {
    const cacheKey = `search_name_${name.toLowerCase()}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    // Check the database for a Pokémon matching the name
    const pokemon = await this.pokemonRepository.findOne({
      where: { name: name.toLowerCase() },
    });

    if (pokemon) {
      const enrichedPokemon = await this.enrichWithUserPokemonData([pokemon], userId);
      const dataToCache = { pokemons: enrichedPokemon, count: 1 };
      await this.redisService.set(cacheKey, dataToCache, 3600);
      return dataToCache;
    }

    // Fallback to external API if not found in the database
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const data = response.data;

      const pokemon = {
        id: data.id,
        name: data.name,
        type: data.types.map((t: any) => t.type.name).join(', '),
        image: data.sprites.front_default,
        isFavorite: false,
        nickname: null,
        notes: null,
      };

      const dataToCache = {
        pokemons: [pokemon],
        count: 1,
      };

      // Cache the result
      await this.redisService.set(cacheKey, dataToCache, 3600);
      
      return dataToCache;
      
    } catch (error) {
      console.log(`Pokemon with name "${name}" not found. Returning empty array.`);
      return {
        pokemons: [],
        count: 0,
      }; // Return an empty array if not found
    }
  }

  async searchPokemonByType(userId: number, type: string, offset: number = 0, limit: number = 20): Promise<{ pokemons: Pokemon[], count: number }> {
    const cacheKey = `search_type_${type.toLowerCase()}_offset_${offset}_limit_${limit}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      console.log(`Returning Pokémon with type "${type}" from cache`);
      return cachedData;
    }

    // Fallback to external API if not found in the database
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
      const allPokemons = response.data.pokemon.map((p: any) => ({
        name: p.pokemon.name,
        url: p.pokemon.url,
      }));

      console.log(`Found ${allPokemons.length} Pokémon with type "${type}"`);

      // Slice the Pokémon based on offset and limit
      const paginatedPokemons = allPokemons.slice(offset, offset + limit);

      // Fetch detailed data for each Pokémon in the current page
      const detailedPokemons = await Promise.all(
        paginatedPokemons.map(async (pokemon: { name: string, url: string }) => {
          const details = await axios.get(pokemon.url).then((res) => res.data);
          return {
            id: details.id,
            name: details.name,
            type: details.types.map((t: any) => t.type.name).join(', '),
            image: details.sprites.front_default,
            isFavorite: false,
            nickname: null,
            notes: null,
          };
        })
      );

      // Cache the result
      const enrichedPokemons = await this.enrichWithUserPokemonData(detailedPokemons, userId);
      const dataToCache = { pokemons: enrichedPokemons, count: response.data.pokemon.length };
      await this.redisService.set(cacheKey, dataToCache, 3600);
      
      return dataToCache;

    } catch (error) {
      console.log(`Pokemon with type "${type}" not found. Returning empty array.`);
      return {
        pokemons: [],
        count: 0,
      }; // Return an empty array if not found
    }
  }

  async toggleFavorite(userId: number, pokemonId: number, isFavorite: boolean): Promise<{ message: string }> {
    const message = `Pokemon ${isFavorite ? 'marked as favorite' : 'removed from favorites'}`;

    // Check if exists in redis cache
    const cacheKey = `pokemon_${pokemonId}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      // Update the cache
      cachedData.isFavorite = isFavorite;
      await this.redisService.set(cacheKey, cachedData, 3600);
    }

    // Update the user_pokemon table
    await this.userPokemonRepository.upsert(
      { 
        user: { id: userId }, 
        pokemon: { id: pokemonId }, 
        isFavorite 
      }, 
      { conflictPaths: ['user', 'pokemon'] } // Use the unique constraint fields
    );

    // Clear related cache
    const cachedKeys = await this.redisService.keys('pokemon_page_*'); // Find all cached pages
    for (const key of cachedKeys) {
      await this.redisService.delete(key); // Delete each cached page
    }

    return { message };
  }

  async updateNickname(userId: number, pokemonId: number, nickname: string): Promise<void> {
    // Check if exists in redis cache
    const cacheKey = `pokemon_${pokemonId}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      // Update the cache
      cachedData.nickname = nickname;
      await this.redisService.set(cacheKey, cachedData, 3600);
    }
  
    // Use upsert for updating or inserting nickname
    await this.userPokemonRepository.upsert(
      {
        user: { id: userId },
        pokemon: { id: pokemonId },
        nickname,
      },
      { conflictPaths: ['user', 'pokemon'] } // Use the unique constraint fields
    );

    // Invalidate all cache
    const cachedKeys = await this.redisService.keys('pokemon_page_*');
    for (const key of cachedKeys) {
      await this.redisService.delete(key);
    }
  }

  async updateNotes(userId: number, pokemonId: number, notes: string[]): Promise<void> {
    // Check if exists in redis cache
    const cacheKey = `pokemon_${pokemonId}`;
    const cachedData = await this.redisService.get(cacheKey);

    if (cachedData) {
      // Update the cache
      cachedData.notes = notes;
      await this.redisService.set(cacheKey, cachedData, 3600);
    }
  
    // Use upsert for updating or inserting notes
    await this.userPokemonRepository.upsert(
      {
        user: { id: userId },
        pokemon: { id: pokemonId },
        notes,
      },
      { conflictPaths: ['user', 'pokemon'] } // Use the unique constraint fields
    );
  
    // Invalidate all cache
    const cachedKeys = await this.redisService.keys('pokemon_page_*');
    for (const key of cachedKeys) {
      await this.redisService.delete(key);
    }
  }

  async enrichWithUserPokemonData(pokemons: Pokemon[], userId: number): Promise<Pokemon[]> {
    const userPokemons = await this.userPokemonRepository.find({
      where: { user: { id: userId } },
      relations: ['pokemon'],
    });

    return pokemons.map((pokemon) => {
      const userPokemon = userPokemons.find((up) => up.pokemon.id === pokemon.id);

      return {
        ...pokemon,
        isFavorite: userPokemon?.isFavorite || false,
        nickname: userPokemon?.nickname || null,
        notes: userPokemon?.notes || [],
      };
    });
  }
}
