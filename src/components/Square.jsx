import Figure from "./Figure";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../utils/constants";

export default function Square({
  isRedsTurn,
  selectFigure,
  placeFigure,
  square,
}) {
  let border;
  if (square.id <= 5) {
    border = "border-bottom";
  }
  if (square.id === 0 || square.id === 1) {
    border += " border-right";
  } else if (square.id === 3 || square.id === 4) {
    border += " border-right";
  } else if (square.id === 6 || square.id === 7) {
    border += " border-right";
  }

  const classes = `square ${square.playable ? "playable" : ""} ${
    square.winner ? "winner" : ""
  } ${border}`;
  const [{}, drop] = useDrop(
    () => ({
      accept: ItemTypes.FIGURE,
      drop: () => placeFigure(square),
    }),
    [square]
  );

  let active;
  if (
    isRedsTurn &&
    square.figuresOnSquare[square.figuresOnSquare.length - 1]?.team === "red"
  ) {
    active = true;
  } else if (
    !isRedsTurn &&
    square.figuresOnSquare[square.figuresOnSquare.length - 1]?.team === "blue"
  ) {
    active = true;
  } else {
    active = false;
  }
  return (
    <div
      ref={drop}
      className={classes}
      onClick={() => {
        placeFigure(square);
      }}
    >
      {square.figuresOnSquare.length !== 0 ? (
        <Figure
          active={active}
          selectFigure={selectFigure}
          figure={square.figuresOnSquare[square.figuresOnSquare.length - 1]}
        ></Figure>
      ) : (
        <></>
      )}
    </div>
  );
}
