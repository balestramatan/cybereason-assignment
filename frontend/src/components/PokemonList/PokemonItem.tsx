import { IPokemon } from "../../interfaces/common.interface";

interface IProps {
    pokemon: IPokemon;
    handleCardClick: (id: number) => void;
}

const PokemonItem = (props: IProps) => {
    const { pokemon, handleCardClick } = props;
    return(
        <div key={pokemon.id} className="pokemon-card" onClick={() => handleCardClick(pokemon.id)}>
            {pokemon.image ? <img src={pokemon.image} alt={pokemon.name} /> : <span>No Image</span>}
            <h3>{pokemon.name?.toLocaleUpperCase()}</h3>
            <p>{pokemon.type}</p>
        </div>
    )
}

export default PokemonItem;