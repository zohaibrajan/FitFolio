import "./FormWrapper.css";

export function FormWrapper({ title, text, children }) {
  return (
    <div id="form-wrapper">
      <h1 id="wrapper-title">{title}</h1>
      <span id="wrapper-text">{text}</span>
      <div id="wrapper-children">{children}</div>
    </div>
  );
}
