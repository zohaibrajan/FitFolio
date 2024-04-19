import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import {
  FormInputAnimated,
  FormInputPassword,
} from "../../components/FormElements";
import { FormWrapper } from "../SignupFormPage/SignupFormSteps";
import "./LoginForm.css";

const DATA = {
  email: "",
  password: "",
};

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(DATA);
  const [error, setError] = useState("");

  function updateData(fields) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  if (sessionUser) return <Redirect to="/my-home/diary" />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = data;
    setIsLoading(true);
    const loginData = await dispatch(login(email, password));
    setIsLoading(false);
    if (loginData && loginData.email) {
      setError(loginData.email);
    } else if (loginData && loginData.password) {
      setError(loginData.password);
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await dispatch(login("demo@aa.io", "password"));
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="login-form-parent">
          <form onSubmit={handleSubmit} className="login-form-container">
            <FormWrapper title="Member Login">
              <div>
                <FormInputAnimated
                  text="Email"
                  label="email"
                  value={data.email}
                  updateData={updateData}
                  type="email"
                />
                <FormInputPassword
                  password={data.password}
                  updateData={updateData}
                />
              </div>
            </FormWrapper>
            {error && <div className="login-errors">{error}</div>}
            <div className="login-submit-button-container">
              <button className="login-submit-button" type="submit">
                LOG IN
              </button>
              <button className="demo-login-button" onClick={demoLogin}>
                Demo User
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default LoginFormPage;
