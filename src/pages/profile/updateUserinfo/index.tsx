import React, { useEffect } from "react";
import { getUserInfo } from "../api";
import { Button, Form, Input } from "antd";
import styles from "./index.module.less";
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

  return (
    <div className={styles.changeInfo}>
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 8 }} onFinish={onFinish}>
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
