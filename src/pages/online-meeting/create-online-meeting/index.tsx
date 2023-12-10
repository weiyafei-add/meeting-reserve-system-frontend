import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Input, Select } from "antd";
import styles from "./index.module.less";
import Room from "../index";
import { getUserlist } from "@/pages/User/api";
const { TextArea } = Input;

export type RoomInfoRef = {
  meetingSubject?: string;
  roomName?: string;
  attendMeetingList?: Array<number>;
  remark?: string;
};

const Index = () => {
  const [pageType, setPageType] = useState("create");
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const roomInfoRef = useRef<RoomInfoRef>({});

  useEffect(() => {
    getUserlist({
      pageNo: 1,
      pageSize: 100,
    }).then((res) => {
      setUserList(res.data.users);
    });
  }, []);

  const handleIntoRoom = () => {
    form.validateFields().then(() => {
      roomInfoRef.current = form.getFieldsValue();
      setPageType("room");
    });
  };

  const renderIntoRoomStep = () => {
    return (
      <div className={styles.create_room_container}>
        <h2 style={{ textAlign: "center", marginBottom: 50 }}>创建会议室</h2>
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
          <Form.Item
            label="会议主题"
            initialValue={"测试会议"}
            name={"meetingSubject"}
            rules={[{ required: true, message: "请输入会议主题" }]}
          >
            <Input placeholder="请输入会议主题" />
          </Form.Item>
          <Form.Item
            label="会议室名称"
            initialValue={"test123"}
            name={"roomName"}
            rules={[{ required: true, message: "请输入会议室名称" }]}
          >
            <Input placeholder="请输入会议室名称" />
          </Form.Item>
          <Form.Item
            label="参会人员"
            name={"attendMeetingList"}
            rules={[{ required: true, message: "请选择参会人员" }]}
            initialValue={[1]}
          >
            <Select
              mode="multiple"
              options={userList.map((item: any) => ({
                label: item.username,
                value: item.id,
              }))}
              allowClear
              placeholder="请选择参会人员"
            />
          </Form.Item>
          <Form.Item label="备注" name={"remark"}>
            <TextArea placeholder="请输入会议备注" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" onClick={handleIntoRoom}>
              进入会议室
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo") as any);

  return (
    <div>
      {pageType === "create" && renderIntoRoomStep()}
      {pageType !== "create" && (
        <Room
          name={userInfo.nickName || '临时用户'}
          roomInfo={roomInfoRef.current}
          exitRoom={() => {
            setPageType("create");
          }}
        />
      )}
    </div>
  );
};

export default Index;
