import { Board } from './components/Board';
import { GameInfo } from './components/GameInfo';
import { useChess } from './hooks/useChess';
import './App.css';

function App() {
  const { gameState, handleSquareClick, resetGame } = useChess();

  return (
    <div className="app">
      <header className="header">
        <h1>♔ チェス ♚</h1>
      </header>
      
      <main className="main">
        <div className="game-container">
          <Board gameState={gameState} onSquareClick={handleSquareClick} />
          <GameInfo gameState={gameState} onReset={resetGame} />
        </div>
      </main>

      <footer className="footer">
        <p>React + Vite + TypeScript で作成</p>
      </footer>
    </div>
  );
}

export default App;
