import { Button, Col, Row, Switch, message } from "antd";
import { useEffect, useState } from "react";

const Setting = () => {
  const [status, setStatus] = useState("granted");

  useEffect(() => {
    Notification.requestPermission(function (permission) {
      setStatus(permission);
    });
  }, []);

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
      return;
    }
    Notification.requestPermission();
  };

  return (
    <div>
      <Row>
        <Col>开启桌面通知：</Col>
        <Col>
          <Switch checked={status === "granted"} onChange={handleOnChange} />
        </Col>
      </Row>
    </div>
  );
};

export default Setting;
