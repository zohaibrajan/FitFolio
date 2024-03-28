function FormSubmitButton({ disabled, divClass, buttonClass, text  }) {
  return (
    <div className={divClass}>
      <button
        type="submit"
        className={buttonClass}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
}

export default FormSubmitButton;
