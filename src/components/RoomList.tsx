import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { roomsState } from "../atoms";
import { BsKeyFill } from "react-icons/bs";

function RoomList({ socket }: any) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useRecoilState(roomsState);

  // 방 목록 클릭
  const handleEnterRoom = (roomName: string) => {
    let nickName = "익명";
    const password = null;
    socket.emit("enter_room", { roomName, password }, nickName, () =>
      navigate(`/room/${roomName}`)
    );
  };
  useEffect(() => {
    socket.on("room_change", setRooms);
    socket.on("message", console.log);
    socket.on("bye", console.log);
    socket.on("roomJoinFailed", console.log);
  }, []);

  return (
    <ul className="w-full max-w-sm h-fit mt-2.5 p-5 bg-white border rounded-lg md:h-525 md:w-4/12 md:mt-0">
      {rooms.map((roomName: string) => (
        <li
          key={roomName}
          onClick={() => handleEnterRoom(roomName)}
          className="flex justify-between items-center px-4 py-6 bg-slate-50 shadow-md rounded-lg cursor-pointer mb-2.5 last:mb-0"
        >
          <span className="text-zinc-700">{roomName}</span>
          <BsKeyFill className="text-2xl text-amber-400" />
        </li>
      ))}
    </ul>
  );
}
export default RoomList;
