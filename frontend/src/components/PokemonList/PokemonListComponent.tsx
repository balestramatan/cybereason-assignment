import { IPokemon } from '../../interfaces/common.interface';
import Loader from '../Loader/Loader';
import PokemonItem from './PokemonItem';

interface IProps {
  pokemons: IPokemon[];
  loading: boolean;
  handleCardClick: (id: number) => void;
}

const PokemonListComponent = (props: IProps) => {
  const { pokemons, loading, handleCardClick } = props;
  return (
    <div className="grid-container">
        {
          loading ? <Loader /> :
          pokemons.length === 0 ? <p>No Pokémon found</p> : 
          <div className="grid">
            {
              pokemons?.map((pokemon) => (
                <PokemonItem key={pokemon.id} pokemon={pokemon} handleCardClick={handleCardClick} />
              ))
            }
          </div>
        }
      </div> 
  );
}

export default PokemonListComponent;