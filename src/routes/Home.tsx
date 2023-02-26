import RoomList from "../components/RoomList";
import CreateRoom from "../components/CreateRoom";
import { SocketProps } from "../@types/types";

function Home({ socket }: SocketProps) {
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
