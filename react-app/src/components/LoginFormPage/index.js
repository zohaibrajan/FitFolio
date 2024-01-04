import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { TailSpin } from "react-loader-spinner"
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({email: "", password: ""});

  if (sessionUser) return <Redirect to="/my-home/diary" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = await dispatch(login(email, password));
    setIsLoading(false);
    if (data) {
      setErrors(data);
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await dispatch(login("demo@aa.io", "password"))
    setIsLoading(false);
  };

  const checkEmail = (email) => {
    if (email.length > 50) {
      setErrors({...errors, email: "Email address must be less than 50 characters."})
    }

    const emailRegex = new RegExp(
      "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
    );
    const isValid = emailRegex.test(email);
    if (!isValid) {
      setErrors({...errors, email: "Please enter a valid email address."})
    }
  }

  const checkPassword = (password) => {
    if (password.length > 50) {
      setErrors({...errors, password: "Password must be less than 50 characters."})
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="loading-spinner">
          <TailSpin
            visible={true}
            height="80"
            width="80"
            color="rgb(0, 102, 238)"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      ) : (
        <div className="login-form-parent">
          <div className="login-form-container">
            <h1>Member Login</h1>
            <form onSubmit={handleSubmit} className="login-form">
              <label className="login-form-labels">
                Email:
                <input
                  className="login-form-inputs"
                  type="text"
                  value={email}
                  onBlur={() => checkEmail(email)}
                  onChange={(e) => {
                    setErrors({...errors, email: ""})
                    setEmail(e.target.value)}}
                  required
                />
              </label>
              <div
                style={{
                  minHeight: "10px",
                  marginBottom: "12px",
                  maxHeight: "10px",
                }}
              >
                {errors.email ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "red",
                    }}
                  >
                    {errors.email}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "8px", color: "transparent" }}
                  ></span>
                )}
              </div>
              <label className="login-form-labels">
                Password:
                <input
                  type="password"
                  className="login-form-inputs"
                  value={password}
                  onBlur={() => checkPassword(password)}
                  onChange={(e) => {
                    setErrors({...errors, password: ""})
                    setPassword(e.target.value)}}
                  required
                />
              </label>
              <div
                style={{
                  minHeight: "10px",
                  marginBottom: "18px",
                  maxHeight: "10px",
                }}
              >
                {errors.password ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "red",
                    }}
                  >
                    {errors.password}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "8px", color: "transparent" }}
                  ></span>
                )}
              </div>
              <div className="login-submit-button-container">
                <button
                  disabled={email.length < 1 || password.length < 1 || errors.email || errors.password}
                  className="login-submit-button"
                  type="submit"
                >
                  Log In
                </button>
              </div>
            </form>
            <div className="demo-login-container">
              <button className="demo-login-button" onClick={demoLogin}>
                Demo User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginFormPage;
