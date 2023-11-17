import { Button, Switch, message } from "antd";

const Setting = () => {
  const compatible = function () {
    if (typeof Notification === "undefined") {
      message.info("浏览器暂不支持消息通知");
      return false;
    }
    return true;
  };

  const handleOnChange = (value: any) => {
    if (value && compatible()) {
      Notification.requestPermission(function (permission) {
        console.log(permission);
      });
    }
  };

  return (
    <div>
      <Switch title="开启通知" onChange={handleOnChange} />
      <Button
        onClick={() => {
          if (compatible()) {
            new Notification("会议开始通知", {
              body: "您预约的会议即将开始，请注意及时入会哦！",
              tag: "0",
              icon: "",
              renotify: true,
              dir: "auto",
            });
          }
        }}
      >
        测试通知
      </Button>
    </div>
  );
};

export default Setting;
