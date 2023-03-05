import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { muteState, cameraOffState } from "../atoms";

function Camera() {
  // const [myStream, setMyStream] = useRecoilState(myStreamState);
  const [mute, setMute] = useRecoilState(muteState);
  const [cameraOff, setCameraOff] = useRecoilState(cameraOffState);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getMedia = async () => {
    let myStream;
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = myStream;
      }

      console.log(myStream);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  const handleMuteClick = () => {
    setMute((prev) => !prev);
  };
  const handleCameraOnOffClick = () => {
    setCameraOff((prev) => !prev);
  };
  return (
    <>
      <div>카메라</div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={400}
        height={400}
      ></video>
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
