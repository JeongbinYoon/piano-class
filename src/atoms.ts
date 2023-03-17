import { atom } from "recoil";
import {
  Devices,
  InitialDeviceId,
  RoomInfo,
  SelectedDeviceId,
} from "./@types/types";

// 닉네임
export const nicknameState = atom<string>({
  key: "nicknameState",
  default: "",
});

// 생성된 방들의 제목, 패스워드 유무
export const roomsState = atom<RoomInfo[]>({
  key: "roomsState",
  default: [{ name: "", password: false }],
});

// 비공개 방 토글 체크 여부
export const privateRoomCheckedState = atom<boolean>({
  key: "privateRoomCheckedState",
  default: false,
});

// 이젠 페지 url
export const prevUrlState = atom<string>({
  key: "prevUrlState",
  default: "",
});

// 사용자 스트림
export const myStreamState = atom<MediaStream>({
  key: "myStreamState",
  default: undefined,
});

// 사용자 장비
// 최초 적용된 장치 id => 해당하는 장치 selected
export const initialDevicesIdState = atom<InitialDeviceId>({
  key: "initialDevicesIdState",
  default: {
    initialCameraDeviceId: "",
    initialAudioDeviceId: "",
  },
});

// 선택한 카메라, 오디오 장치 Id
export const selectedDevicesIdState = atom<SelectedDeviceId>({
  key: "selectedDeviceIdState",
  default: {
    cameraDeviceId: "",
    audioDeviceId: "",
  },
});

// 사용자의 모든 카메라, 오디오 input 장치
export const devicesState = atom<Devices>({
  key: "devicesState",
  default: {
    cameras: [{}],
    audioInputs: [{}],
  },
});

// 음소거, 카메라 on/off
export const muteState = atom<boolean>({
  key: "muteState",
  default: true,
});
export const cameraOffState = atom<boolean>({
  key: "cameraOffState",
  default: false,
});
