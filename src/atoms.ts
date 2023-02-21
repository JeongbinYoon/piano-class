import { atom } from "recoil";

export const roomsState = atom<string[]>({
  key: "roomsState",
  default: [],
});
