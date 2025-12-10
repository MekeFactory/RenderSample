import { Position, Square as SquareType } from '../types/chess';
import { Piece } from './Piece';

interface SquareProps {
  square: SquareType;
  position: Position;
  isSelected: boolean;
  isValidMove: boolean;
  isCheck: boolean;
  onClick: () => void;
}

/** マス目コンポーネント */
export function Square({
  square,
  position,
  isSelected,
  isValidMove,
  isCheck,
  onClick
}: SquareProps) {
  const isDark = (position.row + position.col) % 2 === 1;
  
  let className = `square ${isDark ? 'dark' : 'light'}`;
  if (isSelected) className += ' selected';
  if (isValidMove) className += ' valid-move';
  if (isCheck) className += ' check';

  return (
    <div className={className} onClick={onClick}>
      {square && <Piece piece={square} />}
      {isValidMove && !square && <div className="move-indicator" />}
    </div>
  );
}
