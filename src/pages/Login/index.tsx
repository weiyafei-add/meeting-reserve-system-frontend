import React, {useState} from "react";
import './index.scss';

const LoginForm = (props: {mode: string, onSubmit: any}) => {
  const { mode, onSubmit } = props;
  return (
    <form onSubmit={onSubmit}>
      <div className="form-block__input-wrapper">
        <div className="form-group form-group--login">
          <Input type="text" id="username" label="user name" disabled={mode === "signup"} />
          <Input type="password" id="password" label="password" disabled={mode === "signup"} />
        </div>
        <div className="form-group form-group--signup">
          <Input type="text" id="fullname" label="full name" disabled={mode === "login"} />
          <Input type="email" id="email" label="email" disabled={mode === "login"} />
          <Input type="password" id="createpassword" label="password" disabled={mode === "login"} />
          <Input type="password" id="repeatpassword" label="repeat password" disabled={mode === "login"} />
        </div>
      </div>
      <button className="button button--primary full-width" type="submit">
        {mode === "login" ? "Log In" : "Sign Up"}
      </button>
    </form>
  );
} 

const LoginComponent = () => {
  const [mode, setMode] = useState('login');

 const toggleMode = () => {
    var newMode = mode === "login" ? "signup" : "login";
    setMode(newMode);
  }

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    console.log(123)
  }

  return (
    <div className="login">
      <div className={`form-block-wrapper form-block-wrapper--is-${mode}`}></div>
      <section className={`form-block form-block--is-${mode}`}>
        <header className="form-block__header">
          <h1>{mode === "login" ? "Welcome back!" : "Sign up"}</h1>
          <div className="form-block__toggle-block">
            <span>{mode === "login" ? "扫码登录" : "账户登录"}&#8594;</span>
            <input id="form-toggler" type="checkbox" onClick={toggleMode} />
            <label htmlFor="form-toggler"></label>
          </div>
        </header>
        <LoginForm mode={mode} onSubmit={onSubmit} />
      </section>
    </div>
  );
}

const Input = ({ id, type, label, disabled }: {
  id: string
  type: string,
  label: string,
  disabled: boolean
}) => (
  <input className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled} />
);

export default LoginComponent;
