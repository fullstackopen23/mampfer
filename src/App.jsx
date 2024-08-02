import Header from './components/Header'
import Game from './components/Game'
import Footer from './components/Footer'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
//import { TouchBackend } from "react-dnd-touch-backend";
// const options = {
//   enableMouseEvents: true,
// };

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Header> </Header>
      <Game></Game>
      <Footer></Footer>
    </DndProvider>
  )
}

export default App
