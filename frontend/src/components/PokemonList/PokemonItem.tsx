import { IPokemon } from "../../interfaces/common.interface";

interface IProps {
    pokemon: IPokemon;
    handleCardClick: (id: number) => void;
}

const PokemonItem = (props: IProps) => {
    const { pokemon, handleCardClick } = props;
    return(
        <div key={pokemon.id} className="pokemon-card" onClick={() => handleCardClick(pokemon.id)}>
            {pokemon.isFavorite && <span className="favorite">💖</span>}
            {pokemon.image ? <img src={pokemon.image} alt={pokemon.name} /> : <span>No Image</span>}
            {pokemon.nickname && <span>{`@${pokemon.nickname}`}</span>}
            <h4>{pokemon.name?.toLocaleUpperCase()}</h4>
            <span>{pokemon.type}</span>
        </div>
    )
}

export default PokemonItem;