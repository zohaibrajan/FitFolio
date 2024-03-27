import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  isEmpty,
  hasErrors,
  checkCaloriesBurned,
  checkDuration,
} from "../../utils";
import {
  updateUserCardioExerciseThunk,
  updateUserWeightExerciseThunk,
} from "../../store/userOwnedExercisesFiltered";
import {
  updateCardioExerciseAllExercises,
  updateWeightExerciseAllExercises,
} from "../../store/userOwnedExercises";
import "./EditExercisePanel.css";

function EditCardioExercise({ setIsFormModified }) {
  const [exerciseName, setExerciseName] = useState(
    selectedExercise.exerciseName.split("*")[0]
  );
  const [caloriesBurned, setCaloriesBurned] = useState(
    selectedExercise.caloriesPerMinute * duration
  );
  const [cardioErrors, setCardioErrors] = useState({
    exercise: "",
    duration: "",
    calories: "",
  });
  const commonChecks = isEmpty(exerciseName);
  const cardioChecks =
    [duration, caloriesBurned].some(isEmpty) || hasErrors(cardioErrors);
  const disabled = commonChecks || cardioChecks;

  return (
    <>
      <label className="edit-exercise-panel-label">
        Intensity?
        <select
          className="cardio-input"
          name="intensity"
          value={intensity}
          onBlur={() => checkForExercise(exerciseName, exerciseId)}
          onChange={(e) => {
            setIntensity(e.target.value);
            setIsFormModified(true);
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>
      <div className="exercise-name-error"></div>
      <label className="edit-exercise-panel-label">
        Duration (Minutes):
        <input
          type="number"
          value={duration}
          onBlur={() => {
            checkDuration(duration, cardioErrors, setCardioErrors);
            checkForExercise(exerciseName, exerciseId);
          }}
          onChange={(e) => {
            setDuration(e.target.value);
            setIsFormModified(true);
            setCardioErrors({ ...cardioErrors, duration: "" });
          }}
        ></input>
      </label>
      {cardioErrors.duration ? (
        <div className="exercise-name-error">{cardioErrors.duration}</div>
      ) : (
        <div className="exercise-name-error"></div>
      )}
      <label className="edit-exercise-panel-label">
        Calories Burned:
        <input
          type="number"
          value={caloriesBurned}
          onBlur={() => {
            checkCaloriesBurned(caloriesBurned, cardioErrors, setCardioErrors);
            checkForExercise(exerciseName, exerciseId);
          }}
          onChange={(e) => {
            setCaloriesBurned(e.target.value);
            setIsFormModified(true);
            setCardioErrors({ ...cardioErrors, calories: "" });
          }}
        ></input>
      </label>
      {cardioErrors.calories ? (
        <div className="exercise-name-error">{cardioErrors.calories}</div>
      ) : (
        <div className="exercise-name-error"></div>
      )}
    </>
  );
}

export default EditCardioExercise;
