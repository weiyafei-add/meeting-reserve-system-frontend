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

const determinDevice = () => {
  const Device = {} as any;
  Device.userAgent = navigator.userAgent;
  Device.isMobileDevice = !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(
    Device.userAgent.toUpperCase() || ""
  );
  Device.isTablet =
    /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
      Device.userAgent.toLowerCase()
    );
  Device.isIpad = /macintosh/.test(Device.userAgent.toLowerCase()) && "ontouchend" in document;
  Device.isDesktop = !Device.isMobileDevice && !Device.isTablet && !Device.isIpad;
  return { Device };
};

export { determinDevice, APP_URL, ROOM_ID };
