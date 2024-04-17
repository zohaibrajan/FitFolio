import { FormWrapper } from "./FormWrapper";
import FormInputAnimated from "../../FormElements/FormInputAnimated";
import { useState } from "react";
import "./FinalStep.css";

export function FinalStep({ updateData, email, password, confirmPassword, username }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <FormWrapper
      title="Create your account"
      text="Please enter your email and password"
    >
      <div className="username-password-container">
        <FormInputAnimated
          type="text"
          marginTop={"0px"}
          label="username"
          value={username}
          updateData={updateData}
          text="Username"
        />
        <FormInputAnimated
          type="email"
          marginTop={"25px"}
          label="email"
          value={email}
          updateData={updateData}
          text="Email"
        />
        <div style={{ position: "relative", marginTop: "10px" }}>
          <FormInputAnimated
            type={showPassword ? "text" : "password"}
            label="password"
            marginTop={"25px"}
            value={password}
            updateData={updateData}
            text="Password"
          />
          <button
            onClick={(e) => togglePasswordVisibility(e)}
            id="toggle-password-visibility"
          >
            {showPassword ? (
              <i className="fa-solid fa-eye"></i>
            ) : (
              <i className="fa-solid fa-eye-slash"></i>
            )}
          </button>
        </div>
        <FormInputAnimated
          type="password"
          marginTop={"25px"}
          label="confirmPassword"
          value={confirmPassword}
          updateData={updateData}
          text="Confirm Password"
        />
      </div>
    </FormWrapper>
  );
}
