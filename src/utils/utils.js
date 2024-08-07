export function isPlayable(square, figure) {
  const figureOnSquare =
    square.figuresOnSquare[square.figuresOnSquare.length - 1]

  if (figureOnSquare?.size === 'large') {
    return false
  } else if (
    figureOnSquare?.size === 'medium' &&
    figure.size === 'medium'
  ) {
    return false
  } else if (
    figureOnSquare?.size === 'small' &&
    figure.size === 'small'
  ) {
    return false
  } else if (
    figureOnSquare?.size === 'medium' &&
    figure.size === 'small'
  ) {
    return false
  } else {
    return true
  }
}

export function checkWinner(squares) {
  const figuresOnSquares = squares.map((square) => {
    return {
      ...square,
      figureOnSquare:
        square.figuresOnSquare[square.figuresOnSquare.length - 1],
    }
  })

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
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
      }
    }
  }
  return null
}

export function canMove(squares, figure) {
  if (figure.on) {
    if (
      squares[figure.on].figuresOnSquare[
        squares[figure.on].figuresOnSquare.length - 1
      ]?.id == figure.id
    ) {
      return figure
    }
  } else {
    return figure
  }
}

export function calculateFigureIndex(
  difficulty,
  redFigures,
  blueFigures,
  squares
) {
  let playableFigures = blueFigures.filter((figure) => {
    return canMove(squares, figure)
  })

  const largePlayables = playableFigures.filter(
    (f) => f.size === 'large'
  )
  const mediumPlayables = playableFigures.filter(
    (f) => f.size === 'medium'
  )
  const smallPlayables = playableFigures.filter(
    (f) => f.size === 'small'
  )

  const largeNotPlayedYet = largePlayables.filter(
    (f) => f.on === null
  )

  console.log(largeNotPlayedYet)

  if (difficulty === 'easy') {
    return playableFigures.map((f) => f.id)[
      getRandomInt(playableFigures.length - 1)
    ]
  } else if (difficulty === 'hard') {
    if (largeNotPlayedYet.length !== 0) {
      return largeNotPlayedYet[0].id
    } else {
      return playableFigures.map((f) => f.id)[
        getRandomInt(playableFigures.length - 1)
      ]
    }
  }
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
export function calculateSquareIndex(
  difficulty,
  redFigures,
  blueFigures,
  squares,
  figure
) {
  const playableSquares = squares
    .filter((s) => {
      if (isPlayable(s, figure)) {
        return true
      } else {
        return false
      }
    })
    .map((ps) => ps.id)

  console.log(playableSquares)

  if (difficulty === 'easy') {
    return playableSquares[getRandomInt(playableSquares.length - 1)]
  } else if (difficulty === 'hard') {
    if (playableSquares.includes(0) && figure.size === 'large') {
      return 0
    } else if (
      playableSquares.includes(2) &&
      figure.size === 'large'
    ) {
      return 2
    } else {
      return playableSquares[getRandomInt(playableSquares.length - 1)]
    }
  }
}
