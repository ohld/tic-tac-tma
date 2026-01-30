import { Board } from './game/Board';
import { useGameState } from './game/useGameState';
import './App.css';

export default function App() {
  const { board, statusText, status, play, reset, isGameOver } = useGameState();

  return (
    <div className="app">
      <h1 className="app__title">Крестики-нолики</h1>
      <p className={`app__status ${isGameOver ? 'app__status--done' : ''}`}>
        {statusText}
      </p>
      <Board
        board={board}
        onPlay={play}
        disabled={status !== 'player_turn'}
      />
      <button className="app__reset" onClick={reset}>
        Новая игра
      </button>
    </div>
  );
}
