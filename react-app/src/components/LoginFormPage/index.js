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
import { validateLogin } from "../../utils";
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
  const [errors, setErrors] = useState("");

  function updateData(fields) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  if (sessionUser) return <Redirect to="/my-home/diary" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorData = validateLogin(data);

    if (errorData) {
      setErrors(errorData);
      return;
    }

    const { email, password } = data;
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
    await dispatch(login("demo@aa.io", "password"));
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="signup-form-parent">
          <form onSubmit={handleSubmit} className="signup-form-container">
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
            <div className="login-submit-button-container">
              <button className="login-submit-button" type="submit">
                Log In
              </button>
            </div>
            <div className="demo-login-container">
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
