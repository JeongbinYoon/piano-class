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

// 사용자가 만든 Room(Public)
const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publicRooms = [];
  rooms.forEach((value, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};

io.on("connection", (socket) => {
  io.sockets.emit("room_change", publicRooms());
  console.log(socket.id);
  socket.on("enter_room", function (roomName, nickName) {
    socket["nickname"] = nickName ? nickName : "익명";
    socket.join(roomName);
    socket.emit("message", `${roomName}방에 입장하셨습니다.`);
    socket
      .to(roomName)
      .emit("message", `${socket["nickname"]}님이 입장하셨습니다.`);
    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket
        .to(room)
        .emit("message", `${socket["nickname"]}님이 방을 떠났습니다.`)
    );
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
