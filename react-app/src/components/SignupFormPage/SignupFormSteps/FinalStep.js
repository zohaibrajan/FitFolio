import { FormWrapper } from "./FormWrapper";
import FormInputAnimated from "../../FormElements/FormInputAnimated";
import { useState } from "react";
import "./FinalStep.css";

export function FinalStep({ updateData, email, password, confirmPassword }) {
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
          type="email"
          marginTop={"20px"}
          label="email"
          value={email}
          updateData={updateData}
          text="Email"
        />
        <div style={{ position: "relative", marginTop: "20px" }}>
          <FormInputAnimated
            type={showPassword ? "text" : "password"}
            label="password"
            value={password}
            updateData={updateData}
            text="Password"
          />
          <button
            onClick={(e) => togglePasswordVisibility(e)}
            id="toggle-password-visibility"
          >
            {showPassword ? (
              <i className="fa-solid fa-eye-slash"></i>
            ) : (
              <i className="fa-solid fa-eye"></i>
            )}
          </button>
        </div>
        <FormInputAnimated
          type="password"
          marginTop={"20px"}
          label="confirmPassword"
          value={confirmPassword}
          updateData={updateData}
          text="Confirm Password"
        />
      </div>
    </FormWrapper>
  );
}
