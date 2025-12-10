import { GameState, Position } from '../types/chess';
import { findKing } from '../utils/chessLogic';
import { Square } from './Square';

interface BoardProps {
  gameState: GameState;
  onSquareClick: (pos: Position) => void;
}

/** チェスボードコンポーネント */
export function Board({ gameState, onSquareClick }: BoardProps) {
  const { board, selectedPosition, validMoves, isCheck, currentTurn } = gameState;

  // チェック状態のキングの位置を取得
  const checkedKingPos = isCheck ? findKing(board, currentTurn) : null;

  const isValidMoveSquare = (row: number, col: number): boolean => {
    return validMoves.some(m => m.row === row && m.col === col);
  };

  const isSelectedSquare = (row: number, col: number): boolean => {
    return selectedPosition?.row === row && selectedPosition?.col === col;
  };

  const isCheckSquare = (row: number, col: number): boolean => {
    return checkedKingPos?.row === row && checkedKingPos?.col === col;
  };

  return (
    <div className="board">
      {/* 列のラベル（上） */}
      <div className="board-labels top">
        <div className="corner-label"></div>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="col-label">{letter}</div>
        ))}
        <div className="corner-label"></div>
      </div>

      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {/* 行のラベル（左） */}
          <div className="row-label">{8 - rowIndex}</div>
          
          {row.map((square, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              square={square}
              position={{ row: rowIndex, col: colIndex }}
              isSelected={isSelectedSquare(rowIndex, colIndex)}
              isValidMove={isValidMoveSquare(rowIndex, colIndex)}
              isCheck={isCheckSquare(rowIndex, colIndex)}
              onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
            />
          ))}

          {/* 行のラベル（右） */}
          <div className="row-label">{8 - rowIndex}</div>
        </div>
      ))}

      {/* 列のラベル（下） */}
      <div className="board-labels bottom">
        <div className="corner-label"></div>
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
          <div key={letter} className="col-label">{letter}</div>
        ))}
        <div className="corner-label"></div>
      </div>
    </div>
  );
}
