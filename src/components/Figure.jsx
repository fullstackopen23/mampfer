import { useEffect } from "react";
import { ItemTypes } from "../utils/constants";
import { useDrag } from "react-dnd";

export default function Figure({ active, figure, selectFigure }) {
  const [{ isDragging, canDrag }, drag] = useDrag(() => ({
    type: ItemTypes.FIGURE,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    if (isDragging) {
      selectFigure(figure);
    }
  }, [isDragging]);

  const classes = `figure ${figure.team} ${figure.size} ${
    isDragging ? "isDragging" : ""
  } ${active ? "" : "inactive"}`;
  return (
    <div
      ref={drag}
      onClick={() => {
        selectFigure(figure);
      }}
      className={classes}
    >
      O
    </div>
  );
}
