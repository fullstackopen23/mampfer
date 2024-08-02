export function isPlayable(square, figure) {
  const figureOnSquare =
    square.figuresOnSquare[square.figuresOnSquare.length - 1];

  if (figureOnSquare?.size === "large") {
    return false;
  } else if (figureOnSquare?.size === "medium" && figure.size === "medium") {
    return false;
  } else if (figureOnSquare?.size === "small" && figure.size === "small") {
    return false;
  } else if (figureOnSquare?.size === "medium" && figure.size === "small") {
    return false;
  } else {
    return true;
  }
}

export function checkWinner(squares) {
  const figuresOnSquares = squares.map((square) => {
    return {
      ...square,
      figureOnSquare: square.figuresOnSquare[square.figuresOnSquare.length - 1],
    };
  });

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      figuresOnSquares[a].figureOnSquare?.team &&
      figuresOnSquares[a].figureOnSquare?.team ===
        figuresOnSquares[b].figureOnSquare?.team &&
      figuresOnSquares[a].figureOnSquare?.team ===
        figuresOnSquares[c].figureOnSquare?.team
    ) {
      return {
        squares: [a, b, c],
        winnerTeam: figuresOnSquares[a].figureOnSquare?.team,
      };
    }
  }
  return null;
}

export function returnPlayingFigure(redFigures, blueFigures, selectedFigure) {
  const allFigures = [...redFigures, ...blueFigures];
  return allFigures.filter((f) => f.id === selectedFigure.id)[0];
}

export function calculateFigureIndex(
  difficulty,
  redFigures,
  blueFigures,
  squares
) {
  let playableFigures = blueFigures.filter((figure) => {
    if (figure.on) {
      if (
        squares[figure.on].figuresOnSquare[
          squares[figure.on].figuresOnSquare.length - 1
        ].id == figure.id
      ) {
        return figure;
      }
    } else {
      return figure;
    }
  });

  console.log(playableFigures);

  if (difficulty === "easy") {
    return playableFigures.map((f) => f.id)[
      getRandomInt(playableFigures.length - 1)
    ];
  } else if (difficulty === "hard") {
    console.log("ayay");
  }

  return playableFigures.map((f) => f.id)[
    getRandomInt(playableFigures.length - 1)
  ];
}

export function calculateSquareIndex(
  difficulty,
  redFigures,
  blueFigures,
  squares
) {
  if (difficulty === "easy") {
    const freeIndexes = squares.filter((square) => {
      if (square.figuresOnSquare.length === 0) {
        return square.id;
      }
    });
    return freeIndexes.map((fI) => fI.id)[getRandomInt(freeIndexes.length - 1)];
  } else if (difficulty === "medium") {
    return 1;
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
