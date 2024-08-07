import Square from './Square'

export default function Board({
  isRedsTurn,
  selectFigure,
  squares,
  placeFigure,
  redFigures,
  blueFigures,
}) {
  return (
    <div className="board">
      {squares.map((square) => {
        return (
          <Square
            isRedsTurn={isRedsTurn}
            selectFigure={selectFigure}
            placeFigure={placeFigure}
            square={square}
            key={square.id}
            blueFigures={blueFigures}
            redFigures={redFigures}
          ></Square>
        )
      })}
    </div>
  )
}
