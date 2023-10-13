import React, { useEffect, useRef, useState, useReducer, DispatchWithoutAction } from "react";
import io, { Socket } from "socket.io-client";
import { determinDevice, APP_URL, ROOM_ID } from "@/utils/webRtc";

type InitiateState = typeof initiateState;

let signalingSocket: Socket;
let localMediaStream: null | {} = null;

const initiateState = {
  peerId: "",
  roomId: "",
  roomLink: "",
  copyText: "",
  userAgent: "",
  isMobileDevice: false,
  isTablet: false,
  isIpad: false,
  isDesktop: false,
  videoDevices: [],
  audioDevices: [],
  audioEnabled: true,
  videoEnabled: true,
  screenShareEnabled: false,
  showChat: false,
  showSettings: false,
  hideToolbar: true,
  selectedAudioDeviceId: "",
  selectedVideoDeviceId: "",
  name: window.localStorage.name,
  nameError: false,
  typing: "",
  chats: [],
  callInitiated: false,
  callEnded: false,
};

const Room = () => {
  const App = useRef<any>({}).current;
  const [name, setName] = useState("AAAA");
  const [state, setState] = useReducer((state: any, paylod: any) => ({ ...state, ...paylod }), initiateState) as [
    InitiateState,
    DispatchWithoutAction
  ];

  function initiateCall() {
    determinDevice(App);

    App.roomId = ROOM_ID;

    App.roomLink = `${APP_URL}/${ROOM_ID}`;
    signalingSocket = io(APP_URL);
    //   signalingSocket = io(); 连接到当前服务器

    signalingSocket.on("connect", () => {
      App.peerId = signalingSocket.id;

      console.log("peerId", App.peerId);

      const userData = {
        peerName: name,
        videoEnabled: state.videoEnabled,
        audioEnabled: state.audioEnabled,
        userAgent: state.userAgent,
        isMobileDevice: state.isMobileDevice,
        isTablet: App.isTablet,
        isIpad: App.isIpad,
        isDesktop: App.isDesktop,
      };

      if (localMediaStream) {
        joinChatChannel(ROOM_ID, userData);
      } else {
        setupLocalMedia(function () {
          joinChatChannel(ROOM_ID, userData);
        });
      }
    });
  }

  const joinChatChannel = (channel: any, userData: any) => {};

  const setupLocalMedia = (callback: () => void) => {
    if (localMediaStream !== null) {
      if (callback) callback();
      return;
    }
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {})
      .catch(() => {
        alert("This site will not work without camera/microphone access");
      });
  };

  useEffect(() => {
    initiateCall();
  }, []);

  return <div>Room</div>;
};

export default Room;
