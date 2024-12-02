import React, { useState, useEffect, useRef } from 'react';
import { fetchPokemonDetails, fetchPokemons, toggleFavorite, updateNickname } from '../../api/pokemon';

import './PokemonList.css';
import PokemonDetails from '../../components/PokemonList/PokemonDetails';
import useURLParams from '../../hooks/usePaginationParams';
import Pagination from '../../components/Pagination/Pagination';
import Search from '../../components/Search/Search';
import PokemonListComponent from '../../components/PokemonList/PokemonListComponent';
import { IPokemon, IPokemonDetails } from '../../interfaces/common.interface';
import { toast } from 'react-toastify';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<IPokemon[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<IPokemonDetails | null>(null); // Selected Pokémon for the modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility

  const { params: { offset, limit, type, name }, updateURLParams} = useURLParams(10);

  const searchNameQuery = useRef<HTMLInputElement>(null);
  const searchTypeQuery = useRef<HTMLInputElement>(null);

  const fetchPokemonsData = async () => {
    setIsLoading(true);

    try {
      const { pokemons, count } = await fetchPokemons(offset, limit, name || '', type || '');
      setPokemons(pokemons);
      setTotalPages(Math.ceil(count / limit));
    } catch (err: any) {
      console.log(err.response?.data?.message || 'Failed to fetch Pokémon');
      toast.error(err.response?.data?.message || 'Failed to fetch Pokémon');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonsData();
  }, [offset, limit, name, type]);
  
  const handleFirstPage = () => {
    updateURLParams({ offset: DEFAULT_OFFSET, limit: DEFAULT_LIMIT });
  }
  const handleLastPage = () => {
    updateURLParams({ offset: (totalPages - 1) * limit, limit });
  }
  const handleNextPage = () => {
    updateURLParams({ offset: offset + limit, limit });
  }
  const handlePreviousPage = () => {
    updateURLParams({ offset: offset - limit, limit });
  }

  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateURLParams({ offset, limit: Number(event.target.value) });
  };

  const handleCardClick = async (id: number) => {
    setIsModalOpen(true);
    setIsLoading(true);
    const selectedPokemon = pokemons.find((pokemon) => pokemon.id === id);
    try{
      const pokemonDetails = await fetchPokemonDetails(id);
      setSelectedPokemon({...pokemonDetails, image: selectedPokemon?.image});      
    } catch (err: any) {
      console.log(err.response?.data?.message || 'Failed to fetch Pokémon details');
      toast.error(err.response?.data?.message || 'Failed to fetch Pokémon details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const nameSearchValue = searchNameQuery.current?.value || '';
    const typeSearchValue = searchTypeQuery.current?.value || '';

    const searchObject = {
      offset: 0, 
      limit, 
      name: nameSearchValue, 
      type: typeSearchValue
    }
    
    updateURLParams(searchObject);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const handleUpdatePokemon = async (id: number, updatedFields: Partial<IPokemon>, apiCall: (id: number, updatedFields: any) => Promise<void>) => {
    try {
      // Call the appropriate API for the update
      await apiCall(id, updatedFields);
  
      // Update the selected Pokémon
      const updatedPokemon = { ...selectedPokemon!, ...updatedFields };
      setSelectedPokemon(updatedPokemon);
  
      // Update the pokemons list
      const updatedPokemons = pokemons.map((pokemon) =>
        Number(pokemon.id) === Number(id) ? updatedPokemon : pokemon
      );
      setPokemons(updatedPokemons);
    } catch (err: any) {
      console.log(err.message || `Failed to update Pokémon`);
      toast.error(err.message || `Failed to update Pokémon`);
    }
  };

  const handleToggleFavorite = (id: number, isFavorite: boolean) => {
    handleUpdatePokemon(id, { isFavorite }, toggleFavorite);
  };
  
  const handleUpdateNickname = (id: number, nickname: string) => {
    handleUpdatePokemon(id, { nickname }, updateNickname);
  };

  return (
    <div className='pokemon-list-container'>
      <h1>Pokémon List</h1>
      <Search 
        searchNameQuery={searchNameQuery} 
        searchTypeQuery={searchTypeQuery} 
        handleSearch={handleSearch}
      />

      {!isLoading && (name || type) && (
        <div className="active-filter">
          {name && type
            ? `Showing results for Pokémon with name "${name}" and type "${type}".`
            : name
            ? `Showing results for Pokémon with name "${name}".`
            : `Showing results for Pokémon with type "${type}".`}
        </div>
      )}

      <PokemonListComponent pokemons={pokemons} loading={isLoading} handleCardClick={handleCardClick} />

      {pokemons.length > 0 && <Pagination 
        offset={offset} 
        limit={limit} 
        totalPages={totalPages} 
        handleFirstPage={handleFirstPage} 
        handleLimitChange={handleLimitChange}  
        handleLastPage={handleLastPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />}

      {isModalOpen && selectedPokemon && (
        <PokemonDetails 
          pokemon={selectedPokemon} 
          closeModal={closeModal} 
          onToggleFavorite={handleToggleFavorite} 
          onAddNickname={handleUpdateNickname} 
        />
      )}
    </div>
  );
};

export default PokemonList;
