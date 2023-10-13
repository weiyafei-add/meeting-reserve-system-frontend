let App = window as any;
import io, { Socket } from "socket.io-client";

const APP_URL = (() => {
  const protocol = "http" + (location.hostname === "localhost" ? "" : "s") + "://";
  return protocol + location.hostname + (location.hostname == "localhost" ? ":3000" : "");
})();

const ROOM_ID = (() => {
  let roomName = location.pathname.substring(1);
  if (!roomName) {
    roomName = Math.random().toString(36).substring(2, 6);
    window.history.pushState({ url: `${APP_URL}/${roomName}` }, roomName, `${APP_URL}/${roomName}`);
  }
  return roomName;
})();

let signalingSocket: Socket;

function initiateCall() {
  App.userAgent = navigator.userAgent;
  App.isMobileDevice = !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
    App.userAgent.toUpperCase() || ""
  );
  App.isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      App.userAgent.toLowerCase()
    );
  App.isIpad = /macintosh/.test(App.userAgent.toLowerCase()) && "ontouchend" in document;
  App.isDesktop = !App.isMobileDevice && !App.isTablet && !App.isIpad;

  App.roomId = ROOM_ID;

  App.roomLink = `${APP_URL}/${ROOM_ID}`;
  console.log("APP_URL,", APP_URL);
  signalingSocket = io(APP_URL);
  //   signalingSocket = io(); 连接到当前服务器

  signalingSocket.on("connect", () => {
    App.peerId = signalingSocket.id;

    console.log("peerId", App.peerId);
  });
}

const determinDevice = (App: any) => {
  App.userAgent = navigator.userAgent;
  App.isMobileDevice = !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
    App.userAgent.toUpperCase() || ""
  );
  App.isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      App.userAgent.toLowerCase()
    );
  App.isIpad = /macintosh/.test(App.userAgent.toLowerCase()) && "ontouchend" in document;
  App.isDesktop = !App.isMobileDevice && !App.isTablet && !App.isIpad;
};

export { determinDevice, APP_URL, ROOM_ID };
