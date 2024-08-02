import Figure from "./Figure";

export default function Figures({ figures, selectFigure, isRedsTurn }) {
  return (
    <div className="figures">
      {figures.map((figure) => {
        return !figure.onBoard ? (
          <Figure
            active={isRedsTurn}
            selectFigure={selectFigure}
            key={figure.id}
            figure={figure}
          ></Figure>
        ) : null;
      })}
    </div>
  );
}
