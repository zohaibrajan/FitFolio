import { useState } from "react";
import { FormInput, FormSubmitButton, FormSelect } from "../FormElements";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import {
  checkDuration,
  checkCaloriesBurned,
  isEmpty,
  hasErrors
} from "../../utils";

function EditCardioExercise({ exerciseData, nameError }) {
  const DATA = {
    duration: 60,
    intensity: exerciseData.intensity,
    caloriesBurned: exerciseData.caloriesPerMinute * 60,
  };
  const [data, setData] = useState(DATA);
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit");
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
      <ErrorHandlingComponent error={false} />
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
      <ErrorHandlingComponent error={false} />
      <FormSubmitButton
        disabled={disabled}
        divClass={"create-exercise-button-container"}
        buttonClass={"create-exercise-button"}
        text={"Add Exercise"}
      />
    </form>
  );
}

export default EditCardioExercise;
