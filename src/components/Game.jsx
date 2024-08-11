import Figures from "./Figures";
import Board from "./Board";
import { useState } from "react";
import { isPlayable, checkWinner, canMove, getRandomInt } from "../utils/utils";
import {
  COMPUTER_THINK_TIME,
  initalBlueFigures,
  initalSquares,
  initalRedFigures,
} from "../utils/constants";

export default function Game() {
  const [opponent, setOpponent] = useState("hard");
  const [winner, setWinner] = useState(null);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [isGameover, setIsGameover] = useState(false);
  const [isRedsTurn, setIsRedsTurn] = useState(true);
  const [redFigures, setRedFigures] = useState(initalRedFigures);
  const [blueFigures, setBlueFigures] = useState(initalBlueFigures);
  const [squares, setSquares] = useState(initalSquares);

  function handleSelectClick(figure) {
    if (isGameover) return;
    if (
      (isRedsTurn && figure.team === "red") ||
      (!isRedsTurn && figure.team === "blue")
    ) {
      setSelectedFigure(figure);

      // highlight playable squares
      const highlightedSquares = squares.map((square) => {
        if (isPlayable(square, figure)) {
          return { ...square, playable: true };
        } else {
          return square;
        }
      });
      setSquares(highlightedSquares);
    }
  }

  function restartGame() {
    setBlueFigures(initalBlueFigures);
    setRedFigures(initalRedFigures);
    setSquares(
      squares.map((s) => ({
        ...s,
        playable: false,
        figuresOnSquare: [],
        winner: false,
      }))
    );
    setIsRedsTurn(true);
    setIsGameover(false);
    setSelectedFigure(null);
    setWinner(null);
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

    const updatedSquares = squares.map((square) => {
      if (clickedSquare.id === square.id) {
        return {
          ...square,
          figuresOnSquare: [...square.figuresOnSquare, selectedFigure],
          playable: false,
        };
      } else if (selectedFigure?.on === square.id) {
        return {
          ...square,
          figuresOnSquare: square.figuresOnSquare.slice(0, -1),
          playable: false,
        };
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

    if (checkWinner(updatedSquares)) {
      handleWin(updatedSquares, checkWinner(updatedSquares));
      setWinner(checkWinner(updatedSquares));
    } else if (opponent !== "friend" && !isRedsTurn) {
      setTimeout(() => {
        handleComputerPlay(updatedFigures, updatedSquares);
        if (checkWinner(updatedSquares)) {
          handleWin(updatedSquares, checkWinner(updatedSquares));
          setWinner(checkWinner(updatedSquares));
        }
      }, COMPUTER_THINK_TIME);
    }
  }

  function handleComputerPlay(updatedFigures, updatedSquares) {
    if (isGameover) return;
    const bestMove = findBestMove(updatedFigures, updatedSquares);

    const selectedFigure = blueFigures.find((bf) => bf.id === bestMove.figure);
    const updatedSquaresAfterAIplayed = updatedSquares.map((square) => {
      if (bestMove.target === square.id) {
        return {
          ...square,
          figuresOnSquare: [...square.figuresOnSquare, selectedFigure],
          playable: false,
        };
      } else if (selectedFigure?.on === square.id) {
        return {
          ...square,
          figuresOnSquare: square.figuresOnSquare.slice(0, -1),
          playable: false,
        };
      } else {
        return square;
      }
    });

    const updatedFiguresAfterAIPlayed = blueFigures.map((figure) => {
      if (figure.id === selectedFigure.id) {
        return { ...figure, onBoard: true, on: bestMove.target };
      } else {
        return figure;
      }
    });

    setSquares(updatedSquaresAfterAIplayed);
    setBlueFigures(updatedFiguresAfterAIPlayed);
    setIsRedsTurn(true);
  }

  function findBestMove(updatedRedFigures, updatedSquares) {
    let bestScore = -Infinity;
    let bestMove = null;

    const playableMoves = blueFigures.flatMap((bf) =>
      updatedSquares
        .filter((square) => isPlayable(square, bf))
        .map((square) => ({ figure: bf.id, target: square.id }))
    );

    for (const move of playableMoves) {
      const score = minimax(
        move,
        0,
        true,
        updatedSquares,
        blueFigures,
        updatedRedFigures,
        -Infinity,
        Infinity
      );
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  const scores = {
    red: -10,
    blue: +10,
  };

  function evaluateBoard(squares) {
    const redFiguresOnBoard = squares.filter(
      (square) => square.figuresOnSquare.at(-1)?.team === "red"
    ).length;
    const blueFiguresOnBoard = squares.filter(
      (square) => square.figuresOnSquare.at(-1)?.team === "blue"
    ).length;

    return blueFiguresOnBoard - redFiguresOnBoard;
  }

  function minimax(
    move,
    depth,
    isMaximizing,
    squares,
    blueFigures,
    redFigures,
    alpha,
    beta
  ) {
    const maxDepth = 1;
    if (depth > maxDepth) return evaluateBoard(squares);

    const updatedSquares = squares.map((square) => {
      if (move.target === square.id) {
        return {
          ...square,
          figuresOnSquare: [
            ...square.figuresOnSquare,
            blueFigures.find((bf) => bf.id === move.figure),
          ],
        };
      } else if (
        redFigures.some((rf) => rf.on === square.id) ||
        blueFigures.some((bf) => bf.on === square.id)
      ) {
        return {
          ...square,
          figuresOnSquare: square.figuresOnSquare.slice(0, -1),
        };
      } else {
        return square;
      }
    });

    const winner = checkWinner(updatedSquares);
    if (winner) return scores[winner.winnerTeam];

    if (isMaximizing) {
      let maxEval = -Infinity;
      const playableMoves = redFigures.flatMap((rf) =>
        updatedSquares
          .filter((square) => isPlayable(square, rf))
          .map((square) => ({ figure: rf.id, target: square.id }))
      );

      for (const move of playableMoves) {
        const evalScore = minimax(
          move,
          depth + 1,
          false,
          updatedSquares,
          blueFigures,
          redFigures,
          alpha,
          beta
        );
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) break;
      }

      return maxEval;
    } else {
      let minEval = Infinity;
      const playableMoves = blueFigures.flatMap((bf) =>
        updatedSquares
          .filter((square) => isPlayable(square, bf))
          .map((square) => ({ figure: bf.id, target: square.id }))
      );

      for (const move of playableMoves) {
        const evalScore = minimax(
          move,
          depth + 1,
          true,
          updatedSquares,
          blueFigures,
          redFigures,
          alpha,
          beta
        );
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) break;
      }

      return minEval;
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
  );
}
