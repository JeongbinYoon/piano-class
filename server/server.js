import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

// localhost 포트 설정
const app = express();
const port = 8080;

app.get("/", (_, res) => {
  res.send("Hello!");
});

// server instance
const httpServer = createServer(app);
// Socketio 생성후 서버 인스턴스 사용
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket);
  console.log("User Connected");
  socket.on("disconnect", () => {
    console.log("User Disconnect");
  });
  socket.on("message", (roomName) => {
    socket.emit("message", "방 이름은 roomName 입니다");
  });
  socket.emit("welcome", "환엽합니다.");
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
