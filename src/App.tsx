import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Board } from './game/Board';
import { useGameState } from './game/useGameState';
import './App.css';

const COLOR_PALETTES = [
  { paper: '#DCC66C', ink: '#1C1814', faint: '#B5A255' }, // golden ochre
  { paper: '#C9E4CA', ink: '#1B2D2A', faint: '#8BB08D' }, // sage green
  { paper: '#D4B8E0', ink: '#2A1830', faint: '#A07AAF' }, // lavender
  { paper: '#F0C4A8', ink: '#2E1A0E', faint: '#C49070' }, // peach
  { paper: '#A8D4E6', ink: '#0F2A36', faint: '#6DA4BA' }, // sky blue
  { paper: '#F2B6B6', ink: '#3A1414', faint: '#C47878' }, // dusty rose
  { paper: '#E6D9A8', ink: '#2A2410', faint: '#BFB170' }, // warm sand
  { paper: '#B8DED2', ink: '#142A24', faint: '#7AB5A2' }, // mint
];

function useRulerTicks() {
  return useMemo(() => {
    const totalHeight = 900;
    const tickSpacing = 10;
    const count = Math.ceil(totalHeight / tickSpacing);
    const ticks: { id: number; type: string; showNumber: boolean; numberValue: string; top: number }[] = [];

    for (let i = 0; i <= count; i++) {
      let type = 'micro';
      let showNumber = false;
      let numberValue = '';

      if (i % 10 === 0) {
        type = 'major';
        showNumber = true;
        numberValue = (i / 10).toString().padStart(2, '0');
      } else if (i % 5 === 0) {
        type = 'minor';
      }

      ticks.push({ id: i, type, showNumber, numberValue, top: i * tickSpacing });
    }
    return ticks;
  }, []);
}

function useStrikeLine() {
  const [strike, setStrike] = useState({ path: '', animate: false });

  const drawStrike = (indices: number[]) => {
    const getCoord = (idx: number) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      return { x: col * 100 + 50, y: row * 100 + 50 };
    };

    const start = getCoord(indices[0]);
    const end = getCoord(indices[2]);

    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const ext = 40;

    const x1 = start.x - Math.cos(angle) * ext;
    const y1 = start.y - Math.sin(angle) * ext;
    const x2 = end.x + Math.cos(angle) * ext;
    const y2 = end.y + Math.sin(angle) * ext;

    setStrike({ path: `M${x1},${y1} L${x2},${y2}`, animate: true });
  };

  const resetStrike = () => setStrike({ path: '', animate: false });

  return { strike, drawStrike, resetStrike };
}

const AUTO_RESTART_MS = 3000;

export default function App() {
  const { board, status, play, reset, isGameOver } = useGameState();
  const rulerTicks = useRulerTicks();
  const { strike, drawStrike, resetStrike } = useStrikeLine();
  const [gameCount, setGameCount] = useState(0);
  const [autoRestartActive, setAutoRestartActive] = useState(false);
  const autoRestartTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const palette = COLOR_PALETTES[gameCount % COLOR_PALETTES.length];

  // Apply palette as CSS custom properties
  useEffect(() => {
    document.documentElement.style.setProperty('--c-paper', palette.paper);
    document.documentElement.style.setProperty('--c-ink', palette.ink);
    document.documentElement.style.setProperty('--c-faint', palette.faint);
  }, [palette]);

  // Check for winning line to draw strike
  useEffect(() => {
    if (status === 'player_win' || status === 'ai_win') {
      const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];
      for (const cond of winConditions) {
        const [a, b, c] = cond;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
          drawStrike(cond);
          break;
        }
      }
    }
  }, [status]);

  const handleReset = useCallback(() => {
    if (autoRestartTimer.current) {
      clearTimeout(autoRestartTimer.current);
      autoRestartTimer.current = null;
    }
    setAutoRestartActive(false);
    reset();
    resetStrike();
    setGameCount((c) => c + 1);
  }, [reset, resetStrike]);

  // Auto-restart when game ends
  useEffect(() => {
    if (!isGameOver) return;

    setAutoRestartActive(true);
    autoRestartTimer.current = setTimeout(() => {
      handleReset();
    }, AUTO_RESTART_MS);

    return () => {
      if (autoRestartTimer.current) {
        clearTimeout(autoRestartTimer.current);
      }
    };
  }, [isGameOver, handleReset]);

  const statusLabel =
    status === 'player_turn' || status === 'ai_thinking'
      ? 'IN PROGRESS'
      : status === 'player_win'
        ? 'VICTORY: X'
        : status === 'ai_win'
          ? 'VICTORY: O'
          : 'STALEMATE';

  const turnLabel = status === 'ai_thinking' ? 'AI (O)' : 'PLAYER (X)';

  return (
    <div className="app">
      {/* Ruler strip */}
      <div className="ruler">
        {rulerTicks.map((tick) => (
          <div key={tick.id}>
            {tick.showNumber && (
              <div className="ruler__number" style={{ top: `${tick.top - 7}px` }}>
                {tick.numberValue}
              </div>
            )}
            <div
              className={`ruler__tick ruler__tick--${tick.type}`}
              style={{ top: `${tick.top}px` }}
            />
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="app__container">
        <header className="header">
          <h1 className="header__title">Tac-Tic-Seq.</h1>
          <div className="header__subtitle">Department of Strategy</div>
        </header>

        <div className="stats">
          <div className="stats__row">
            <span className="stats__label">01. Current Turn:</span>
            <span>{turnLabel}</span>
          </div>
          <div className="stats__row">
            <span className="stats__label">02. Game Sequence:</span>
            <span>#{(gameCount + 1).toString().padStart(4, '0')}</span>
          </div>
          <div className="stats__row">
            <span className="stats__label">03. Status:</span>
            <span>{statusLabel}</span>
          </div>
        </div>

        <div className="game-wrapper">
          <svg className="strike-svg" viewBox="0 0 300 300" preserveAspectRatio="none">
            <path
              className={`strike-path ${strike.animate ? 'strike-path--animate' : ''}`}
              d={strike.path}
            />
          </svg>
          <Board
            board={board}
            onPlay={play}
            disabled={status !== 'player_turn'}
          />
        </div>

        <button
          className={`app__reset ${autoRestartActive ? 'app__reset--filling' : ''}`}
          onClick={handleReset}
        >
          {autoRestartActive ? 'Next sequence...' : 'Initiate New Sequence'}
          {autoRestartActive && <span className="app__reset-fill" />}
        </button>

        <div className="specs">
          <div className="specs__title">Specifications:</div>
          <div className="specs__item">
            <span className="specs__num">04.</span>
            <span>Minimax AI. Unbeatable 3x3 combinatorial logic.</span>
          </div>
          <div className="specs__item">
            <span className="specs__num">05.</span>
            <span>Grid lines: 4px solid ink. Telegram Mini App format.</span>
          </div>
          <div className="specs__item">
            <span className="specs__num">06.</span>
            <span>Digital manufacture. No warranties implied or expressed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
