import { IPokemon } from '../../interfaces/common.interface';
import Loader from '../Loader/Loader';
import NotFound from '../NoFound/NoFound';
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
          pokemons.length === 0 ? <NotFound message="No Pokémon found"/> : 
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