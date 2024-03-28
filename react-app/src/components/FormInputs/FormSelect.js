function FormSelect({ label, name, value, onChange, options }) {
  return (
    <label className="exercise-labels">
      {label}
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{ width: "65%" }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default FormSelect;
