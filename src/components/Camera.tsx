import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SocketProps } from "../@types/types";
import {
  muteState,
  cameraOffState,
  myStreamState,
  devicesState,
  initialDevicesIdState,
  selectedDevicesIdState,
  peerConnectionState,
} from "../atoms";

function Camera({ socket }: SocketProps) {
  const { roomName } = useParams();
  const [myStream, setMyStream] = useRecoilState(myStreamState);
  const [mute, setMute] = useRecoilState(muteState);
  const [cameraOff, setCameraOff] = useRecoilState(cameraOffState);
  const [devices, setDevices] = useRecoilState(devicesState);
  const [selectedDevicesId, setSelectedDevicesId] = useRecoilState(
    selectedDevicesIdState
  );
  const [initialDevicesId, setInitialDevicesId] = useRecoilState(
    initialDevicesIdState
  );
  const [peerConnection, setPeerConnection] =
    useRecoilState(peerConnectionState);

  const videoRef = useRef<HTMLVideoElement>(null);

  // 장치의 모든 카메라
  const getCameras = async () => {
    try {
      const userDevices = await navigator.mediaDevices.enumerateDevices();
      const cameras = userDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices((prevDevices: any) => {
        const newDevices = { ...prevDevices };
        newDevices["cameras"] = cameras;
        return newDevices;
      });
    } catch (event) {
      console.log(event);
    }
  };

  // 장치의 모든 오디오 인풋(마이크)
  const getAudios = async () => {
    try {
      const userDevices = await navigator.mediaDevices.enumerateDevices();
      const audioinputs = userDevices.filter(
        (device) => device.kind === "audioinput"
      );
      setDevices((prevDevices: any) => {
        const newDevices = { ...prevDevices };
        newDevices["audioInputs"] = audioinputs;
        return newDevices;
      });
    } catch (event) {
      console.log(event);
    }
  };

  // 최초 렌더링시 실행
  // 사용자 카메라, 오디오 스트리밍
  const getMedia = useCallback(async () => {
    try {
      const cameraDeviceId = selectedDevicesId["cameraDeviceId"];
      const audioDeviceId = selectedDevicesId["audioDeviceId"];
      const constraints = {
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
        video: cameraDeviceId
          ? { deviceId: { exact: cameraDeviceId } }
          : { facingMode: "user" },
      };

      const myStream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = myStream;
      }

      setMyStream(myStream);

      // 최초 적용된 장치 id에 따라 select 박스 자동 선택
      setInitialDevicesId(() => {
        const newInitialDevicesId = { ...initialDevicesId };
        newInitialDevicesId["initialCameraDeviceId"] = myStream
          .getVideoTracks()[0]
          .getSettings().deviceId;
        newInitialDevicesId["initialAudioDeviceId"] = myStream
          .getAudioTracks()[0]
          .getSettings().deviceId;
        return newInitialDevicesId;
      });

      if (!cameraDeviceId) {
        await getCameras();
      }
      if (!audioDeviceId) {
        await getAudios();
      }
    } catch (event) {
      console.log(event);
    }
  }, [selectedDevicesId]);

  // 음소거, 카메라 On/Off
  const handleMuteClick = () => {
    setMute((prev) => !prev);
    if (myStream) {
      myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    }
  };
  const handleCameraOnOffClick = () => {
    setCameraOff((prev) => !prev);
    if (myStream) {
      myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    }
  };

  // 장치 선택
  const handleCameraSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevicesId((prevDevices) => {
      const newDevices = { ...prevDevices };
      newDevices["cameraDeviceId"] = event.target.value;
      return newDevices;
    });
  };
  const handleAudioSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevicesId((prevDevices) => {
      const newDevices = { ...prevDevices };
      newDevices["audioDeviceId"] = event.target.value;
      return newDevices;
    });
  };

  // Socket Code
  // useEffect(() => {
  //   const createOffer = () => {
  //     socket.on("createOffer", async () => {
  //       console.log(peerConnection);
  //       const offer = await peerConnection.createOffer();
  //       console.log(offer);
  //     });
  //   };
  //   createOffer();
  // }, [peerConnection]);
  useEffect(() => {
    if (peerConnection) {
      socket.on("createOffer", async () => {
        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);
        socket.emit("sendOffer", offer, roomName);
      });
    }
  }, [peerConnection]);

  // RTC Code
  const makeConnection = () => {
    if (myStream) {
      const myPeerConnection = new RTCPeerConnection();
      myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
      setPeerConnection(myPeerConnection);
    } else {
      setTimeout(() => {
        makeConnection();
      }, 1000); // 1초 뒤에 다시 시도
    }
  };

  const recieveOffer = (offer: any) => {
    console.log(offer);
  };

  useEffect(() => {
    socket.on("recieveOffer", recieveOffer);
    return () => {
      socket.off("recieveOffer", recieveOffer);
    };
  }, []);

  useEffect(() => {
    getMedia();
  }, [selectedDevicesId]);

  useEffect(() => {
    makeConnection();
  }, [myStream]);
  return (
    <>
      <div>카메라</div>
      <div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width={400}
          height={400}
        ></video>
        <select
          id="cameras"
          onChange={handleCameraSelect}
          value={initialDevicesId.initialCameraDeviceId}
        >
          {devices.cameras.map(
            (camera) =>
              camera.deviceId && (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label}
                </option>
              )
          )}
        </select>
        <select
          id="audios"
          onChange={handleAudioSelect}
          value={initialDevicesId.initialAudioDeviceId}
        >
          {devices.audioInputs.map(
            (audioInput) =>
              audioInput.deviceId && (
                <option key={audioInput.deviceId} value={audioInput.deviceId}>
                  {audioInput.label}
                </option>
              )
          )}
        </select>
      </div>
      <div>
        <button onClick={handleMuteClick}>
          {mute ? "음소거 끄기" : "음소거"}
        </button>
        <button onClick={handleCameraOnOffClick}>
          {cameraOff ? "카메라 켜기" : "카메라 끄기"}
        </button>
      </div>
    </>
  );
}

export default Camera;
