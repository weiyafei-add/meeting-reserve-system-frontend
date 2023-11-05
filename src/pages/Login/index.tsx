import { LockOutlined, MobileOutlined, UserOutlined, QrcodeOutlined } from "@ant-design/icons";
import { LoginFormPage, ProConfigProvider, ProFormCaptcha, ProFormText } from "@ant-design/pro-components";
import { Drawer, Divider, Space, Tabs, message, theme } from "antd";
import type { CSSProperties } from "react";
import { useState } from "react";
import "./index.less";

type LoginType = "register" | "login" | "qrcode";

const iconStyles: CSSProperties = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

const Page = () => {
  const [loginType, setLoginType] = useState<LoginType>("login");
  const { token } = theme.useToken();
  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      <LoginFormPage
        onFinish={async (formData) => {}}
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="企业会议综合管理系统"
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0,0.65)",
          // backdropFilter: "blur(4px)",
          minHeight: "400px",
        }}
        submitter={{
          searchConfig: {
            submitText: loginType === "login" ? "登录" : "注册",
          },
        }}
        autoComplete="off"
      >
        <Tabs
          items={[
            { tabKey: "login", label: "登录", key: "login" },
            { tabKey: "qrcode", label: "扫码登录", key: "qrcode" },
            { tabKey: "register", label: "注册", key: "register" },
          ]}
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        ></Tabs>
        {loginType === "login" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              placeholder={"用户名"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              placeholder={"密码"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
        )}
        {loginType === "register" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: (
                  <UserOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              name="username"
              placeholder={"用户名"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名！",
                },
              ]}
            />
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              placeholder={"请输入昵称"}
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "请输入昵称!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              placeholder={"密码"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />

            <ProFormText
              name="email"
              fieldProps={{
                size: "large",
                prefix: (
                  <LockOutlined
                    style={{
                      color: token.colorText,
                    }}
                    className={"prefixIcon"}
                  />
                ),
              }}
              placeholder={"请输入邮箱"}
              rules={[
                {
                  required: true,
                  message: "请输入邮箱！",
                },
              ]}
            />
          </>
        )}

        {loginType === "qrcode" && <div>qrcode login</div>}
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
};
