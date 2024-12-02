import React, { useCallback, useMemo, useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { IPokemonDetails } from '../../interfaces/common.interface';

interface IProps {
  pokemon: IPokemonDetails;
  closeModal: () => void;
  onToggleFavorite: (pokemonId: number, isFavorite: boolean) => void;
  onAddNickname: (pokemonId: number, nickname: string) => void;
}

const PokemonDetails: React.FC<IProps> = (props: IProps) => {
  const { pokemon, closeModal, onToggleFavorite, onAddNickname } = props;

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(pokemon.nickname || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = useCallback(() => {
    setIsLoading(true);
    try {
      onToggleFavorite(pokemon.id, !pokemon.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pokemon.id, pokemon.isFavorite, onToggleFavorite]);

  const handleSaveNickname = useCallback(() => {
    setIsLoading(true);
    try {
      onAddNickname(pokemon.id, nickname);
      setIsEditingNickname(false);
    } catch (error) {
      console.error('Failed to update nickname:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pokemon.id, nickname, onAddNickname]);

  const renderNicknameEditor = useMemo(() => {
    if (!isEditingNickname) return null;

    return (
      <div className="nickname-editor">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter nickname"
        />
        <button onClick={handleSaveNickname} disabled={isLoading}>
          Save
        </button>
      </div>
    );
  }, [isEditingNickname, nickname, handleSaveNickname, isLoading]);

  const renderStats = useMemo(
    () =>
      pokemon.extraDetails.stats?.map((stat) => (
        <span key={stat.name}>
          <strong>{stat.name}:</strong> {stat.value}
        </span>
      )),
    [pokemon.extraDetails.stats]
  );

  const renderAbilities = useMemo(
    () =>
      pokemon.extraDetails.abilities?.map((ability) => (
        <span key={ability.name}>{ability.name}</span>
      )),
    [pokemon.extraDetails.abilities]
  );

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {
        isLoading ? <Loader /> : 
        <>
          <span className="close" onClick={closeModal}>x</span>

          {/* Action Toolbar */}
          <div className="action-toolbar">
            <button onClick={handleToggleFavorite}>
              {pokemon.isFavorite ? '💖 Remove From Favorites' : '🤍 Add To Favorites'} {/* Toggle Heart */}
            </button>
            <button onClick={() => setIsEditingNickname(!isEditingNickname)}>{`${pokemon?.nickname ? '📝 Update' : '📝 Add'} Nickname`}</button>
          </div>

          {/* Nickname Editor */}
          {isEditingNickname && renderNicknameEditor}

          <div className='pokmon-details'>
            <h1>{pokemon.name} (#{pokemon.id})</h1>
            {pokemon.nickname && <span>{`@${pokemon?.nickname}`}</span>}
            <img src={pokemon.image} alt={pokemon?.name} />
          </div>
          <div className='details-container'>
            <div className='details'>
              <h2>Stats</h2>
              {renderStats}
            </div>
            <div className="details">
              <h2>Details</h2>
              <span><strong>Height:</strong> {pokemon.extraDetails.height / 10} m</span>
              <span><strong>Weight:</strong> {pokemon.extraDetails.weight / 10} kg</span>
              <span><strong>Types:</strong> {pokemon.type}</span>
              <span><strong>Base Experience:</strong> {pokemon.extraDetails.baseExperience}</span>
            </div>
            <div className='details'>
              <h2>Abilities</h2>
              {renderAbilities}
            </div>            
          </div>
        </>
        }
      </div>
    </div>
  );
};

export default PokemonDetails;
