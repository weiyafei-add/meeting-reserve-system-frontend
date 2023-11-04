import React, { useState } from "react";
import { QrcodeOutlined } from "@ant-design/icons";
import "./index.scss";
import { history } from "umi";

const statusMap: any = {
  noscan: "未扫码",
  "scan-wait-confitm": "等待确认",
  "scan-confirm": "已确认",
  "scan-cancel": "已取消",
  expired: "二维码已过期",
};

let interval: any = null;

const LoginForm = (props: { mode: string; onSubmit: any; qrcodeLogin?: boolean }) => {
  const { mode, onSubmit, qrcodeLogin } = props;
  return (
    <form onSubmit={onSubmit}>
      <div className="form-block__input-wrapper">
        <div className="form-group form-group--login">
          <Input type="text" id="username" label="用户名" disabled={mode === "signup"} />
          <Input type="password" id="password" label="密码" disabled={mode === "signup"} />
        </div>
        <div className="form-group form-group--signup">
          <Input type="text" id="fullname" label="用户名" disabled={mode === "login"} />
          <Input type="email" id="email" label="邮箱" disabled={mode === "login"} />
          <Input type="password" id="createpassword" label="密码" disabled={mode === "login"} />
          <Input type="password" id="repeatpassword" label="确认密码" disabled={mode === "login"} />
        </div>
      </div>
      <button
        className="button button--primary full-width"
        type="submit"
        onClick={() => {
          history.push("/");
        }}
      >
        {mode === "login" ? "登录" : "注册"}
      </button>
    </form>
  );
};

const LoginComponent = () => {
  const [mode, setMode] = useState("login");
  const [qrcodeLogin, setQrcodeLogin] = useState(false);
  const [qrcodeData, setQrcodeData] = useState<any>({});
  const [qrcodeStatus, setQrcodeStatus] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string>("");

  const toggleMode = () => {
    var newMode = mode === "login" ? "signup" : "login";
    setMode(newMode);
  };

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    console.log(123);
  };

  return (
    <div className="login">
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>

      <section className={`form-block form-block--is-${mode}`}>
        <div
          className="qrcode"
          onClick={() => {
            setQrcodeLogin(!qrcodeLogin);
            fetch("http://192.168.3.136:3000/qrcode/generate")
              .then((res) => res.json())
              .then((res) => {
                setQrcodeData(res);
                interval = setInterval(() => {
                  fetch(`http://192.168.3.136:3000/qrcode/check?id=${res.qrcode_id}`)
                    .then((res) => res.json())
                    .then((res) => {
                      setQrcodeStatus(res.status);
                      if (res.status === "scan-confirm") {
                        setCurrentUser(res.userInfo.username);
                        console.log(res);
                        // setTimeout(() => {
                        //   clearInterval(interval);
                        //   // history.push("/");
                        // }, 1000);
                      }
                    });
                }, 3000);
              });
          }}
        >
          <QrcodeOutlined className="qrcode-login" />
        </div>
        <header className="form-block__header">
          <h1>{mode === "login" ? "欢迎" : "注册"}</h1>
          {qrcodeLogin ? (
            <div>
              <img src={qrcodeData.img} />
              <div>{statusMap[qrcodeStatus]}</div>
              <div>{currentUser}</div>
            </div>
          ) : (
            <div className="form-block__toggle-block">
              <span>{mode === "login" ? "注册账户" : "登录"}&#8594;</span>
              <input id="form-toggler" type="checkbox" onClick={toggleMode} />
              <label htmlFor="form-toggler"></label>
            </div>
          )}
        </header>
        {!qrcodeLogin && <LoginForm mode={mode} qrcodeLogin={qrcodeLogin} onSubmit={onSubmit} />}
      </section>
    </div>
  );
};

const Input = ({ id, type, label, disabled }: { id: string; type: string; label: string; disabled: boolean }) => (
  <input className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled} />
);

export default LoginComponent;
