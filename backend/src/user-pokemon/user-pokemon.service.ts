import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPokemon } from './user-pokemon.entity';

@Injectable()
export class UserPokemonService {
  constructor(
    @InjectRepository(UserPokemon)
    private readonly userPokemonRepository: Repository<UserPokemon>
  ) {}

  async favoritePokemon(userId: number, pokemonId: number): Promise<void> {
    let userPokemon = await this.userPokemonRepository.findOne({
      where: { user: { id: userId }, pokemon: { id: pokemonId } },
    });

    if (!userPokemon) {
      userPokemon = this.userPokemonRepository.create({
        user: { id: userId },
        pokemon: { id: pokemonId },
        isFavorite: true,
      });
    } else {
      userPokemon.isFavorite = true;
    }

    await this.userPokemonRepository.save(userPokemon);
  }

  async updateUserPokemonData(userId: number, pokemonId: number, data: { nickname?: string; notes?: string[] }): Promise<void> {
    let userPokemon = await this.userPokemonRepository.findOne({
      where: { user: { id: userId }, pokemon: { id: pokemonId } },
    });

    if (!userPokemon) {
      userPokemon = this.userPokemonRepository.create({
        user: { id: userId },
        pokemon: { id: pokemonId },
        ...data,
      });
    } else {
      Object.assign(userPokemon, data);
    }

    await this.userPokemonRepository.save(userPokemon);
  }

  async getUserPokemon(userId: number): Promise<UserPokemon[]> {
    return this.userPokemonRepository.find({
      where: { user: { id: userId } },
    });
  }
}
