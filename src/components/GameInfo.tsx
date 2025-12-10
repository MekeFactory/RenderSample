import { GameState, Piece } from '../types/chess';
import { getPieceSymbol } from '../utils/chessLogic';
import { calculateMaterialValue } from '../hooks/useChess';

interface GameInfoProps {
  gameState: GameState;
  onReset: () => void;
}

/** ゲーム情報コンポーネント */
export function GameInfo({ gameState, onReset }: GameInfoProps) {
  const { currentTurn, capturedPieces, isCheck, isCheckmate, isStalemate, moveHistory } = gameState;

  const getStatusMessage = (): string => {
    if (isCheckmate) {
      const winner = currentTurn === 'white' ? '黒' : '白';
      return `チェックメイト！${winner}の勝利！`;
    }
    if (isStalemate) {
      return 'ステイルメイト！引き分け';
    }
    if (isCheck) {
      return `チェック！${currentTurn === 'white' ? '白' : '黒'}のターン`;
    }
    return `${currentTurn === 'white' ? '白' : '黒'}のターン`;
  };

  const renderCapturedPieces = (pieces: Piece[], color: 'white' | 'black') => {
    const value = calculateMaterialValue(pieces);
    return (
      <div className={`captured-pieces ${color}`}>
        <span className="captured-label">
          {color === 'white' ? '白が取られた駒:' : '黒が取られた駒:'}
        </span>
        <span className="captured-symbols">
          {pieces.map((piece, i) => (
            <span key={i} className="captured-piece">
              {getPieceSymbol(piece)}
            </span>
          ))}
        </span>
        {value > 0 && <span className="material-value">(+{value})</span>}
      </div>
    );
  };

  return (
    <div className="game-info">
      <div className={`status ${isCheckmate ? 'checkmate' : isCheck ? 'check' : ''}`}>
        {getStatusMessage()}
      </div>

      <div className="turn-indicator">
        <div className={`turn-marker ${currentTurn}`}>
          <span className="turn-color">{currentTurn === 'white' ? '♔' : '♚'}</span>
        </div>
      </div>

      <div className="captured-section">
        {renderCapturedPieces(capturedPieces.white, 'white')}
        {renderCapturedPieces(capturedPieces.black, 'black')}
      </div>

      <div className="move-count">
        手数: {moveHistory.length}
      </div>

      <button className="reset-button" onClick={onReset}>
        新しいゲーム
      </button>
    </div>
  );
}
