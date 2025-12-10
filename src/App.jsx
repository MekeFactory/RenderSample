import { useMemo, useState } from 'react'
import { Chess } from 'chess.js'
import './App.css'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const ranks = [8, 7, 6, 5, 4, 3, 2, 1]

const PIECE_UNICODE = {
  p: { w: '♙', b: '♟︎' },
  r: { w: '♖', b: '♜' },
  n: { w: '♘', b: '♞' },
  b: { w: '♗', b: '♝' },
  q: { w: '♕', b: '♛' },
  k: { w: '♔', b: '♚' },
}

const buildGameFromHistory = (history) => {
  const instance = new Chess()
  history.forEach((move) => instance.move(move))
  return instance
}

const formatStatus = (game) => {
  if (game.isCheckmate()) {
    return `${game.turn() === 'w' ? '黒' : '白'}の勝利（チェックメイト）`
  }
  if (game.isStalemate()) return 'ステイルメイト（引き分け）'
  if (game.isInsufficientMaterial()) return '駒不足のため引き分け'
  if (game.isThreefoldRepetition()) return '同一局面三回（引き分け申請可）'
  if (game.isDraw()) return '引き分け（50手ルール等）'

  const turn = game.turn() === 'w' ? '白' : '黒'
  const checkSuffix = game.inCheck() ? '：チェック中' : ''
  return `${turn}の手番${checkSuffix}`
}

const groupMoves = (verboseMoves) => {
  const rows = []
  for (let i = 0; i < verboseMoves.length; i += 2) {
    rows.push({
      turn: i / 2 + 1,
      white: verboseMoves[i]?.san ?? '',
      black: verboseMoves[i + 1]?.san ?? '',
    })
  }
  return rows
}

function App() {
  const [sanMoves, setSanMoves] = useState([])
  const [selectedSquare, setSelectedSquare] = useState(null)

  const game = useMemo(() => buildGameFromHistory(sanMoves), [sanMoves])
  const verboseHistory = game.history({ verbose: true })
  const groupedHistory = useMemo(() => groupMoves(verboseHistory), [verboseHistory])
  const lastMove = verboseHistory.at(-1)
  const lastMoveSquares = new Set(lastMove ? [lastMove.from, lastMove.to] : [])
  const availableTargets = new Set(
    selectedSquare
      ? game.moves({ square: selectedSquare, verbose: true }).map((move) => move.to)
      : [],
  )

  const handleSquareClick = (square) => {
    if (selectedSquare === square) {
      setSelectedSquare(null)
      return
    }

    const piece = game.get(square)
    const isPlayersPiece = piece && piece.color === game.turn()

    if (!selectedSquare) {
      if (isPlayersPiece && !game.isGameOver()) {
        setSelectedSquare(square)
      }
      return
    }

    if (game.isGameOver()) {
      setSelectedSquare(null)
      return
    }

    const clone = buildGameFromHistory(sanMoves)
    const moveResult = clone.move({ from: selectedSquare, to: square, promotion: 'q' })

    if (moveResult) {
      setSanMoves(clone.history())
      setSelectedSquare(null)
      return
    }

    if (isPlayersPiece) {
      setSelectedSquare(square)
    } else {
      setSelectedSquare(null)
    }
  }

  const handleUndo = () => {
    if (!sanMoves.length) return
    setSanMoves((prev) => prev.slice(0, -1))
    setSelectedSquare(null)
  }

  const handleReset = () => {
    setSanMoves([])
    setSelectedSquare(null)
  }

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">Render Static Sites サンプル</p>
        <h1>Minimal Chess</h1>
        <p className="subtitle">
          Reactとchess.jsで構築した、Render.comへすぐに載せられる静的チェスアプリです。
          直感的なUIと簡単なセットアップで、デモや学習用途に活用できます。
        </p>
      </header>

      <section className="main-section">
        <div className="board-card">
          <div className="board-wrapper">
            <div className="board-grid">
              {game.board().map((rank, rankIndex) =>
                rank.map((square, fileIndex) => {
                  const rankNumber = 8 - rankIndex
                  const fileLetter = files[fileIndex]
                  const squareName = `${fileLetter}${rankNumber}`
                  const pieceSymbol = square ? PIECE_UNICODE[square.type][square.color] : ''
                  const isDark = (rankIndex + fileIndex) % 2 !== 0
                  const isSelected = selectedSquare === squareName
                  const isHighlight = availableTargets.has(squareName)
                  const isLastMove = lastMoveSquares.has(squareName)
                  const squareClasses = [
                    'square',
                    isDark ? 'square-dark' : 'square-light',
                    isSelected ? 'selected' : '',
                    isHighlight ? 'highlight' : '',
                    isLastMove ? 'last-move' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <button
                      type="button"
                      className={squareClasses}
                      key={squareName}
                      onClick={() => handleSquareClick(squareName)}
                      aria-label={`${squareName} ${pieceSymbol ? `に${pieceSymbol}` : '空き'}`}
                    >
                      <span className="piece">{pieceSymbol}</span>
                      <span className="square-label">{squareName}</span>
                    </button>
                  )
                }),
              )}
            </div>
            <div className="board-file-labels">
              {files.map((file) => (
                <span key={`file-${file}`}>{file}</span>
              ))}
            </div>
            <div className="board-rank-labels">
              {ranks.map((rankNumber) => (
                <span key={`rank-${rankNumber}`}>{rankNumber}</span>
              ))}
            </div>
          </div>
          {game.isGameOver() && (
            <p className="gameover-info">対局終了：{formatStatus(game)}</p>
          )}
        </div>

        <aside className="info-panel">
          <div className="status-card">
            <h2>現在の状況</h2>
            <p className="status-text">{formatStatus(game)}</p>
            <p className="muted">手数: {verboseHistory.length}</p>
            {lastMove && (
              <p className="muted">
                直前の指し手: <strong>{lastMove.san}</strong>
              </p>
            )}
            <div className="controls">
              <button type="button" onClick={handleUndo} disabled={!sanMoves.length}>
                1手戻す
              </button>
              <button type="button" onClick={handleReset}>
                リセット
              </button>
            </div>
          </div>

          <div className="tips-card">
            <h3>活用ヒント</h3>
            <ul>
              <li>静的ビルド（npm run build）のみでRenderへ配置可能</li>
              <li>chess.jsがルール判定を担うため、複雑な実装不要</li>
              <li>UIはCSSのみで構成され、好みのブランドカラーに差し替えやすい</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="moves-section">
        <div className="moves-card">
          <div className="moves-header">
            <h2>棋譜（SAN形式）</h2>
            <span className="muted">クリックだけで記録されます</span>
          </div>
          {groupedHistory.length ? (
            <table>
              <thead>
                <tr>
                  <th>手数</th>
                  <th>白</th>
                  <th>黒</th>
                </tr>
              </thead>
              <tbody>
                {groupedHistory.map((row) => (
                  <tr key={`turn-${row.turn}`}>
                    <td>{row.turn}</td>
                    <td>{row.white || '—'}</td>
                    <td>{row.black || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">まだ指し手はありません。駒をクリックして対局を開始しましょう。</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
