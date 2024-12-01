import React, { useState, useEffect, useRef } from 'react';
import { fetchPokemonDetails, fetchPokemons, toggleFavorite, updateNickname, updateNote } from '../../api/pokemon';

import './PokemonList.css';
import PokemonDetails from './PokemonDetails';
import useURLParams from '../../hooks/usePaginationParams';
import Pagination from '../../components/Pagination/Pagination';
import Search from '../../components/Search/Search';
import PokemonListComponent from '../../components/PokemonList/PokemonListComponent';
import { IPokemon, IPokemonDetails } from '../../interfaces/common.interface';

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
      console.log(err?.data?.message || 'Failed to fetch Pokémon');
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
      console.log(err.message || 'Failed to fetch Pokémon details');
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

  const resetSearch = () => updateURLParams({ offset: DEFAULT_OFFSET, limit: DEFAULT_LIMIT, name: '', type: ''});

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const handleToggleFavorite = (id: number) => {
    try {
      toggleFavorite(id, !selectedPokemon!.isFavorite);

      const newPokemon = {...selectedPokemon!, isFavorite: !selectedPokemon!.isFavorite};
      setSelectedPokemon(newPokemon);
    } catch (err: any) {
      console.log(err.message || 'Failed to toggle favorite');
    }
  };

  const handleUpdateNickname = (id: number, nickname: string) => {
    try {
      updateNickname(id, nickname);
      const newPokemon = {...selectedPokemon!, nickname};
      setSelectedPokemon(newPokemon);
    } catch (err: any) {
      console.log(err.message || 'Failed to update nickname');
    }
  };

  const handleUpdateNote = (id: number, note: string) => {
    try {
      updateNote(id, note);
      const newPokemon = {...selectedPokemon!, notes: [...selectedPokemon!.notes, note]};
      setSelectedPokemon(newPokemon);
    } catch (err: any) {
      console.log(err.message || 'Failed to update notes');
    }
  }

  return (
    <div className='pokemon-list-container'>
      <h1>Pokémon List</h1>
      <Search 
        searchNameQuery={searchNameQuery} 
        searchTypeQuery={searchTypeQuery} 
        handleSearch={handleSearch}
        resetSearch={resetSearch}
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

      <Pagination 
        offset={offset} 
        limit={limit} 
        totalPages={totalPages} 
        handleFirstPage={handleFirstPage} 
        handleLimitChange={handleLimitChange}  
        handleLastPage={handleLastPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
      />

      {isModalOpen && selectedPokemon && (
        <PokemonDetails 
          pokemon={selectedPokemon} 
          closeModal={closeModal} 
          onToggleFavorite={handleToggleFavorite} 
          onAddNickname={handleUpdateNickname} 
          onAddNote={handleUpdateNote} 
        />
      )}
    </div>
  );
};

export default PokemonList;
