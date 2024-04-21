import { useDispatch } from "react-redux";
import { FormSubmitButton } from "../FormElements";
import { updateUserWeightExerciseThunk } from "../../store/userOwnedExercisesFiltered";
import { updateWeightExerciseAllExercises } from "../../store/userOwnedExercises";

function EditStrengthExercise({
  nameError,
  isModified,
  exerciseName,
  exerciseId,
  setIsPanelOpen,
}) {
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const weightExerciseForm = new FormData();
    weightExerciseForm.append("exercise_name", exerciseName.trim());

    try {
      const exercise = await dispatch(
        updateUserWeightExerciseThunk(exerciseId, weightExerciseForm)
      );
      await dispatch(updateWeightExerciseAllExercises(exercise));
      setIsPanelOpen(false);
    } catch (e) {
      console.error(e);
    }
  };
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
