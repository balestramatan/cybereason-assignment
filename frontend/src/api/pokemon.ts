import axiosInstance from './axiosInstance';
import { API_BASE } from "../config";
import { IPokemon } from '../interfaces/common.interface';

interface fetchPokemonsResponse {
    pokemons: {
        id: number;
        name: string;
        type: string;
        image: string;
    }[];
    count: number;
}

export const fetchPokemons = async (offset: number, limit: number, name: string, type: string): Promise<fetchPokemonsResponse> => {
    console.log('fetchPokemons', offset, limit, name, type);
    const response = await axiosInstance.get(`${API_BASE}/pokemon`, {
        params: {
            offset,
            limit,
            name,
            type
        },
    });

    console.log('fetchPokemons response', response.data);

    return response.data;
};

export const fetchPokemonDetails = async (id: number) => {
    const response = await axiosInstance.get(`${API_BASE}/pokemon/${id}`);
    return response.data;
};

export const updatePokemon = async (id: number, data: Partial<IPokemon>) => {
    const response = await axiosInstance.patch(`/pokemon/${id}`, data);
    return response.data;
};

export const toggleFavorite = async (pokemonId: number, isFavorite: boolean) => {
    const response = await axiosInstance.patch(`/pokemon/${pokemonId}/favorite`, { isFavorite });
    return response.data;
}

export const updateNote = async (pokemonId: number, note: string) => {
    const response = await axiosInstance.patch(`/pokemon/${pokemonId}/notes`, { note });
    return response.data;
}

export const deletePokemon = async (pokemonId: number) => {
    const response = await axiosInstance.delete(`/pokemon/${pokemonId}`);
    return response.data;
}

export const updateNickname = async (pokemonId: number, nickname: string) => {
    const response = await axiosInstance.patch(`/pokemon/${pokemonId}/nickname`, { nickname });
    return response.data;
}