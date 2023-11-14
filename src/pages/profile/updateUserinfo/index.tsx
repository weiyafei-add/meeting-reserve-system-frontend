import React, { useEffect } from "react";
import { getUserInfo } from "../api";
import { Button, Form, Input, Upload, UploadProps, message } from "antd";
import styles from "./index.module.less";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const index = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    async function getData() {
      const res = await getUserInfo();
      console.log(res);
      form.setFieldsValue(res.data);
    }

    getData();
  }, []);

  const onFinish = (value: any) => {
    console.log(value);
  };

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:3000/user/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file);
      }
      if (status === "done") {
        console.log(info.file);
        message.success(`${info.file.name} 上传成功`);
      } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className={styles.changeInfo}>
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} onFinish={onFinish}>
        <Form.Item label="头像" name={"avatar"} rules={[{ required: true, message: "请输入昵称" }]}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或者拖拽文件到此区域进行上传</p>
          </Dragger>
        </Form.Item>
        <Form.Item label="昵称" name={"nickName"} rules={[{ required: true, message: "请输入昵称" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="">
          <Button htmlType="submit" type="primary">
            修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default index;
