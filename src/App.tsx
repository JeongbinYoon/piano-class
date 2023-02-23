import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Room from "./routes/Room";
// import Room from "./components/Room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomName" element={<Room />} />
      </Routes>
    </Router>
  );
}
export default App;
