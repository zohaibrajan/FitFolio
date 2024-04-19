import FormInputAnimated from "./FormInputAnimated";
import { useState } from "react";


function FormInputPassword( { password, updateData }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ position: "relative", marginTop: "10px" }}>
      <FormInputAnimated
        type={showPassword ? "text" : "password"}
        label="password"
        marginTop={"25px"}
        text="Password"
        value={password}
        updateData={updateData}
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
  );
}

export default FormInputPassword;
