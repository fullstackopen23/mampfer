import Figures from './Figures'
import Board from './Board'
import { useState } from 'react'
import {
  isPlayable,
  checkWinner,
  canMove,
  getRandomInt,
} from '../utils/utils'
import {
  COMPUTER_THINK_TIME,
  initalBlueFigures,
  initalSquares,
  initalRedFigures,
} from '../utils/constants'

export default function Game() {
  const [opponent, setOpponent] = useState('hard')
  const [winner, setWinner] = useState(null)
  const [selectedFigure, setSelectedFigure] = useState(null)
  const [isGameover, setIsGameover] = useState(false)
  const [isRedsTurn, setIsRedsTurn] = useState(true)
  const [redFigures, setRedFigures] = useState(initalRedFigures)
  const [blueFigures, setBlueFigures] = useState(initalBlueFigures)
  const [squares, setSquares] = useState(initalSquares)

  function handleSelectClick(figure) {
    if (isGameover) return
    if (isRedsTurn && figure.team === 'red') {
      setSelectedFigure(figure)
    } else if (!isRedsTurn && figure.team === 'blue') {
      setSelectedFigure(figure)
    } else {
      return
    }

    // highlight playable squares
    const highlightedSquares = squares.map((square) => {
      if (isPlayable(square, figure)) {
        return { ...square, playable: true }
      } else {
        return square
      }
    })
    setSquares(highlightedSquares)
  }

  function restartGame() {
    setBlueFigures(initalBlueFigures)
    setRedFigures(initalRedFigures)
    setSquares(
      squares.map((s) => {
        return {
          ...s,
          playable: false,
          figuresOnSquare: [],
          winner: false,
        }
      })
    )
    setIsRedsTurn(true)
    setIsGameover(false)
    setSelectedFigure(null)
    setWinner(null)
  }

  function handleWin(updatedSquares, winner) {
    setIsGameover(true)
    const showWinnerSquares = updatedSquares.map((square) => {
      if (winner.squares.includes(square.id)) {
        return { ...square, winner: true }
      } else {
        return square
      }
    })
    setSquares(showWinnerSquares)
  }

  function placeFigure(clickedSquare) {
    if (
      isGameover ||
      !selectedFigure ||
      !isPlayable(clickedSquare, selectedFigure)
    )
      return

    // add figure to squares, delete figure from square, and mark them as unplayable
    const updatedSquares = squares.map((square) => {
      if (clickedSquare.id === square.id) {
        square.figuresOnSquare.push(selectedFigure)
        return { ...square, playable: false }
      } else if (selectedFigure?.on === square.id) {
        square.figuresOnSquare.pop()
        return { ...square, playable: false }
      } else {
        return { ...square, playable: false }
      }
    })

    // add the on property on the figure played
    const tempFigures = isRedsTurn ? redFigures : blueFigures
    const updatedFigures = tempFigures.map((figure) => {
      if (figure.id === selectedFigure.id) {
        return { ...figure, onBoard: true, on: clickedSquare.id }
      } else {
        return figure
      }
    })

    if (isRedsTurn) setRedFigures(updatedFigures)
    else setBlueFigures(updatedFigures)
    setSquares(updatedSquares)
    setSelectedFigure(null)
    setIsRedsTurn(!isRedsTurn)

    if (checkWinner(updatedSquares)) {
      handleWin(updatedSquares, checkWinner(updatedSquares))
      setWinner(checkWinner(updatedSquares))
    }

    setTimeout(() => {
      if (!winner) {
        if (opponent !== 'friend') {
          handleComputerPlay(updatedFigures, updatedSquares)
          if (checkWinner(updatedSquares)) {
            handleWin(updatedSquares, checkWinner(updatedSquares))
            setWinner(checkWinner(updatedSquares))
          }
        }
      }
    }, COMPUTER_THINK_TIME)
  }

  function handleComputerPlay(updatedRedFigures, updatedSquares) {
    if (isGameover) return
    const bestMove = findBestMove(updatedRedFigures, updatedSquares)

    const [selectedFigure] = blueFigures.filter(
      (bf) => bf.id === bestMove.figure
    )
    console.log(selectedFigure)
    const updatedSquaresAfterAIplayed = updatedSquares.map(
      (square) => {
        if (bestMove.target === square.id) {
          square.figuresOnSquare.push(selectedFigure)
          return { ...square, playable: false }
        } else if (selectedFigure?.on === square.id) {
          square.figuresOnSquare.pop()
          return { ...square, playable: false }
        } else {
          return { ...square, playable: false }
        }
      }
    )
    const updatedFiguresAfterAIPlayed = blueFigures.map((figure) => {
      if (figure.id === selectedFigure.id) {
        return { ...figure, onBoard: true, on: bestMove.target }
      } else {
        return figure
      }
    })
    setSquares(updatedSquaresAfterAIplayed)
    setIsRedsTurn(true)
    setBlueFigures(updatedFiguresAfterAIPlayed)
  }

  function findBestMove(updatedRedFigures, updatedSquares) {
    let bestScore = -Infinity
    let bestMove
    let playableMoves = []

    for (let i = 0; i < blueFigures.length; i++) {
      updatedSquares.map((square) => {
        if (isPlayable(square, blueFigures[i])) {
          playableMoves.push({
            figure: blueFigures[i].id,
            target: square.id,
          })
        }
      })
    }

    playableMoves.map((move) => {
      let score = minimax(
        move,
        0,
        true,
        updatedSquares,
        blueFigures,
        updatedRedFigures
      )
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
    })
    return bestMove
  }

  const scores = {
    red: -1,
    blue: 1,
  }

  function minimax(
    move,
    depth,
    isMaximizing,
    squares,
    blueFigures,
    redFigures
  ) {
    // if depth > 1 return -10, otherwise call stack exceeds
    if (depth > 1) return -10

    const updatedSquares = JSON.parse(JSON.stringify(squares))
    // get the figure played
    let [figure] = [...redFigures, ...blueFigures].filter(
      (figure) => figure.id === move.figure
    )
    // updated the board squares
    updatedSquares.map((square) => {
      if (move.target === square.id) {
        square.figuresOnSquare.push(isMaximizing ? figure : figure)
        return square
      } else if (
        figure?.on === square.id ||
        figure?.on === square.id
      ) {
        square.figuresOnSquare.pop()
        return square
      } else {
        return square
      }
    })

    // check if there is a winner / terminal state.
    // if red wins: return -1, if blue (AI) wins: return 1
    const winner = checkWinner(updatedSquares)
    if (winner) {
      return scores[winner.winnerTeam]
    }

    if (isMaximizing) {
      // redfigures turn, minimizing player
      let bestScore = Infinity
      let playableMoves = []

      // check playableRedFigures and update the onBoard and on prop.
      const playableRedFigures = redFigures
        .filter((rf) => canMove(squares, rf))
        .map((rf) => {
          if (rf.id === move.figure) {
            return { ...rf, onBoard: true, on: move.target }
          } else {
            return rf
          }
        })

      for (let i = 0; i < playableRedFigures.length; i++) {
        updatedSquares.map((square) => {
          if (isPlayable(square, playableRedFigures[i])) {
            playableMoves.push({
              figure: playableRedFigures[i].id,
              target: square.id,
            })
          }
        })
      }

      playableMoves.map((move) => {
        let score = minimax(
          move,
          depth + 1,
          false,
          updatedSquares,
          playableRedFigures,
          blueFigures
        )
        if (score < bestScore) {
          bestScore = score
        }
      })
      return bestScore
    } else {
      let bestScore = -Infinity
      let playableMoves = []

      const playableBlueFigures = blueFigures
        .filter((bf) => canMove(squares, bf))
        .map((bf) => {
          if (bf.id === move.figure) {
            return { ...bf, onBoard: true, on: move.target }
          } else {
            return bf
          }
        })

      for (let i = 0; i < playableBlueFigures.length; i++) {
        updatedSquares.map((square) => {
          if (isPlayable(square, playableBlueFigures[i])) {
            playableMoves.push({
              figure: playableBlueFigures[i].id,
              target: square.id,
            })
          }
        })
      }

      let score
      playableMoves.map((move) => {
        score = minimax(
          move,
          depth + 1,
          false,
          updatedSquares,
          playableBlueFigures,
          redFigures
        )
        if (score > bestScore) {
          bestScore = score
        }
      })
      return bestScore
    }
  }

  return (
    <div className="gameContainer">
      <select
        onChange={(e) => {
          setOpponent(e.target.value)
          restartGame()
        }}
      >
        <option value="easy">Easy</option>
        <option value="hard">Hard</option>
        <option value="friend">Play with a friend</option>
      </select>

      {isRedsTurn && !isGameover ? (
        <p className="turnInfo">It's reds turn.</p>
      ) : (
        <p className="turnInfo">It's blues turn.</p>
      )}

      {isGameover ? (
        <button id="restartBtn" onClick={restartGame}>
          Restart
        </button>
      ) : (
        ''
      )}

      <Figures
        selectFigure={handleSelectClick}
        figures={redFigures}
        redFigures={redFigures}
        blueFigures={blueFigures}
        isRedsTurn={isRedsTurn}
      ></Figures>
      <Board
        selectFigure={handleSelectClick}
        placeFigure={placeFigure}
        squares={squares}
        isRedsTurn={isRedsTurn}
        redFigures={redFigures}
        blueFigures={blueFigures}
      ></Board>
      <Figures
        selectFigure={handleSelectClick}
        figures={blueFigures}
        isRedsTurn={!isRedsTurn}
        redFigures={redFigures}
        blueFigures={blueFigures}
      ></Figures>
    </div>
  )
}
