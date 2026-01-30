import type { Cell } from './ai';

interface SquareProps {
  value: Cell;
  onClick: () => void;
  disabled: boolean;
}

export function Square({ value, onClick, disabled }: SquareProps) {
  return (
    <button
      className={`square ${value ? `square--${value}` : ''}`}
      onClick={onClick}
      disabled={disabled || value !== null}
    >
      {value && <span className="square__mark">{value}</span>}
    </button>
  );
}
