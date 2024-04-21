import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FormInput, FormSubmitButton, FormSelect } from "../FormElements";
import { updateUserCardioExerciseThunk } from "../../store/userOwnedExercisesFiltered";
import { updateCardioExerciseAllExercises } from "../../store/userOwnedExercises";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import {
  checkDuration,
  checkCaloriesBurned,
  isEmpty,
  hasErrors,
} from "../../utils";

function EditCardioExercise({
  exerciseData,
  nameError,
  exerciseName,
  setIsPanelOpen,
  setIsModified,
  isModified,
}) {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    duration: 60,
    intensity: exerciseData.intensity,
    caloriesBurned: exerciseData.caloriesPerMinute * 60,
  });
  const [cardioErrors, setCardioErrors] = useState({
    duration: "",
    calories: "",
  });
  const { duration, intensity, caloriesBurned } = data;
  const cardioChecks =
    [duration, caloriesBurned].some(isEmpty) || hasErrors(cardioErrors);
  const disabled = nameError || cardioChecks;
  function updateData(fields) {
    setData((prev) => ({ ...prev, ...fields }));
    setIsModified(true);
  }

  useEffect(() => {
    setData({
      duration: 60,
      intensity: exerciseData.intensity,
      caloriesBurned: exerciseData.caloriesPerMinute * 60,
    });
    setIsModified(false);
  }, [exerciseData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cardioExerciseForm = new FormData();
    cardioExerciseForm.append("exercise_name", exerciseName.trim());
    cardioExerciseForm.append("intensity", intensity);
    cardioExerciseForm.append("duration", duration);
    cardioExerciseForm.append("calories_burned", caloriesBurned);
    try {
      const exercise = await dispatch(
        updateUserCardioExerciseThunk(exerciseData.id, cardioExerciseForm)
      );
      await dispatch(updateCardioExerciseAllExercises(exercise));
      setIsPanelOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <FormSelect
        label={"Intensity"}
        name={"intensity"}
        value={intensity}
        onChange={(e) => updateData({ intensity: e.target.value })}
        options={[
          { label: "Low", value: "Low" },
          { label: "Medium", value: "Medium" },
          { label: "High", value: "High" },
        ]}
      />
      <ErrorHandlingComponent error={false} />
      <FormInput
        label={"How Long? (Minutes)"}
        type={"number"}
        value={duration}
        placeholder={"Duration eg. 30"}
        name={"duration"}
        onBlur={(e) =>
          checkDuration(e.target.value, cardioErrors, setCardioErrors)
        }
        onChange={(e) => updateData({ duration: e.target.value })}
      />
      <ErrorHandlingComponent error={cardioErrors.duration} />
      <FormInput
        label={"Calories Burned"}
        type={"number"}
        value={caloriesBurned}
        placeholder={"Calories Burned eg. 300"}
        name={"caloriesBurned"}
        onBlur={(e) =>
          checkCaloriesBurned(e.target.value, cardioErrors, setCardioErrors)
        }
        onChange={(e) => updateData({ caloriesBurned: e.target.value })}
      />
      <ErrorHandlingComponent error={cardioErrors.duration} />
      <FormSubmitButton
        disabled={disabled || !isModified}
        divClass={"create-exercise-button-container"}
        buttonClass={"edit-exercise-panel-submit-button"}
        text={"Update Exercise"}
      />
    </form>
  );
}

export default EditCardioExercise;
