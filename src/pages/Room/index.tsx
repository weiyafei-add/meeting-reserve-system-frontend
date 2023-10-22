import React, { useEffect, useRef, useState, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { determinDevice, APP_URL, ROOM_ID } from "@/utils/webRtc";
import "./index.css";

type InitiateState = typeof initiateState;

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
];

let signalingSocket: Socket;
let localMediaStream: null | {} = null;
let peerMediaElements: any = {};
let peers: any = {};
let channel: any = {};
let dataChannels: any = {};

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
    any
  ];

  function initiateCall() {
    determinDevice(App);

    App.roomId = ROOM_ID;
    App.roomLink = `${APP_URL}/${ROOM_ID}`;
    signalingSocket = io("http://192.168.1.186:3000");
    //   signalingSocket = io(); 连接到当前服务器
    setState({
      ...App,
    });
    signalingSocket.on("connect", () => {
      App.peerId = signalingSocket.id;
      setState({
        ...App,
      });
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

    signalingSocket.on("disconnect", () => {
      for (let peet_id in peerMediaElements) {
        document.getElementById("videos")?.removeChild(peerMediaElements[peet_id].parentNode);
        resizeVideos();
      }
      for (let peer_id in peers) {
        peers[peer_id].close();
      }

      peers = {};
      peerMediaElements = {};
    });

    signalingSocket.on("addPeer", function (config) {
      const peer_id = config.peer_id;
      if (peer_id in peers) return;

      channel = config.channel;

      const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      peers[peer_id] = peerConnection;
      peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
          signalingSocket.emit("relayICECandidate", {
            peer_id: peer_id,
            ice_candidate: {
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              candidate: event.candidate.candidate,
            },
          });
        }
      };

      (peerConnection as any).onaddstream = function (event) {
        // if (!channel[peer_id]["userData"]["userAgent"]) {
        //   return;
        // }

        const remoteMedia = getVideoElement(peer_id);
        peerMediaElements[peer_id] = remoteMedia;
        attachMediaStream(remoteMedia, event.stream);
        resizeVideos();

        for (let peerId in channel) {
          const videoPeerName = document.getElementById(peerId + "_videoPeerName");
          const peerName = channel[peerId]["userData"]["peerName"];
          if (videoPeerName && peerName) {
            videoPeerName.innerHTML = peerName;
          }

          const videoAvatarImg = document.getElementById(peerId + "_videoEnabled");
          const videoEnabled = channel[peerId]["userData"]["videoEnabled"];
          if (videoAvatarImg && !videoEnabled) {
            videoAvatarImg.style.visibility = "visible";
          }

          const audioEnabledEl = document.getElementById(peerId + "_audioEnabled");
          const audioEnabled = channel[peerId]["userData"]["audioEnabled"];
          if (audioEnabledEl) {
            audioEnabledEl.className = "audioEnabled icon-mic" + (audioEnabled ? "" : "-off");
          }
        }
      };

      peerConnection.ondatachannel = function (event) {
        console.log("Datachannel event" + peer_id, event);
        event.channel.onmessage = (msg) => {
          let dataMessage = {};
          try {
            dataMessage = JSON.parse(msg.data);
            handleIncomingDataChannelMessage(dataMessage);
          } catch (err) {
            console.log(err);
          }
        };
      };

      /* Add our local stream */
      peerConnection.addStream(localMediaStream);
      dataChannels[peer_id] = peerConnection.createDataChannel("talk__data_channel");

      if (config.should_create_offer) {
        peerConnection.onnegotiationneeded = () => {
          peerConnection
            .createOffer()
            .then((localDescription) => {
              peerConnection
                .setLocalDescription(localDescription)
                .then(() => {
                  signalingSocket.emit("relaySessionDescription", {
                    peer_id: peer_id,
                    session_description: localDescription,
                  });
                })
                .catch(() => {
                  alert("Offer setLocalDescription failed!");
                });
            })
            .catch((error) => {
              console.log("Error sending offer: ", error);
            });
        };
      }
    });

    signalingSocket.on("sessionDescription", function (config) {
      const peer_id = config.peer_id;
      const peer = peers[peer_id];
      const remoteDescription = config.session_description;

      const desc = new RTCSessionDescription(remoteDescription);
      peer.setRemoteDescription(
        desc,
        () => {
          if (remoteDescription.type == "offer") {
            peer.createAnswer(
              (localDescription: any) => {
                peer.setLocalDescription(
                  localDescription,
                  () => {
                    signalingSocket.emit("relaySessionDescription", {
                      peer_id: peer_id,
                      session_description: localDescription,
                    });
                  },
                  () => alert("Answer setLocalDescription failed!")
                );
              },
              (error: Error) => console.log("Error creating answer: ", error)
            );
          }
        },
        (error: Error) => console.log("setRemoteDescription error: ", error)
      );
    });

    signalingSocket.on("iceCandidate", function (config) {
      const peer = peers[config.peer_id];
      const iceCandidate = config.ice_candidate;
      peer.addIceCandidate(new RTCIceCandidate(iceCandidate)).catch((error: Error) => {
        console.log("Error addIceCandidate", error);
      });
    });

    signalingSocket.on("removePeer", function (config) {
      const peer_id = config.peer_id;
      if (peer_id in peerMediaElements) {
        document.getElementById("videos")!.removeChild(peerMediaElements[peer_id].parentNode);
        resizeVideos();
      }
      if (peer_id in peers) {
        peers[peer_id].close();
      }
      delete dataChannels[peer_id];
      delete peers[peer_id];
      delete peerMediaElements[config.peer_id];

      delete channel[config.peer_id];
      //console.log('removePeer', JSON.stringify(channel, null, 2));
    });
  }

  const joinChatChannel = (channel: any, userData: any) => {
    signalingSocket.emit("join", { channel, userData });
  };

  const attachMediaStream = (element: HTMLVideoElement, stream: MediaStream) => (element.srcObject = stream);

  const resizeVideos = () => {
    const numToString = ["", "one", "two", "three", "four", "five", "six"];
    const videos = document.querySelectorAll("#videos .video");
    document.querySelectorAll("#videos .video").forEach((v) => {
      v.className = "video " + numToString[videos.length];
    });
  };

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
      .then((stream) => {
        localMediaStream = stream;
        const localMedia = getVideoElement(App.peerId, true);
        attachMediaStream(localMedia, stream);
        resizeVideos();
        if (callback) {
          callback();
        }
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          setState({
            videoDevices: devices.filter((device) => device.kind === "videoinput" && device.deviceId !== "default"),
            audioDevices: devices.filter((device) => device.kind === "audioinput" && device.deviceId !== "default"),
          });
        });
      })
      .catch(() => {
        alert("会议室需要视频和麦克风授权才可以用哦");
      });
  };

  const getVideoElement = (peerId: any, isLocal?: boolean) => {
    const videoWrap = document.createElement("div") as any;
    videoWrap.className = "video";

    const media = document.createElement("video") as any;
    media.setAttribute("playsinline", true);
    media.autoplay = true;
    media.controls = false;
    if (isLocal) {
      media.setAttribute("id", "selfVideo");
      media.className = "mirror";
      media.muted = true;
      media.volume = 0;
    } else {
      media.mediaGroup = "remotevideo";
    }

    const audioEnabled = document.createElement("i");
    audioEnabled.setAttribute("id", peerId + "_audioEnabled");
    audioEnabled.className = "audioEnabled icon-mic";

    const peerNameEle = document.createElement("div");
    peerNameEle.setAttribute("id", peerId + "_videoPeerName");
    peerNameEle.className = "videoPeerName";
    if (isLocal) {
      peerNameEle.innerHTML = `${App.name ?? ""} (自己)`;
    } else {
      peerNameEle.innerHTML = "Unnamed";
    }

    const fullScreenBtn = document.createElement("button");
    fullScreenBtn.className = "icon-maximize";
    fullScreenBtn.addEventListener("click", () => {
      if (videoWrap.requestFullscreen) {
        videoWrap.requestFullscreen();
      } else if (videoWrap.webkitRequestFullscreen) {
        videoWrap.webkitRequestFullscreen();
      }
    });

    const videoAvatarImgSize = App.isMobileDevice ? "100px" : "200px";
    const videoAvatarImg = document.createElement("img");
    videoAvatarImg.setAttribute("id", peerId + "_videoEnabled");
    videoAvatarImg.setAttribute("src", "/videoOff.png");
    videoAvatarImg.setAttribute("width", videoAvatarImgSize);
    videoAvatarImg.setAttribute("height", videoAvatarImgSize);
    videoAvatarImg.className = "videoAvatarImg";

    videoWrap.setAttribute("id", peerId);
    videoWrap.appendChild(media);
    videoWrap.appendChild(audioEnabled);
    videoWrap.appendChild(peerNameEle);
    videoWrap.appendChild(fullScreenBtn);
    videoWrap.appendChild(videoAvatarImg);
    document.getElementById("videos")!.appendChild(videoWrap);
    return media;
  };

  useEffect(() => {
    initiateCall();
  }, []);

  const audioToggle = (e) => {
    e.stopPropagation();
    localMediaStream.getAudioTracks()[0].enabled = !localMediaStream.getAudioTracks()[0].enabled;
    setState({
      audioEnabled: !state.audioEnabled,
    });
    updateUserData("audioEnabled", !state.audioEnabled);
  };

  const videoToggle = (e) => {
    e.stopPropagation();
    localMediaStream.getVideoTracks()[0].enabled = !localMediaStream.getVideoTracks()[0].enabled;
    setState({
      videoEnabled: !state.videoEnabled,
    });
    updateUserData("videoEnabled", !state.videoEnabled);
  };

  const screenShareToggle = (e) => {
    e.stopPropagation();
    let screenMediaPromise;
    if (!state.screenShareEnabled) {
      if (navigator.getDisplayMedia) {
        screenMediaPromise = navigator.getDisplayMedia({ video: true });
      } else if (navigator.mediaDevices.getDisplayMedia) {
        screenMediaPromise = navigator.mediaDevices.getDisplayMedia({ video: true });
      } else {
        screenMediaPromise = navigator.mediaDevices.getUserMedia({
          video: { mediaSource: "screen" },
        });
      }
    } else {
      screenMediaPromise = navigator.mediaDevices.getUserMedia({ video: true });
      document.getElementById(state.peerId + "_videoEnabled").style.visibility = "hidden";
    }
    screenMediaPromise
      .then((screenStream) => {
        setState({
          screenShareEnabled: !state.screenShareEnabled,
          videoEnabled: true,
        });

        updateUserData("videoEnabled", true);

        for (let peer_id in peers) {
          const sender = peers[peer_id].getSenders().find((s) => (s.track ? s.track.kind === "video" : false));
          sender.replaceTrack(screenStream.getVideoTracks()[0]);
        }
        screenStream.getVideoTracks()[0].enabled = true;
        const newStream = new MediaStream([screenStream.getVideoTracks()[0], localMediaStream.getAudioTracks()[0]]);
        localMediaStream = newStream;
        attachMediaStream(document.getElementById("selfVideo"), newStream);
        toggleSelfVideoMirror();

        screenStream.getVideoTracks()[0].onended = function () {
          if (state.screenShareEnabled) screenShareToggle();
        };
        try {
          if (cabin) {
            cabin.event("screen-share-" + App.screenShareEnabled);
          }
        } catch (e) {}
      })
      .catch((e) => {
        alert("Unable to share screen. Please use a supported browser.");
        console.error(e);
      });
  };

  const handleIncomingDataChannelMessage = (dataMessage: any) => {
    switch (dataMessage.type) {
      case "chat":
        setState({
          showChat: true,
          hideToolbar: false,
          chats: [...state.chats, dataMessage],
        });
        // scrollToBottom()
        break;
      case "audioEnabled":
        document.getElementById(dataMessage.id + "_audioEnabled")!.className =
          "audioEnabled icon-mic" + (dataMessage.message ? "" : "-off");
        break;
      case "videoEnabled":
        document.getElementById(dataMessage.id + "_videoEnabled")!.style.visibility = dataMessage.message
          ? "hidden"
          : "visible";
        break;
      case "peerName":
        document.getElementById(dataMessage.id + "_videoPeerName")!.innerHTML = dataMessage.message;
        break;
      default:
        break;
    }
  };

  const sendDataMessage = (key, value) => {
    const dataMessage = {
      type: key,
      name: state.name,
      id: state.peerId,
      message: value,
      date: new Date().toISOString(),
    };

    switch (key) {
      case "chat":
        setState({
          chats: [...state.chats, dataMessage],
        });
        // scrollToBottom()
        break;
      default:
        break;
    }

    Object.keys(dataChannels).map((peer_id) => dataChannels[peer_id].send(JSON.stringify(dataMessage)));
  };

  const updateUserData = (key, value) => {
    sendDataMessage(key, value);

    switch (key) {
      case "audioEnabled":
        document.getElementById(state.peerId + "_audioEnabled")!.className =
          "audioEnabled icon-mic" + (value ? "" : "-off");
        break;
      case "videoEnabled":
        document.getElementById(state.peerId + "_videoEnabled")!.style.visibility = value ? "hidden" : "visible";
        break;
      case "peerName":
        document.getElementById(state.peerId + "_videoPeerName")!.innerHTML = value + " (you)";
        break;
      default:
        break;
    }
  };

  const toggleSelfVideoMirror = () => {
    document.querySelector("#videos .video #selfVideo")!.classList.toggle("mirror");
  };

  const changeCamera = (deviceId: any) => {
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: deviceId } })
      .then((camStream) => {
        console.log(camStream);

        setState({
          videoEnabled: true,
        });
        updateUserData("videoEnabled", true);

        for (let peer_id in peers) {
          const sender = peers[peer_id].getSenders().find((s) => (s.track ? s.track.kind === "video" : false));
          sender.replaceTrack(camStream.getVideoTracks()[0]);
        }
        camStream.getVideoTracks()[0].enabled = true;

        const newStream = new MediaStream([
          camStream.getVideoTracks()[0],
          (localMediaStream as any).getAudioTracks()[0],
        ]);
        localMediaStream = newStream;
        attachMediaStream(document.getElementById("selfVideo") as any, newStream);
        setState({
          selectedVideoDeviceId: deviceId,
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Error while swaping camera");
      });
  };

  const changeMicrophone = (deviceId: any) => {
    navigator.mediaDevices
      .getUserMedia({ audio: { deviceId: deviceId } })
      .then((micStream) => {
        setState({
          audioEnabled: true,
        });
        updateUserData("audioEnabled", true);

        for (let peer_id in peers) {
          const sender = peers[peer_id].getSenders().find((s) => (s.track ? s.track.kind === "audio" : false));
          sender.replaceTrack(micStream.getAudioTracks()[0]);
        }
        micStream.getAudioTracks()[0].enabled = true;

        const newStream = new MediaStream([
          (localMediaStream as any).getVideoTracks()[0],
          micStream.getAudioTracks()[0],
        ]);
        localMediaStream = newStream;
        attachMediaStream(document.getElementById("selfVideo") as any, newStream);
        setState({
          selectedAudioDeviceId: deviceId,
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Error while swaping microphone");
      });
  };

  return (
    <div>
      <section id="blanket"></section>
      <section id="videos"></section>

      {state.showSettings && (
        <div id="settings">
          <div id="name" className="label">
            <span>Name: </span>
            <input type="text" placeholder="请输入名称" defaultValue={App.name} />
          </div>
          <hr className="separator" />

          <div className="label">摄像头</div>
          {state.videoDevices.map((videoDevice: any, index) => {
            return (
              <div key={index}>
                <div
                  className={`link indent ${state.selectedVideoDeviceId === videoDevice.deviceId ? "active" : ""}`}
                  onClick={() => {
                    changeCamera(videoDevice.deviceId);
                  }}
                >
                  {videoDevice.label}
                </div>
              </div>
            );
          })}
          <hr className="separator" />
          <div className="label">麦克风</div>
          {state.audioDevices.map((audioDevice: any) => {
            return (
              <div key={audioDevice.deviceId}>
                <div
                  className={`link indent ${state.selectedAudioDeviceId === audioDevice.deviceId ? "active" : ""}`}
                  onClick={() => {
                    changeMicrophone(audioDevice.deviceId);
                  }}
                >
                  {audioDevice.label}
                </div>
              </div>
            );
          })}

          <hr className="separator" />

          <hr className="separator" />
          <div className="link" onClick={toggleSelfVideoMirror}>
            正常/反转
            <small className="light">(自己)</small>
          </div>
        </div>
      )}

      {!state.callInitiated && (
        <div id="actionsWrap">
          <div id="actions">
            <button className={`icon-mic${state.audioEnabled ? "" : "-off"}`} onClick={audioToggle}></button>
            <button className={`icon-video${state.videoEnabled ? "" : "-off"}`} onClick={videoToggle}></button>
            <button
              className={`icon-message-square ${state.showChat ? "active" : ""}`}
              onClick={() => {
                setState({
                  showChat: !state.showChat,
                });
              }}
            ></button>
            {!state.isMobileDevice && (
              <button
                className={`icon-monitor ${state.screenShareEnabled ? "active" : ""}`}
                onClick={screenShareToggle}
              ></button>
            )}
            <button
              className="icon-exit"
              onClick={() => {
                signalingSocket.close();
                for (let peer_id in peers) {
                  peers[peer_id].close();
                }
              }}
            ></button>
            <button
              className={`icon-more-horizontal ${state.showSettings ? "active" : ""}`}
              onClick={() => {
                setState({
                  showSettings: !state.showSettings,
                });
              }}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
