/** 駒の種類 */
export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

/** プレイヤーの色 */
export type Color = 'white' | 'black';

/** 駒の情報 */
export interface Piece {
  type: PieceType;
  color: Color;
}

/** ボード上のマス（駒がない場合はnull） */
export type Square = Piece | null;

/** 8x8のチェスボード */
export type Board = Square[][];

/** 盤面上の位置 */
export interface Position {
  row: number;
  col: number;
}

/** ゲームの状態 */
export interface GameState {
  board: Board;
  currentTurn: Color;
  selectedPosition: Position | null;
  validMoves: Position[];
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  moveHistory: Move[];
}

/** 移動の記録 */
export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece: Piece | null;
  isCheck: boolean;
  isCheckmate: boolean;
}
