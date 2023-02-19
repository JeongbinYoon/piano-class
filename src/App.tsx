import React from "react";
import "./App.css";
import { BsKeyFill } from "react-icons/bs";

function App() {
  const handleCheckBox = (e: any) => {
    const target = e.currentTarget.firstElementChild;
    let amount = 18;
    if (target.classList.contains("checked")) {
      target.classList.remove("checked");
      amount = 0;
    } else {
      target.classList.add("checked");
    }
    target.style.transform = `translate(${amount}px, -50%)`;
  };
  return (
    <div className="flex justify-center items-center h-screen py-20 bg-sky-600">
      <div>
        <img src="./logo192.png" alt="" className="w-4/12 mx-auto" />
        <form className="w-96 max-w-md mt-12 mr-5 p-5 bg-white rounded-lg">
          <h1 className="text-xl text-center font-bold text-zinc-700">
            방 만들기
          </h1>
          <div className="flex flex-col mt-5">
            <label htmlFor="title" className="text-zinc-700">
              방 제목
            </label>
            <input
              type="text"
              placeholder="같이 해요~"
              className="mt-2.5 p-2.5 bg-slate-50 border rounded-lg "
              id="title"
            />
          </div>
          <div className="flex flex-col mt-5">
            <label htmlFor="nickname" className="text-zinc-700">
              닉네임
            </label>
            <input
              type="text"
              placeholder="이것만 치고 잔다"
              className="mt-2.5 p-2.5 bg-slate-50 border rounded-lg "
              id="title"
            />
          </div>
          <div className="flex justify-between mt-5">
            <span className="text-zinc-700">비공개</span>
            <div
              className="w-12 h-7 p-1 border border-gray-300 rounded-full cursor-pointer relative transition duration-200"
              onClick={handleCheckBox}
            >
              <div className="w-5 h-5 bg-sky-600 absolute top-1/2 left-1 -translate-y-1/2 inset-y-1/2 rounded-full transition duration-200 ease-out"></div>
            </div>
          </div>
          <button className="w-full h-12 mt-5 bg-sky-600 text-white rounded-lg">
            입장
          </button>
        </form>
      </div>
      <ul className="w-4/12 h-full p-5 bg-white border rounded-lg">
        <li className="flex justify-between items-center px-4 py-6 bg-slate-50 shadow-md rounded-lg cursor-pointer">
          <span className="text-zinc-700">같이 해요~</span>
          <BsKeyFill className="text-2xl text-amber-400" />
        </li>
      </ul>
    </div>
  );
}

export default App;
