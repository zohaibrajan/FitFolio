import { FormSubmitButton } from "../FormElements";

function EditStrengthExercise({ nameError, isModified }) {

  const handleSubmit = async (e) => {
    e.preventDefault();
  }
  return (
    <>
      <div className="edit-exercise-panel-strength-text-container">
        <p>For Strength Exercises, only the name is required</p>
      </div>
      <form onSubmit={handleSubmit}>
        <FormSubmitButton
          disabled={nameError || !isModified}
          divClass={"create-exercise-button-container"}
          buttonClass={"edit-exercise-panel-submit-button"}
          text={"Update Exercise"}
        />
      </form>
    </>
  );
}

export default EditStrengthExercise;
