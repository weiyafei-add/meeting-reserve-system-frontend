import React, { useState } from "react";
import { Button, Input, message, Steps, theme, Form } from "antd";
import styles from "./index.module.less";
import Room from "../index";

const Index = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [pageType, setPageType] = useState("step");

  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const steps = [
    {
      title: "输入会议室信息",
      content: (
        <div className={styles.roomInfo}>
          <Form form={form} labelCol={{ span: 2 }} wrapperCol={{ span: 5 }}>
            <Form.Item name="nickname" label="昵称">
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item rules={[{ required: true, message: "请输入会议室名称" }]} name="roomname" label="会议室名称">
              <Input placeholder="请输入会议室名称" />
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const handleIntoRoom = () => {
    setPageType("room");
  };

  const renderIntoRoomStep = () => {
    return (
      <>
        <h1>创建会议室</h1>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          <Button type="primary" onClick={handleIntoRoom}>
            进入会议室
          </Button>
        </div>
      </>
    );
  };

  return (
    <div>
      {pageType === "step" && renderIntoRoomStep()}
      {pageType !== "step" && <Room name={"nicknamessss"} />}
    </div>
  );
};

export default Index;
