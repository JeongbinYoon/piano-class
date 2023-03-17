import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { SocketProps } from "../@types/types";
import { prevUrlState, privateRoomCheckedState } from "../atoms";
import Camera from "../components/Camera";

function Room({ socket }: SocketProps) {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const setPrivateRoomChecked = useSetRecoilState(privateRoomCheckedState);

  const handleMessage = (msg: string) => {
    console.log(msg);
  };

  // 뒤로가기 할 때 수행할 동작
  const listenBackEvent = () => {
    socket.emit("leave_room", roomName);
    socket.emit("room_change");
    setPrivateRoomChecked(() => false);
  };

  // 뒤로가기 확인
  const askGoBack = (event: any) => {
    if (window.confirm("방을 나가시겠습니까?")) {
      listenBackEvent();
      navigate("/");
    }
  };

  useEffect(() => {
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const handleTryEnterRoomFromURL = (
    roomName: string | undefined,
    hasPassword: boolean
  ) => {
    let fromWhere = "url";
    let nickName = sessionStorage.getItem("nickname") ?? "";
    let password = null;

    socket.emit("enter_room", { roomName, password }, nickName, fromWhere, () =>
      navigate(`/room/${roomName}`)
    );
  };
  const handleEnterRoomFromURL = (
    roomName: string | undefined,
    hasPassword: boolean
  ) => {
    let fromWhere = "url_success";
    let nickName = sessionStorage.getItem("nickname") ?? "";
    let password = null;

    if (hasPassword) {
      password = window.prompt("패스워드를 입력하세요");
    }
    socket.emit("enter_room", { roomName, password }, nickName, fromWhere, () =>
      navigate(`/room/${roomName}`)
    );
  };

  // URL로 방에 접속하려하는 경우 접속 시도
  const prevUrl = useRecoilValue(prevUrlState);
  useEffect(() => {
    const prevPathname = prevUrl;
    if (
      location?.state?.fromList === undefined ||
      prevPathname === location.pathname ||
      prevPathname === ""
    ) {
      handleTryEnterRoomFromURL(roomName, false);
    }
  }, []);

  // URL로 접속하려는 방의 패스워드 유무 확인 후 접속 시도
  useEffect(() => {
    socket.on("room_list", (accessRoom) => {
      handleEnterRoomFromURL(roomName, accessRoom.password);
    });
  }, []);

  const handleAlert = (msg: string) => {
    alert(msg);
    navigate("/");
  };

  useEffect(() => {
    socket.on("roomJoinFailed", handleAlert);
    return () => {
      socket.off("roomJoinFailed", handleAlert);
    };
  }, []);

  return (
    <div>
      <div>{roomName}</div>

      {/* 카메라 */}
      <Camera />
      <button
        className="bg-button px-4 py-2.5 text-lg rounded-lg"
        onClick={askGoBack}
      >
        나가기
      </button>
    </div>
  );
}
export default Room;
