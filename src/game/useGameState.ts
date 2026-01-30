import { useState, useCallback, useEffect } from 'react';
import { hapticFeedback } from '@tma.js/sdk-react';
import type { Board } from './ai';
import { checkWinner, isBoardFull, getBestMove } from './ai';

export type GameStatus =
  | 'player_turn'
  | 'ai_thinking'
  | 'player_win'
  | 'ai_win'
  | 'draw';

const STATUS_TEXT: Record<GameStatus, string> = {
  player_turn: 'Ваш ход',
  ai_thinking: 'ИИ думает...',
  player_win: 'Вы победили!',
  ai_win: 'ИИ победил!',
  draw: 'Ничья!',
};

function emptyBoard(): Board {
  return Array(9).fill(null) as Board;
}

function tryHaptic(fn: () => void) {
  try { fn(); } catch { /* not in Telegram */ }
}

export function useGameState() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [status, setStatus] = useState<GameStatus>('player_turn');

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setStatus('player_turn');
    tryHaptic(() => hapticFeedback.impactOccurred('light'));
  }, []);

  // AI move effect
  useEffect(() => {
    if (status !== 'ai_thinking') return;

    const timeout = setTimeout(() => {
      setBoard((prev) => {
        const next = [...prev] as Board;
        const move = getBestMove(next);
        if (move === -1) return prev;
        next[move] = 'O';

        const winner = checkWinner(next);
        if (winner === 'O') {
          setStatus('ai_win');
          tryHaptic(() => hapticFeedback.notificationOccurred('error'));
        } else if (isBoardFull(next)) {
          setStatus('draw');
          tryHaptic(() => hapticFeedback.notificationOccurred('warning'));
        } else {
          setStatus('player_turn');
          tryHaptic(() => hapticFeedback.impactOccurred('light'));
        }

        return next;
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [status]);

  const play = useCallback(
    (index: number) => {
      if (status !== 'player_turn') return;
      if (board[index] !== null) return;

      const next = [...board] as Board;
      next[index] = 'X';

      tryHaptic(() => hapticFeedback.impactOccurred('medium'));

      const winner = checkWinner(next);
      if (winner === 'X') {
        setBoard(next);
        setStatus('player_win');
        tryHaptic(() => hapticFeedback.notificationOccurred('success'));
        return;
      }

      if (isBoardFull(next)) {
        setBoard(next);
        setStatus('draw');
        tryHaptic(() => hapticFeedback.notificationOccurred('warning'));
        return;
      }

      setBoard(next);
      setStatus('ai_thinking');
    },
    [board, status],
  );

  return {
    board,
    status,
    statusText: STATUS_TEXT[status],
    play,
    reset,
    isGameOver: status === 'player_win' || status === 'ai_win' || status === 'draw',
  } as const;
}
