import React from "react";
import "./FormInputAnimated.css";

const FormInputAnimated = ({ text, label, value, updateData }) => {
    console.log(label, value)
    return (
    <div className="input-container">
      <input
        required
        type="text"
        className="input-field"
        placeholder=" "
        value={value}
        onChange={(e) => {
            console.log(e.target.value)
            updateData({ [label]: e.target.value })
        }}
      />
      <label className="input-label">{text}</label>
    </div>
    );
}

export default FormInputAnimated;
