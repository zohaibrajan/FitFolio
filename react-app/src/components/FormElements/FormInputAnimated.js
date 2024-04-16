import React from "react";
import "./FormInputAnimated.css";

const FormInputAnimated = ({ text, label, value, updateData, width, marginTop }) => {
  return (
    <div className="input-container" style={{ width: width, marginTop: marginTop }}>
      <input
        required
        type="text"
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
