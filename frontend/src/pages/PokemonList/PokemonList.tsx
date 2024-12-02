import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPokemonDetails, fetchPokemons, toggleFavorite, updateNickname } from '../../api/pokemon';

import './PokemonList.css';
import PokemonDetails from '../../components/PokemonList/PokemonDetails';
import useURLParams from '../../hooks/useURLParams';
import Pagination from '../../components/Pagination/Pagination';
import Search from '../../components/Search/Search';
import PokemonListComponent from '../../components/PokemonList/PokemonListComponent';
import { IPokemon, IPokemonDetails } from '../../interfaces/common.interface';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import usePagination from '../../hooks/usePagination';
import ActiveSearch from '../../components/ActiveSearch/ActiveSearch';
import axios from 'axios';

const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<IPokemon[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<IPokemonDetails | null>(null); // Selected Pokémon for the modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal visibility

  const { params: { offset, limit, type, name }, updateURLParams} = useURLParams(10);
  const { handleFirstPage, handleLastPage, handleNextPage, handlePreviousPage } = usePagination(offset, limit, totalPages, updateURLParams);

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchNameQuery = useRef<HTMLInputElement>(null);
  const searchTypeQuery = useRef<HTMLInputElement>(null);

  const fetchPokemonsData = async () => {
    setIsLoading(true);

    // Cancel the previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const { pokemons, count } = await fetchPokemons(offset, limit, name || '', type || '', controller.signal);
      setPokemons(pokemons);
      setTotalPages(Math.ceil(count / limit));
      setIsLoading(false);
      abortControllerRef.current = null;
    } catch (err: any) {
      console.log('err', err); 
      
      if (axios.isCancel(err)) {
        console.log('Request was canceled');
      } else {
        toast.error(err.response?.data?.message || 'Failed to fetch Pokémon list');
      }
    } 
  };

  useEffect(() => {
    fetchPokemonsData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [offset, limit, name, type]);

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

  const handleSearch = useCallback(
    debounce(() => {
      const nameSearchValue = searchNameQuery.current?.value || '';
      const typeSearchValue = searchTypeQuery.current?.value || '';
  
      updateURLParams({
        offset: 0,
        limit,
        name: nameSearchValue,
        type: typeSearchValue,
      });
    }, 300),
    [limit, updateURLParams]
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const handleUpdatePokemon = async (id: number, updatedField: Partial<IPokemon>, apiCall: (id: number, field: any) => Promise<void>) => {
    try {
      const [field, value] = Object.entries(updatedField)[0];

      // Call the appropriate API for the update
      await apiCall(id, value);
  
      // Update the selected Pokémon
      const updatedPokemon = { ...selectedPokemon!, [field]: value };
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

  const handleToggleFavorite = useCallback(async (id: number, isFavorite: boolean) => {
    await handleUpdatePokemon(id, { isFavorite }, toggleFavorite);
  }, [handleUpdatePokemon]);
  
  const handleUpdateNickname = useCallback(async (id: number, nickname: string) => {
    await handleUpdatePokemon(id, { nickname }, updateNickname);
  }, [handleUpdatePokemon]);

  return (
    <div className='pokemon-list-container'>
      <h1>Pokémon List</h1>
      <Search 
        searchNameQuery={searchNameQuery} 
        searchTypeQuery={searchTypeQuery} 
        handleSearch={handleSearch}
      />

      {!isLoading && (name || type) && <ActiveSearch name={name} type={type} />}

      <PokemonListComponent pokemons={pokemons} loading={isLoading} handleCardClick={handleCardClick} />

      {pokemons.length > 0 && <Pagination 
        offset={offset} 
        limit={limit} 
        totalPages={totalPages} 
        handleFirstPage={handleFirstPage} 
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
