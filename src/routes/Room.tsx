import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { SocketProps } from "../@types/types";
import { privateRoomCheckedState } from "../atoms";
import { history } from "../history";

function Room({ socket }: SocketProps) {
  const { state } = useLocation();
  const roomName = state;
  const setPrivateRoomChecked = useSetRecoilState(privateRoomCheckedState);

  const handleMessage = (msg: string) => {
    console.log(msg);
  };

  // 방에서 뒤로가기 감지하여 소켓 leave
  useEffect(() => {
    const listenBackEvent = () => {
      // 뒤로가기 할 때 수행할 동작
      socket.emit("leave_room", roomName);
      socket.emit("room_change");
      setPrivateRoomChecked(() => false);
    };

    const unlistenHistoryEvent = history.listen(({ action }) => {
      if (action === "POP") {
        if (window.confirm("방을 나가시겠습니까?")) {
          listenBackEvent();
        } else history.go(1);
      }
    });

    return unlistenHistoryEvent;
  }, [roomName, socket]);

  useEffect(() => {
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  return (
    <div>
      <div>{roomName}</div>
    </div>
  );
}
export default Room;
