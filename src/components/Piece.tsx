import { Piece as PieceType } from '../types/chess';
import { getPieceSymbol } from '../utils/chessLogic';

interface PieceProps {
  piece: PieceType;
}

/** 駒コンポーネント */
export function Piece({ piece }: PieceProps) {
  return (
    <span className={`piece ${piece.color}`}>
      {getPieceSymbol(piece)}
    </span>
  );
}
