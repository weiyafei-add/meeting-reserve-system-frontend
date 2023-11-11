import React from "react";
import { Button, Col, Form, Input, Row, message, Avatar } from "antd";
import { LockOutlined, AntDesignOutlined } from "@ant-design/icons";
import styles from "./index.module.less";
import { getUpdatePasswordCaptcha, updatePassword } from "../api";
import { history } from "umi";

const Profile = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    await form.validateFields();

    const { password, newPassword } = values;

    if (newPassword !== password) {
      message.error("密码不一致");
      return;
    }

    updatePassword(values).then((res) => {
      message.success("密码修改成功, 请重新登录");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      history.push("/login");
    });
  };

  const getCaptchaBtn = async () => {
    await form.validateFields(["email"]);
    getUpdatePasswordCaptcha({
      address: form.getFieldsValue(["email"]).email,
    }).then((res) => {
      message.success("验证码已发送");
    });
  };

  return (
    <div className={styles.update_passwor_container}>
      <div className={styles.form}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item label="新密码" name="password" rules={[{ required: true, message: "请输入新密码" }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} placeholder="新密码" />
          </Form.Item>
          <Form.Item label="确认新密码" name="newPassword" rules={[{ required: true, message: "请再次输入新密码" }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="确认密码" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                type: "email",
                message: "请输入正确的邮箱",
              },
              {
                required: true,
                message: "请输入邮箱",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="验证码" rules={[{ required: true }]}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="captcha" rules={[{ required: true, message: "请输入验证码" }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Button onClick={getCaptchaBtn}>获取验证码</Button>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item style={{ paddingLeft: "10%" }}>
            <Button style={{ width: 200 }} type="primary" htmlType="submit" className="login-form-button">
              修改
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
