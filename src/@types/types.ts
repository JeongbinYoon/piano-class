import { Socket } from "socket.io-client";

export interface SocketProps {
  socket: Socket;
}

export interface RoomInfo {
  name: string;
  password: boolean;
}

export interface SelectedDeviceId {
  cameraDeviceId: string;
  audioDeviceId: string;
}

export interface Devices {
  cameras: [
    {
      deviceId?: string;
      groupId?: string;
      kind?: string;
      label?: string;
    }
  ];
  audioInputs: [
    {
      deviceId?: string;
      groupId?: string;
      kind?: string;
      label?: string;
    }
  ];
}

export interface InitialDeviceId {
  initialCameraDeviceId?: string;
  initialAudioDeviceId?: string;
}
