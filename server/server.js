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

// Room list
// {Room name , password(없는 경우 null)}
const passwordProtectedRooms = {};

io.on("connection", (socket) => {
  io.sockets.emit("room_change", publicRooms());
  socket.onAny(() => {
    // console.log(passwordProtectedRooms);
  });

  // 방에서 입장할 때의 이벤트 처리
  socket.on("enter_room", (roomData, nickName, fromWhere, roomJoinSuccess) => {
    const { roomName } = roomData;

    // url로 직접 접속시 처리
    if (fromWhere === "url") {
      // 존재하지 않는 방에 접속하려 할 경우
      if (!io.sockets.adapter.rooms.get(roomName)) {
        socket.emit("roomJoinFailed", "존재하지 않는 방입니다.");
        return;
      }
      const rooms = publicRooms();
      const accessRoom = rooms.filter((room) => room.name === roomName)[0];
      socket.emit("room_list", accessRoom);
      return;
    }

    const correctPassword = checkPassword(roomData);
    // 패스워드 체크
    if (!correctPassword) {
      socket.emit("roomJoinFailed", "비밀번호가 틀립니다.");
      return;
    }

    socket.join(roomName);
    socket["nickname"] = nickName === "" ? "익명" : nickName;
    socket.emit("message", `${roomName} 방에 입장하셨습니다.`);
    socket.to(roomName).emit("createOffer");
    socket
      .to(roomName)
      .emit("message", `${socket["nickname"]}님이 입장하셨습니다.`);
    io.sockets.emit("room_change", publicRooms());

    // 특정 방 인원의 닉네임 추가 후 업데이트
    const socketsInRoom = io.sockets.adapter.rooms.get(roomName);
    if (socketsInRoom) {
      const users = [];
      for (const socketId of socketsInRoom) {
        const socket = io.sockets.sockets.get(socketId);
        users.push(socket.nickname);
      }
      io.sockets.to(roomName).emit("update_users", users);
    }

    roomJoinSuccess();
  });

  // 방에서 나갈 때의 이벤트 처리
  socket.on("leave_room", (roomName) => {
    socket.leave(roomName);
    const room = io.sockets.adapter.rooms.get(roomName);
    const numClients = room ? room.size : 0;
    if (numClients === 0) {
      delete passwordProtectedRooms[roomName];
    }
    socket
      .to(roomName)
      .emit("message", `${socket["nickname"]}님이 방을 떠났습니다.`);
    socket.emit("message", `${roomName} 방을 떠났습니다.`);

    // 특정 방 인원의 닉네임 삭제 후 업데이트
    const socketsInRoom = io.sockets.adapter.rooms.get(roomName);
    if (socketsInRoom) {
      const users = [];
      for (const socketId of socketsInRoom) {
        const socket = io.sockets.sockets.get(socketId);
        users.push(socket.nickname);
      }
      const newUsers = users.filter((user) => user.id !== socket.id);

      io.sockets.to(roomName).emit("update_users", newUsers);
    }
  });

  // 방 정보 업데이트
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

  // RTC
  socket.on("sendOffer", (offer, roomName) => {
    socket.to(roomName).emit("recieveOffer", offer);
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
