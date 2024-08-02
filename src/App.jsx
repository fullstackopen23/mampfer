import Game from "./components/Game";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
//import { TouchBackend } from "react-dnd-touch-backend";
import Header from "./components/Header";
// const options = {
//   enableMouseEvents: true,
// };

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Header> </Header>
      <Game></Game>
    </DndProvider>
  );
}

export default App;
