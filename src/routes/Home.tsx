import { useEffect } from "react";
import io from "socket.io-client";
import RoomList from "../components/RoomList";
import CreateRoom from "../components/CreateRoom";

const socket = io("http://localhost:8080");
function Home() {
  return (
    <div className="flex justify-center items-center flex-nowrap flex-col py-10 px-4 bg-brand md:flex-row md:flex-wrap h-screen">
      {/* 방 만들기 */}
      <CreateRoom socket={socket} />
      {/* 방 목록 */}
      <RoomList socket={socket} />
    </div>
  );
}

export default Home;
