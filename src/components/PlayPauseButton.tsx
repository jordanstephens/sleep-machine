import React from 'react';
import Triangle from './icons/Triangle';
import Square from './icons/Square';

interface IProps {
  playing: boolean;
  onClick: (event: React.MouseEvent) => void
}

const PlayPauseButton: React.FC<IProps> = ({ playing, onClick }) => (
  <button onClick={onClick} className="PlayPauseButton">
    {playing
      ? <Square />
      : <Triangle style={{ transform: 'rotate(90deg)' }} />
    }
  </button>
)

export default PlayPauseButton
