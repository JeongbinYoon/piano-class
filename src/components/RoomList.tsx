import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { nicknameState, roomsState, usersNicknamesState } from "../atoms";
import { BsKeyFill } from "react-icons/bs";
import { SocketProps } from "../@types/types";

function RoomList({ socket }: SocketProps) {
  const navigate = useNavigate();
  const [rooms, setRooms] = useRecoilState(roomsState);
  const [nickname, setNickname] = useRecoilState(nicknameState);
  const [usersNicknames, setUsersNicknames] =
    useRecoilState(usersNicknamesState);

  // 방 목록 클릭
  const handleEnterRoom = (roomName: string, hasPassword: boolean) => {
    const nick = sessionStorage.getItem("nickname") ?? "";
    let password = null;
    const fromWhere = "list";
    if (hasPassword) {
      password = window.prompt("패스워드를 입력하세요");
      if (!password) {
        return;
      }
    }
    socket.emit("enter_room", { roomName, password }, nick, fromWhere, () =>
      navigate(`/room/${roomName}`, {
        state: { fromList: true },
      })
    );
  };

  const handleMessage = (msg: string) => {
    console.log(msg);
  };

  const handleAlert = (msg: string) => {
    alert(msg);
  };

  const updateUsers = (users: any) => {
    setUsersNicknames(users);
  };

  useEffect(() => {
    socket.emit("room_change");
    socket.on("room_change", setRooms);
    socket.on("roomJoinFailed", handleAlert);
    socket.on("message", handleMessage);
    socket.on("update_users", updateUsers);
    return () => {
      socket.off("message", handleMessage);
      socket.off("roomJoinFailed", handleAlert);
      socket.off("update_users", handleAlert);
    };
  }, []);

  // 닉네임
  const nicknameRef = useRef<HTMLInputElement>(null);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicknameRef.current) {
      setNickname(nicknameRef.current.value);
      sessionStorage.setItem("nickname", nicknameRef.current.value);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm mt-2.5 md:w-4/12 md:mt-0 md:h-536">
      <form
        className="flex justify-between p-5 bg-white shadow-md rounded-lg mb-2.5 last:mb-0"
        onSubmit={handleSaveNickname}
      >
        <input
          ref={nicknameRef}
          className="w-full p-2.5 bg-slate-50 border rounded-lg"
          type="text"
          placeholder="닉네임"
          defaultValue={sessionStorage.getItem("nickname") ?? undefined}
        />
        <button
          type="submit"
          className="min-w-fit ml-3 px-5 py-2.5 bg-brand text-white rounded-lg cursor-pointer"
        >
          {nickname ? "변경" : "저장"}
        </button>
      </form>
      <div className="p-5 bg-white border rounded-lg md:h-full">
        <h1 className="text-xl text-center font-bold text-zinc-700">
          입장하기
        </h1>
        <ul className="mt-2.5">
          {rooms.map(({ name, password }) => (
            <li
              key={name}
              onClick={() => handleEnterRoom(name, password)}
              className="flex justify-between items-center px-4 py-3 bg-slate-50 border rounded-lg cursor-pointer mb-2.5 last:mb-0"
            >
              <span className="text-zinc-700">{name}</span>
              {password && <BsKeyFill className="text-2xl text-amber-400" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default RoomList;
