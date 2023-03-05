import { atom } from "recoil";

interface IRoomInfo {
  name: string;
  password: boolean;
}

export const roomsState = atom<IRoomInfo[]>({
  key: "roomsState",
  default: [{ name: "", password: false }],
});

export const privateRoomCheckedState = atom<boolean>({
  key: "privateRoomCheckedState",
  default: false,
});

export const myStreamState = atom<any>({
  key: "myStreamState",
  default: null,
});

// 음소거, 카메라 on/off
export const muteState = atom<boolean>({
  key: "muteState",
  default: false,
});
export const cameraOffState = atom<boolean>({
  key: "cameraOffState",
  default: false,
});
