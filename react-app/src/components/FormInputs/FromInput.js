function FormInput({
  label,
  type,
  value,
  placeholder,
  name,
  onBlur,
  onChange,
}) {
  return (
    <label className="exercise-labels">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
      />
    </label>
  );
}

export default FormInput;
