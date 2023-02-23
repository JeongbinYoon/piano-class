import { atom } from "recoil";

export const roomsState = atom<string[]>({
  key: "roomsState",
  default: [],
});

export const privateRoomCheckedState = atom<boolean>({
  key: "privateRoomCheckedState",
  default: false,
});
