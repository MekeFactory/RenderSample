import { Board, Color, Piece, PieceType, Position, Square } from '../types/chess';

/** 初期盤面を作成 */
export function createInitialBoard(): Board {
  const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));

  // 黒の駒（上側）
  const backRowBlack: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRowBlack[col], color: 'black' };
    board[1][col] = { type: 'pawn', color: 'black' };
  }

  // 白の駒（下側）
  const backRowWhite: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  for (let col = 0; col < 8; col++) {
    board[7][col] = { type: backRowWhite[col], color: 'white' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  return board;
}

/** 指定位置が盤面内かチェック */
function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

/** 指定位置の駒を取得 */
export function getPiece(board: Board, pos: Position): Square {
  return board[pos.row][pos.col];
}

/** 直線方向の移動可能位置を取得（ルーク、クイーン用） */
function getStraightMoves(board: Board, pos: Position, color: Color): Position[] {
  const moves: Position[] = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (const [dRow, dCol] of directions) {
    let row = pos.row + dRow;
    let col = pos.col + dCol;

    while (isInBounds(row, col)) {
      const piece = board[row][col];
      if (piece === null) {
        moves.push({ row, col });
      } else if (piece.color !== color) {
        moves.push({ row, col });
        break;
      } else {
        break;
      }
      row += dRow;
      col += dCol;
    }
  }

  return moves;
}

/** 斜め方向の移動可能位置を取得（ビショップ、クイーン用） */
function getDiagonalMoves(board: Board, pos: Position, color: Color): Position[] {
  const moves: Position[] = [];
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  for (const [dRow, dCol] of directions) {
    let row = pos.row + dRow;
    let col = pos.col + dCol;

    while (isInBounds(row, col)) {
      const piece = board[row][col];
      if (piece === null) {
        moves.push({ row, col });
      } else if (piece.color !== color) {
        moves.push({ row, col });
        break;
      } else {
        break;
      }
      row += dRow;
      col += dCol;
    }
  }

  return moves;
}

/** ナイトの移動可能位置を取得 */
function getKnightMoves(board: Board, pos: Position, color: Color): Position[] {
  const moves: Position[] = [];
  const offsets = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  for (const [dRow, dCol] of offsets) {
    const row = pos.row + dRow;
    const col = pos.col + dCol;

    if (isInBounds(row, col)) {
      const piece = board[row][col];
      if (piece === null || piece.color !== color) {
        moves.push({ row, col });
      }
    }
  }

  return moves;
}

/** キングの移動可能位置を取得 */
function getKingMoves(board: Board, pos: Position, color: Color): Position[] {
  const moves: Position[] = [];
  const offsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (const [dRow, dCol] of offsets) {
    const row = pos.row + dRow;
    const col = pos.col + dCol;

    if (isInBounds(row, col)) {
      const piece = board[row][col];
      if (piece === null || piece.color !== color) {
        moves.push({ row, col });
      }
    }
  }

  return moves;
}

/** ポーンの移動可能位置を取得 */
function getPawnMoves(board: Board, pos: Position, color: Color): Position[] {
  const moves: Position[] = [];
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;

  // 前進
  const forwardRow = pos.row + direction;
  if (isInBounds(forwardRow, pos.col) && board[forwardRow][pos.col] === null) {
    moves.push({ row: forwardRow, col: pos.col });

    // 初期位置から2マス前進
    const doubleForwardRow = pos.row + direction * 2;
    if (pos.row === startRow && board[doubleForwardRow][pos.col] === null) {
      moves.push({ row: doubleForwardRow, col: pos.col });
    }
  }

  // 斜め前方への攻撃
  for (const dCol of [-1, 1]) {
    const attackCol = pos.col + dCol;
    if (isInBounds(forwardRow, attackCol)) {
      const piece = board[forwardRow][attackCol];
      if (piece !== null && piece.color !== color) {
        moves.push({ row: forwardRow, col: attackCol });
      }
    }
  }

  return moves;
}

/** 特定の駒の移動可能位置を取得（チェック考慮なし） */
function getRawMoves(board: Board, pos: Position): Position[] {
  const piece = board[pos.row][pos.col];
  if (piece === null) return [];

  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, pos, piece.color);
    case 'knight':
      return getKnightMoves(board, pos, piece.color);
    case 'bishop':
      return getDiagonalMoves(board, pos, piece.color);
    case 'rook':
      return getStraightMoves(board, pos, piece.color);
    case 'queen':
      return [...getStraightMoves(board, pos, piece.color), ...getDiagonalMoves(board, pos, piece.color)];
    case 'king':
      return getKingMoves(board, pos, piece.color);
    default:
      return [];
  }
}

/** キングの位置を取得 */
export function findKing(board: Board, color: Color): Position | null {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
}

/** 指定の色がチェック状態かどうか判定 */
export function isKingInCheck(board: Board, color: Color): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  const opponentColor = color === 'white' ? 'black' : 'white';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === opponentColor) {
        const moves = getRawMoves(board, { row, col });
        if (moves.some(m => m.row === kingPos.row && m.col === kingPos.col)) {
          return true;
        }
      }
    }
  }

  return false;
}

/** 駒を移動した後の盤面を作成 */
export function movePiece(board: Board, from: Position, to: Position): Board {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;

  // ポーンのプロモーション（簡易版：クイーンに自動昇格）
  const piece = newBoard[to.row][to.col];
  if (piece && piece.type === 'pawn') {
    if ((piece.color === 'white' && to.row === 0) || (piece.color === 'black' && to.row === 7)) {
      newBoard[to.row][to.col] = { type: 'queen', color: piece.color };
    }
  }

  return newBoard;
}

/** 有効な移動位置を取得（自分のキングをチェックに晒さない移動のみ） */
export function getValidMoves(board: Board, pos: Position): Position[] {
  const piece = board[pos.row][pos.col];
  if (!piece) return [];

  const rawMoves = getRawMoves(board, pos);
  const validMoves: Position[] = [];

  for (const move of rawMoves) {
    const newBoard = movePiece(board, pos, move);
    if (!isKingInCheck(newBoard, piece.color)) {
      validMoves.push(move);
    }
  }

  return validMoves;
}

/** 指定の色に有効な移動があるか判定 */
export function hasValidMoves(board: Board, color: Color): boolean {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getValidMoves(board, { row, col });
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

/** チェックメイト判定 */
export function isCheckmate(board: Board, color: Color): boolean {
  return isKingInCheck(board, color) && !hasValidMoves(board, color);
}

/** ステイルメイト判定 */
export function isStalemate(board: Board, color: Color): boolean {
  return !isKingInCheck(board, color) && !hasValidMoves(board, color);
}

/** 駒のUnicode記号を取得 */
export function getPieceSymbol(piece: Piece): string {
  const symbols: Record<Color, Record<PieceType, string>> = {
    white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    },
    black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟'
    }
  };
  return symbols[piece.color][piece.type];
}
