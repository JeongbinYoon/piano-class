import { useEffect } from "react";
function RoomList(socket: any) {
  console.log(socket);

  useEffect(() => {
    socket.emit("message", "테스트");
  });
  return <div>ㅁ</div>;
}
export default RoomList;
