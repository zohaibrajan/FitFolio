import React from "react";
import "./FormInputAnimated.css";

const FormInputAnimated = ({
  text,
  label,
  value,
  updateData,
  width,
  marginTop,
  type,
  min,
  max,
  disabled,
}) => {
  return (
    <div
      className="input-container"
      style={{ width: width, marginTop: marginTop }}
    >
      <input
        required
        disabled={disabled}
        min={min}
        max={max}
        type={type || "text"}
        className="input-field"
        placeholder=" "
        value={value}
        onChange={(e) => updateData({ [label]: e.target.value })}
      />
      <label className="input-label">{text}</label>
    </div>
  );
};

export default FormInputAnimated;
