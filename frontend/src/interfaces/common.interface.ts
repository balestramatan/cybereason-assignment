export interface IPokemon {
    id: number;
    name: string;
    type: string;
    image: string;
  }
  
  export interface IPokemonDetails extends IPokemon {
    id: number,
    name: string
    type: string,
    image: string,
    nickname: string,
    isFavorite: boolean,
    extraDetails: {
      height: number;
      weight: number;
      type: string;
      stats: { name: string; value: number }[];
      abilities: { name: string }[];
      baseExperience: number;
    }
  }
  
  export interface ISearchQuery {
    name: string;
    type: string;
  }