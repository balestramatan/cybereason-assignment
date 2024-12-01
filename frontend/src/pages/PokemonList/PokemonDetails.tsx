import React, { useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { IPokemonDetails } from '../../interfaces/common.interface';

interface IProps {
  pokemon: IPokemonDetails;
  closeModal: () => void;
  onToggleFavorite: (pokemonId: number) => void;
  onAddNickname: (pokemonId: number, nickname: string) => void;
  onAddNote: (pokemonId: number, notes: string) => void;
}

const PokemonDetails: React.FC<IProps> = (props: IProps) => {
  const { pokemon, closeModal, onToggleFavorite, onAddNickname, onAddNote } = props;

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [nickname, setNickname] = useState(pokemon.nickname || '');
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState(pokemon.notes?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = () => onToggleFavorite(pokemon.id);

  const handleSaveNickname = () => {
    setIsLoading(true)
    onAddNickname(pokemon.id, nickname);
    setIsEditingNickname(false);
    setIsLoading(false)
  };

  const handleSaveNotes = () => {
    setIsLoading(true)
    onAddNote(pokemon.id, note);
    setIsEditingNotes(false);
    setIsLoading(false)
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {
        isLoading ? <Loader /> : 
        <>
          {/* Action Toolbar */}
          <div className="action-toolbar">
            <button onClick={handleToggleFavorite}>
              {pokemon.isFavorite ? '💖 Remove From Favorites' : '🤍 Add To Favorites'} {/* Toggle Heart */}
            </button>
            <button onClick={() => setIsEditingNickname(!isEditingNickname)}>{`${pokemon?.nickname ? '📝 Update' : '📝 Add'} Nickname`}</button>
            <button onClick={() => setIsEditingNotes(!isEditingNotes)}>
              {`${pokemon?.notes?.length > 0 ? '📝 Update' : '📝 Add'} Notes`}
            </button>
          </div>

          {/* Nickname Editor */}
          {isEditingNickname && (
              <div className="nickname-editor">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter nickname"
                />
                <button onClick={handleSaveNickname}>Save</button>
              </div>
          )}

          {/* Notes Editor */}
          {isEditingNotes && (
              <div className="notes-editor">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter notes (comma-separated)"
                />
                <button onClick={handleSaveNotes}>Save</button>
              </div>
          )}

          <div className='pokmon-details'>
            <h1>{pokemon.name} (#{pokemon.id})</h1>
            {pokemon.nickname && <span>{`@${pokemon?.nickname}`}</span>}
            {pokemon.notes && <span>{`Notes: ${pokemon?.notes?.join(', ')}`}</span>}
            <img src={pokemon.image} alt={pokemon?.name} />
          </div>
          <div className='details-container'>
            <div className='stats'>
              <h2>Stats</h2>
              {pokemon.extraDetails.stats?.map((stat) => (
                  <span key={stat.name}><strong>{stat.name}:</strong> {stat.value}</span>
              ))}
            </div>
            <div className="content">
              <h2>Details</h2>
              <span><strong>Height:</strong> {pokemon.extraDetails.height / 10} m</span>
              <span><strong>Weight:</strong> {pokemon.extraDetails.weight / 10} kg</span>
              <span><strong>Types:</strong> {pokemon.type}</span>
              <span><strong>Base Experience:</strong> {pokemon.extraDetails.baseExperience}</span>
            </div>
            <div className='abilities'>
              <h2>Abilities</h2>
              {pokemon.extraDetails.abilities?.map((ability) => (
                  <span key={ability.name}>{ability?.name}</span>
              ))}
            </div>            
          </div>
        </>
        }
      </div>
    </div>
  );
};

export default PokemonDetails;
