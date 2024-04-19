import { FormWrapper } from "../../FormElements";
import {
  FormInputAnimated,
  FormInputPassword
} from "../../FormElements"
import "./FinalStep.css";

export function FinalStep({ updateData, email, password, confirmPassword, username }) {
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
        <FormInputPassword
          password={password}
          updateData={updateData}
        />
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
