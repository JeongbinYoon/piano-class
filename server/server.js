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
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      let password = false;
      password = passwordProtectedRooms[key] !== null ? true : false;
      publicRooms.push({ name: key, password });
      console.log(passwordProtectedRooms[key]);
    }
  });
  return publicRooms;
};

// 방 접속시 비밀번호 체크
const checkPassword = (roomData) => {
  const { roomName, password } = roomData;
  if (!passwordProtectedRooms[roomName]) {
    passwordProtectedRooms[roomName] = password;
  }
  return passwordProtectedRooms[roomName] === password;
};

// 패스워드 적용 Room list {Room name , password}
const passwordProtectedRooms = {};

io.on("connection", (socket) => {
  io.sockets.emit("room_change", publicRooms());
  socket.onAny(() => {
    console.log(io.sockets.adapter.sids);
  });

  socket.on("enter_room", (roomData, nickName, roomJoinSuccess) => {
    const { roomName } = roomData;
    const correctPassword = checkPassword(roomData);

    // 패스워드 체크
    if (!correctPassword) {
      socket.emit("roomJoinFailed", "비밀번호가 틀립니다.");
      return;
    }

    socket.join(roomName);
    socket["nickname"] = nickName === "" ? "익명" : nickName;
    socket.emit("message", `${roomName} 방에 입장하셨습니다.`);
    socket
      .to(roomName)
      .emit("message", `${socket["nickname"]}님이 입장하셨습니다.`);
    io.sockets.emit("room_change", publicRooms());
    roomJoinSuccess();
  });

  socket.on("leave_room", (roomName) => {
    socket.leave(roomName);
    socket
      .to(roomName)
      .emit("message", `${socket["nickname"]}님이 방을 떠났습니다.`);
    socket.emit("message", `${roomName} 방을 떠났습니다.`);
  });

  socket.on("room_change", () => {
    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomName) =>
      socket
        .to(roomName)
        .emit("message", `${socket["nickname"]}님이 방을 떠났습니다.`)
    );
  });
  socket.on("message", (msg) => {
    socket.emit("message", msg);
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
