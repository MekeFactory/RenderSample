import { useCallback, useState } from 'react';
import { Color, GameState, Move, Piece, Position } from '../types/chess';
import {
  createInitialBoard,
  getPiece,
  getValidMoves,
  isCheckmate,
  isKingInCheck,
  isStalemate,
  movePiece
} from '../utils/chessLogic';

/** チェスゲームのカスタムフック */
export function useChess() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createInitialBoard(),
    currentTurn: 'white',
    selectedPosition: null,
    validMoves: [],
    capturedPieces: { white: [], black: [] },
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    moveHistory: []
  }));

  /** マスをクリックしたときの処理 */
  const handleSquareClick = useCallback((pos: Position) => {
    setGameState(prev => {
      // ゲーム終了時はクリック無効
      if (prev.isCheckmate || prev.isStalemate) {
        return prev;
      }

      const clickedPiece = getPiece(prev.board, pos);

      // 駒が選択されていない場合
      if (prev.selectedPosition === null) {
        // 自分の駒をクリックした場合、選択する
        if (clickedPiece && clickedPiece.color === prev.currentTurn) {
          const validMoves = getValidMoves(prev.board, pos);
          return {
            ...prev,
            selectedPosition: pos,
            validMoves
          };
        }
        return prev;
      }

      // すでに駒が選択されている場合
      const selectedPiece = getPiece(prev.board, prev.selectedPosition);
      if (!selectedPiece) return prev;

      // 同じマスをクリックした場合、選択解除
      if (prev.selectedPosition.row === pos.row && prev.selectedPosition.col === pos.col) {
        return {
          ...prev,
          selectedPosition: null,
          validMoves: []
        };
      }

      // 自分の他の駒をクリックした場合、選択を切り替え
      if (clickedPiece && clickedPiece.color === prev.currentTurn) {
        const validMoves = getValidMoves(prev.board, pos);
        return {
          ...prev,
          selectedPosition: pos,
          validMoves
        };
      }

      // 有効な移動先をクリックした場合、駒を移動
      const isValidMove = prev.validMoves.some(m => m.row === pos.row && m.col === pos.col);
      if (isValidMove) {
        const newBoard = movePiece(prev.board, prev.selectedPosition, pos);
        const nextTurn: Color = prev.currentTurn === 'white' ? 'black' : 'white';
        const newIsCheck = isKingInCheck(newBoard, nextTurn);
        const newIsCheckmate = isCheckmate(newBoard, nextTurn);
        const newIsStalemate = isStalemate(newBoard, nextTurn);

        // 取った駒を記録
        const newCapturedPieces = { ...prev.capturedPieces };
        if (clickedPiece) {
          if (clickedPiece.color === 'white') {
            newCapturedPieces.white = [...newCapturedPieces.white, clickedPiece];
          } else {
            newCapturedPieces.black = [...newCapturedPieces.black, clickedPiece];
          }
        }

        // 移動履歴を記録
        const move: Move = {
          from: prev.selectedPosition,
          to: pos,
          piece: selectedPiece,
          capturedPiece: clickedPiece,
          isCheck: newIsCheck,
          isCheckmate: newIsCheckmate
        };

        return {
          ...prev,
          board: newBoard,
          currentTurn: nextTurn,
          selectedPosition: null,
          validMoves: [],
          capturedPieces: newCapturedPieces,
          isCheck: newIsCheck,
          isCheckmate: newIsCheckmate,
          isStalemate: newIsStalemate,
          moveHistory: [...prev.moveHistory, move]
        };
      }

      return prev;
    });
  }, []);

  /** ゲームをリセット */
  const resetGame = useCallback(() => {
    setGameState({
      board: createInitialBoard(),
      currentTurn: 'white',
      selectedPosition: null,
      validMoves: [],
      capturedPieces: { white: [], black: [] },
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      moveHistory: []
    });
  }, []);

  /** 選択を解除 */
  const clearSelection = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      selectedPosition: null,
      validMoves: []
    }));
  }, []);

  return {
    gameState,
    handleSquareClick,
    resetGame,
    clearSelection
  };
}

/** 取った駒の合計価値を計算 */
export function calculateMaterialValue(pieces: Piece[]): number {
  const values: Record<string, number> = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };
  return pieces.reduce((sum, piece) => sum + values[piece.type], 0);
}
