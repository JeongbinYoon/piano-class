import RoomList from "../components/RoomList";
import CreateRoom from "../components/CreateRoom";
import { SocketProps } from "../@types/types";
import Camera from "../components/Camera";
// import Piano from "../components/piano";

function Home({ socket }: SocketProps) {
  return (
    <>
      {/* 피아노 */}
      {/* <Piano /> */}
      <div className="flex justify-center items-center flex-nowrap flex-col py-10 px-4 bg-brand md:flex-row md:flex-wrap md:h-screen">
        {/* 방 만들기 */}
        <CreateRoom socket={socket} />
        {/* 방 목록 */}
        <RoomList socket={socket} />
      </div>
    </>
  );
}

export default Home;
