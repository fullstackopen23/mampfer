import Figures from "./Figures";
import Board from "./Board";
import { useState } from "react";
import {
  isPlayable,
  checkWinner,
  returnPlayingFigure,
  calculateFigureIndex,
  calculateSquareIndex,
} from "../utils/utils";
import {
  initalBlueFigures,
  initalSquares,
  initalRedFigures,
} from "../utils/constants";

export default function Game() {
  const [opponent, setOpponent] = useState("easy");
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [isGameover, setIsGameover] = useState(false);
  const [isRedsTurn, setIsRedsTurn] = useState(true);
  const [redFigures, setRedFigures] = useState(initalRedFigures);
  const [blueFigures, setBlueFigures] = useState(initalBlueFigures);
  const [squares, setSquares] = useState(initalSquares);

  function handleSelectClick(figure) {
    console.log("selectedfigure:", figure);
    if (isGameover) return;
    if (isRedsTurn && figure.team === "red") {
      setSelectedFigure(figure);
    } else if (!isRedsTurn && figure.team === "blue") {
      setSelectedFigure(figure);
    } else {
      return;
    }

    // highlight playable squares
    const updatedSquares = squares.map((square) => {
      if (isPlayable(square, figure)) {
        return { ...square, playable: true };
      } else {
        return square;
      }
    });
    setSquares(updatedSquares);
  }

  function restartGame() {
    setBlueFigures(initalBlueFigures);
    setRedFigures(initalRedFigures);
    setSquares(
      squares.map((s) => {
        return { ...s, playable: false, figuresOnSquare: [], winner: false };
      })
    );
    setIsRedsTurn(true);
    setIsGameover(false);
    setSelectedFigure(null);
  }

  function handleWin(updatedSquares, winner) {
    setIsGameover(true);
    const showWinnerSquares = updatedSquares.map((square) => {
      if (winner.squares.includes(square.id)) {
        return { ...square, winner: true };
      } else {
        return square;
      }
    });
    setSquares(showWinnerSquares);
  }

  function placeFigure(clickedSquare) {
    if (
      isGameover ||
      !selectedFigure ||
      !isPlayable(clickedSquare, selectedFigure)
    )
      return;

    const playingFigure = returnPlayingFigure(
      redFigures,
      blueFigures,
      selectedFigure
    );

    const updatedSquares = squares.map((square) => {
      if (clickedSquare.id === square.id) {
        square.figuresOnSquare.push(playingFigure);
        return { ...square, playable: false };
      } else if (playingFigure?.on === square.id) {
        square.figuresOnSquare.pop();
        return { ...square, playable: false };
      } else {
        return { ...square, playable: false };
      }
    });

    const tempFigures = isRedsTurn ? redFigures : blueFigures;
    const updatedFigures = tempFigures.map((figure) => {
      if (figure.id === selectedFigure.id) {
        return { ...figure, onBoard: true, on: clickedSquare.id };
      } else {
        return figure;
      }
    });

    if (isRedsTurn) setRedFigures(updatedFigures);
    else setBlueFigures(updatedFigures);
    setSquares(updatedSquares);
    setSelectedFigure(null);
    setIsRedsTurn(!isRedsTurn);

    let winner = checkWinner(updatedSquares);
    if (winner) {
      handleWin(updatedSquares, winner);
    }

    setTimeout(() => {
      if (!winner) {
        if (opponent !== "friend") {
          handleComputerPlay();
          winner = checkWinner(updatedSquares);
          if (winner) {
            handleWin(updatedSquares, winner);
          }
        }
      }
    }, 500);

    function handleComputerPlay() {
      console.log("computer plays...");
      if (isGameover) return;
      const figureIndex = calculateFigureIndex(
        opponent,
        redFigures,
        blueFigures,
        squares
      );
      const [computerFigure] = blueFigures.filter((f) => {
        if (f.id === figureIndex) {
          return f;
        }
      });
      console.log(computerFigure);
      const squareIndex = calculateSquareIndex(
        opponent,
        redFigures,
        blueFigures,
        squares
      );
      const updatedSquares = squares.map((square) => {
        if (square.id === squareIndex) {
          square.figuresOnSquare.push(computerFigure);
          return { ...square, playable: false };
        } else if (computerFigure?.on === square.id) {
          square.figuresOnSquare.pop();
          return { ...square, playable: false };
        } else {
          return { ...square, playable: false };
        }

        const winner = checkWinner(updatedSquares);
        if (winner) {
          handleWin(updatedSquares, winner);
        }
      });

      const updateBlueFigures = blueFigures.map((figure) => {
        if (figure.id === computerFigure.id) {
          return { ...figure, onBoard: true, on: squareIndex };
        } else {
          return figure;
        }
      });

      setSquares(updatedSquares);
      setBlueFigures(updateBlueFigures);
      setIsRedsTurn(true);
    }
  }

  return (
    <div className="gameContainer">
      <select
        onChange={(e) => {
          setOpponent(e.target.value);
          restartGame();
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
        ""
      )}

      <Figures
        selectFigure={handleSelectClick}
        figures={redFigures}
        isRedsTurn={isRedsTurn}
      ></Figures>
      <Board
        selectFigure={handleSelectClick}
        placeFigure={placeFigure}
        squares={squares}
        isRedsTurn={isRedsTurn}
      ></Board>
      <Figures
        selectFigure={handleSelectClick}
        figures={blueFigures}
        isRedsTurn={!isRedsTurn}
      ></Figures>
    </div>
  );
}
