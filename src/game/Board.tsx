import type { Board as BoardType } from './ai';
import { Square } from './Square';

interface BoardProps {
  board: BoardType;
  onPlay: (index: number) => void;
  disabled: boolean;
}

export function Board({ board, onPlay, disabled }: BoardProps) {
  return (
    <div className="board">
      {board.map((cell, i) => (
        <Square
          key={i}
          value={cell}
          onClick={() => onPlay(i)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
