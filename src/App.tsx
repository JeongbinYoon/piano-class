import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./routes/Home";
import Room from "./routes/Room";
import io from "socket.io-client";

const socket = io("http://localhost:8080");
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home socket={socket} />} />
        <Route path="/room/:roomName" element={<Room socket={socket} />} />
        {/* 404 리다이렉트 처리 */}
        <Route path="/*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </Router>
  );
}
export default App;
