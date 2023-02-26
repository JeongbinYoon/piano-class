import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SocketProps } from "../@types/types";
import { history } from "../history";

function Room({ socket }: SocketProps) {
  const { state } = useLocation();
  const roomName = state;

  const handleMessage = (msg: string) => {
    console.log(msg);
  };

  // 방에서 뒤로가기 감지하여 소켓 leave
  useEffect(() => {
    const listenBackEvent = () => {
      // 뒤로가기 할 때 수행할 동작
      socket.emit("leave_room", roomName);
    };

    const unlistenHistoryEvent = history.listen(({ action }) => {
      if (action === "POP") {
        listenBackEvent();
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

  return <div>ROOM</div>;
}
export default Room;
