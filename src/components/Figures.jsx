import Figure from './Figure'

export default function Figures({
  figures,
  selectFigure,
  redFigures,
  blueFigures,
  isRedsTurn,
}) {
  return (
    <div className="figures">
      {figures.map((figure) => {
        return !figure.onBoard ? (
          <Figure
            active={isRedsTurn}
            selectFigure={selectFigure}
            key={figure.id}
            figure={figure}
            redFigures={redFigures}
            blueFigures={blueFigures}
          ></Figure>
        ) : null
      })}
    </div>
  )
}
