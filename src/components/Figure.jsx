import { useEffect } from 'react'
import { ItemTypes } from '../utils/constants'
import { useDrag } from 'react-dnd'

export default function Figure({
  active,
  figure,
  selectFigure,
  redFigures,
  blueFigures,
}) {
  const [{ isDragging, canDrag }, drag] = useDrag(() => ({
    type: ItemTypes.FIGURE,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  function getFigure() {
    const allFigures = [...redFigures, ...blueFigures]
    const [tempFigure] = allFigures.filter((f) => f.id === figure.id)
    return tempFigure
  }

  useEffect(() => {
    if (isDragging) {
      selectFigure(getFigure())
    }
  }, [isDragging])

  const classes = `figure ${figure.team} ${figure.size} ${
    isDragging ? 'isDragging' : ''
  } ${active ? '' : 'inactive'}`
  return (
    <div
      ref={drag}
      onClick={() => {
        selectFigure(getFigure())
      }}
      className={classes}
    >
      O
    </div>
  )
}
