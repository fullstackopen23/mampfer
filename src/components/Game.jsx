import Figures from './Figures'
import Board from './Board'
import { useState } from 'react'
import {
  isPlayable,
  checkWinner,
  calculateFigureIndex,
  calculateSquareIndex,
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
    console.log(figure, 'hiuhuhu')
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
          handleComputerPlay()
          if (checkWinner(updatedSquares)) {
            handleWin(updatedSquares, checkWinner(updatedSquares))
            setWinner(checkWinner(updatedSquares))
          }
        }
      }
    }, COMPUTER_THINK_TIME)
  }

  function handleComputerPlay() {
    console.log('computer plays...')
    if (isGameover) return
    const figureIndex = calculateFigureIndex(
      opponent,
      redFigures,
      blueFigures,
      squares
    )
    const [computerFigure] = blueFigures.filter((f) => {
      if (f.id === figureIndex) {
        return f
      }
    })

    console.log(computerFigure)
    const squareIndex = calculateSquareIndex(
      opponent,
      redFigures,
      blueFigures,
      squares,
      computerFigure
    )
    const updatedSquares = squares.map((square) => {
      if (square.id === squareIndex) {
        square.figuresOnSquare.push(computerFigure)
        return { ...square, playable: false }
      } else if (computerFigure?.on === square.id) {
        square.figuresOnSquare.pop()
        return { ...square, playable: false }
      } else {
        return { ...square, playable: false }
      }
    })

    const updateBlueFigures = blueFigures.map((figure) => {
      if (figure.id === computerFigure.id) {
        return { ...figure, onBoard: true, on: squareIndex }
      } else {
        return figure
      }
    })

    setSquares(updatedSquares)
    setBlueFigures(updateBlueFigures)
    setIsRedsTurn(true)
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
