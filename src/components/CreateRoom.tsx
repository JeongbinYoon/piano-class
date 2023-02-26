import { useRef } from "react";
import { GiGrandPiano } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SocketProps } from "../@types/types";
import { privateRoomCheckedState } from "../atoms";

function CreateRoom({ socket }: SocketProps) {
  const navigate = useNavigate();
  const roomNameInputRef = useRef<HTMLInputElement>(null);
  const nickNameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [privateRoomChecked, setPrivateRoomChecked] = useRecoilState<boolean>(
    privateRoomCheckedState
  );

  // 비공개 토글 클릭
  const handlePrivateToggle = (event: React.MouseEvent<HTMLDivElement>) => {
    const toggle = event.currentTarget.firstElementChild as HTMLDivElement;
    const pwInput = event.currentTarget.parentElement
      ?.nextElementSibling as HTMLInputElement;
    const submitBtn = event.currentTarget.parentElement?.parentElement
      ?.nextElementSibling as HTMLButtonElement;
    let toggleDistance = 18;
    let inputDistance = 30;
    if (toggle.classList.contains("checked")) {
      toggleDistance = 0;
      inputDistance = 0;
      toggle.classList.remove("checked");
      pwInput.classList.remove("opacity-100", "visibility");
      pwInput.classList.add("opacity-0", "invisible");
      submitBtn.classList.remove("mt-20");
      submitBtn.classList.add("mt-5");
    } else {
      toggle.classList.add("checked");
      pwInput.classList.remove("opacity-0", "invisible");
      pwInput.classList.add("opacity-100", "visibility");
      submitBtn.classList.remove("mt-5");
      submitBtn.classList.add("mt-20");
    }
    toggle.style.transform = `translate(${toggleDistance}px, -50%)`;
    pwInput.style.transform = `translateY(${inputDistance}px)`;
    setPrivateRoomChecked(!privateRoomChecked);
  };

  // 입장 버튼 클릭
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const roomName = roomNameInputRef.current!.value;
    const nickName = nickNameInputRef.current!.value;
    let password = null;
    if (privateRoomChecked) {
      password = passwordInputRef.current!.value;
    }

    socket.emit("enter_room", { roomName, password }, nickName, () =>
      navigate(`/room/${roomName}`, { state: roomName })
    );
  };

  return (
    <div className="flex flex-col items-center w-full md:max-w-sm md:mr-5">
      {privateRoomChecked ? (
        <GiGrandPiano className="text-9xl text-blue-100 mb-2.5 md:text-7xl" />
      ) : (
        <GiGrandPiano className="text-9xl text-blue-100 mb-2.5" />
      )}
      <form
        className="w-full max-w-sm p-5 bg-white rounded-lg transition duration-200"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl text-center font-bold text-zinc-700">
          방 만들기
        </h1>
        <div className="flex flex-col mt-5">
          <label htmlFor="roomName" className="text-zinc-700">
            방 이름
          </label>
          <input
            ref={roomNameInputRef}
            type="text"
            placeholder="같이 해요~"
            className="mt-2.5 p-2.5 bg-slate-50 border rounded-lg "
            id="roomName"
          />
        </div>
        <div className="flex flex-col mt-5">
          <label htmlFor="nickname" className="text-zinc-700">
            닉네임
          </label>
          <input
            ref={nickNameInputRef}
            type="text"
            placeholder="이것만 치고 잔다"
            className="mt-2.5 p-2.5 bg-slate-50 border rounded-lg "
            id="nickname"
          />
        </div>
        <div className="flex flex-col mt-5 relative">
          <div className="flex justify-between">
            <label htmlFor="password" className="text-zinc-700">
              비공개
            </label>
            <div
              className="w-12 h-7 p-1 border border-gray-300 rounded-full cursor-pointer relative transition duration-200"
              onClick={handlePrivateToggle}
            >
              <div className="w-5 h-5 bg-brand absolute top-1/2 left-1 -translate-y-1/2 inset-y-1/2 rounded-full transition duration-200 ease-out"></div>
            </div>
          </div>
          <input
            ref={passwordInputRef}
            type="password"
            placeholder="비밀번호"
            className="w-full mt-2.5 p-2.5 bg-slate-50 border rounded-lg invisible absolute top-0 transition duration-300 ease-out"
            id="password"
          />
        </div>
        <button className="w-full h-12 mt-5 bg-brand text-white rounded-lg">
          입장
        </button>
      </form>
    </div>
  );
}

export default CreateRoom;
