import { useMemo } from 'react';
import type { Cell } from './ai';

interface SquareProps {
  value: Cell;
  onClick: () => void;
  disabled: boolean;
}

export function Square({ value, onClick, disabled }: SquareProps) {
  const rotation = useMemo(
    () => `${(Math.random() * 10 - 5).toFixed(1)}deg`,
    [value],
  );

  return (
    <button
      className="square"
      onClick={onClick}
      disabled={disabled || value !== null}
    >
      {value && (
        <span
          className="square__mark"
          style={{ '--mark-rotation': rotation } as React.CSSProperties}
        >
          {value}
        </span>
      )}
    </button>
  );
}
