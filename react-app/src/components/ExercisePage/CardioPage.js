import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSelectedDate } from "../../context/SelectedDate";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import { FormInput, FormSubmitButton, FormSelect } from "../FormElements";
import { createCardioExerciseThunk } from "../../store/cardioExercises";
import { createCardioLogThunk } from "../../store/cardioLogs";

function CardioPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const date = useSelectedDate();
  const [intensity, setIntensity] = useState("Low");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (e) => {
    const cardioExerciseForm = new FormData();
    const cardioLog = new FormData();
    cardioLog.append("duration", duration);
    cardioLog.append("calories_burned", caloriesBurned);
    cardioLog.append("date", formattingUserInputDate(date.selectedDate));
    cardioLog.append("exercise_name", exerciseName);
    cardioExerciseForm.append("exercise_name", exerciseName);
    cardioExerciseForm.append("intensity", intensity);
    cardioExerciseForm.append("duration", duration);
    cardioExerciseForm.append("calories_burned", caloriesBurned);
    try {
      await dispatch(createCardioExerciseThunk(cardioExerciseForm));
      await dispatch(createCardioLogThunk(cardioLog));
      history.replace("/my-home/diary");
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
        onChange={(e) => setIntensity(e.target.value)}
        options={[
          { label: "Low", value: "Low" },
          { label: "High", value: "High" },
          { label: "Medium", value: "Medium" },
        ]}
      />
      <span style={{ height: "10px" }}></span>
      <FormInput
        label={"How Long? (Minutes)"}
        type={"number"}
        value={duration}
        placeholder={"Duration eg. 30"}
        name={"duration"}
        onBlur={(e) =>
          checkDuration(e.target.value, cardioErrors, setCardioErrors)
        }
        onChange={(e) => {
          setDuration(e.target.value);
          setCardioErrors({ ...cardioErrors, duration: "" });
        }}
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
        onChange={(e) => {
          setCaloriesBurned(e.target.value);
          setCardioErrors({ ...cardioErrors, calories: "" });
        }}
      />
      <ErrorHandlingComponent error={cardioErrors.calories} />
      <FormSubmitButton
        disabled={disabled}
        divClass={"create-exercise-button-container"}
        buttonClass={"create-exercise-button"}
        text={"Add Exercise"}
      />
    </form>
  );
}
