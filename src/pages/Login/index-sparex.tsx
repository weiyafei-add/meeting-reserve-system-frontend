import React, { CSSProperties, useEffect, useState } from "react";
import { QrcodeOutlined } from "@ant-design/icons";
import { history } from "umi";
import request from "@/utils/request";
import { register, getCaptcha, login } from "./api";
import { message } from "antd";
import "./index-spare.scss";

const statusMap: any = {
  noscan: "未扫码",
  "scan-wait-confitm": "等待确认",
  "scan-confirm": "已确认",
  "scan-cancel": "已取消",
  expired: "二维码已过期",
};

let interval: any = null;

const LoginForm = (props: { mode: string; onSubmit: any }) => {
  const { mode, onSubmit } = props;
  const [email, setEmail] = useState("");

  const handleGetCaptcha = (e: any) => {
    e.preventDefault();
    if (!email) {
      message.error("请输入有效的邮箱");
      return;
    }
    getCaptcha({
      address: email,
    }).then((res) => {
      message.success("发送成功");
    });
  };

  const onChange = (e: any) => {
    setEmail(e.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-block__input-wrapper">
        <div className="form-group form-group--login">
          <Input type="text" id="username" label="用户名" disabled={mode === "signup"} />
          <Input type="password" id="password" label="密码" disabled={mode === "signup"} />
        </div>
        <div className="form-group form-group--signup">
          <Input type="text" id="username" label="用户名" disabled={mode === "login"} />
          <Input type="text" id="nickName" label="昵称" disabled={mode === "login"} />
          <Input type="password" id="password" label="密码" disabled={mode === "login"} />
          <Input type="email" id="email" label="邮箱" onChange={onChange} disabled={mode === "login"} />
          <Input type="captcha" id="captcha" label="验证码" disabled={mode === "login"} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button className="button button--primary full-width" type="submit">
          {mode === "login" ? "登录" : "注册"}
        </button>
        {mode !== "login" && (
          <button className="button button--primary full-width" onClick={handleGetCaptcha}>
            获取验证码
          </button>
        )}
      </div>
    </form>
  );
};

const LoginComponent = () => {
  const [mode, setMode] = useState("login");
  const [qrcodeLogin, setQrcodeLogin] = useState(false);
  const [qrcodeData, setQrcodeData] = useState<any>({});
  const [qrcodeStatus, setQrcodeStatus] = useState<string>("noscan");
  const [currentUser, setCurrentUser] = useState<string>("");

  const onSubmit = async (event: SubmitEvent) => {
    let formValues: any = {};

    event.preventDefault();
    if (mode === "login") {
      Array.prototype.slice.call(event.target, 0, 2).forEach((item) => {
        formValues[item.id] = item.value;
      });
      try {
        const { data } = await login(formValues);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        message.success("登录成功");
        history.push("/");
      } catch (error: any) {
        message.error(error.data.message);
      }

      return;
    }

    Array.prototype.slice.call(event.target, 2, 7).forEach((item) => {
      formValues[item.id] = item.value;
    });
    try {
      const res = await register(formValues);
      if (res.data === "success") {
        message.success("注册成功");
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!qrcodeLogin) {
      clearInterval(interval);
    }
  }, [qrcodeLogin]);

  return (
    <div className="login">
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>

      <section className={`form-block form-block--is-${mode}`}>
        <div
          className="qrcode"
          onClick={async () => {
            setQrcodeLogin(!qrcodeLogin);
            if (qrcodeLogin) {
              return;
            }
            const { data } = await request({
              url: "/qrcode/generate",
            });
            setQrcodeData(data);
            interval = setInterval(async () => {
              const res = await request({
                url: `/qrcode/check?id=${data.qrcode_id}`,
              });
              setQrcodeStatus(res.data.status);
              if (res.data.status === "scan-confirm") {
                setCurrentUser(res.data.userInfo.username);
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                message.success("登录成功");
                console.log(res);
                setTimeout(() => {
                  clearInterval(interval);
                  history.push("/");
                }, 1000);
              }
            }, 2000);
          }}
        >
          <QrcodeOutlined className="qrcode-login" />
        </div>
        <header className="form-block__header">
          <h1>{mode === "login" ? "企业会议综合管理系统" : "注册"}</h1>
          {qrcodeLogin ? (
            <div style={{ textAlign: "center" }}>
              <img src={qrcodeData.img} />
              <div>{statusMap[qrcodeStatus]}</div>
              <div>{currentUser}</div>
            </div>
          ) : (
            <div className="form-block__toggle-block">
              <span>{mode === "login" ? "注册账户" : "登录"}&#8594;</span>
              <input
                id="form-toggler"
                type="checkbox"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                }}
              />
              <label htmlFor="form-toggler"></label>
            </div>
          )}
        </header>
        {!qrcodeLogin && <LoginForm mode={mode} onSubmit={onSubmit} />}
      </section>
    </div>
  );
};

const Input = ({
  id,
  type,
  label,
  disabled,
  ...rest
}: {
  id: string;
  type: string;
  label: string;
  disabled: boolean;
  [key: string]: any;
}) => <input {...rest} className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled} />;

export default LoginComponent;
