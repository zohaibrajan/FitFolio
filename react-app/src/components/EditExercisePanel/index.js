import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserCardioExerciseThunk,
  updateUserWeightExerciseThunk,
} from "../../store/userOwnedExercisesFiltered";
import {
  updateCardioExerciseAllExercises,
  updateWeightExerciseAllExercises,
} from "../../store/userOwnedExercises";
import "./EditExercisePanel.css";

function EditExercisePanel({
  selectedExercise,
  exerciseTypeFromMyExercises,
  exerciseId,
  setIsPanelOpen,
}) {
  const [duration, setDuration] = useState(60);
  const dispatch = useDispatch();
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const weightExercisesObj = useSelector((state) => state.weightExercises);
  const usersExercisesObj = useSelector((state) => state.userExercisesFiltered);
  const usersExercises = Object.values(usersExercisesObj);
  const cardioExercises = Object.values(cardioExercisesObj);
  const weightExercises = Object.values(weightExercisesObj);
  const [intensity, setIntensity] = useState(selectedExercise.intensity);
  const [isFormModified, setIsFormModified] = useState(false);
  const exerciseType = exerciseTypeFromMyExercises;
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
  const [weightErrors, setWeightErrors] = useState({
    exercise: "",
  });

  const isEmpty = (str) => str === "";
  const hasErrors = (errors) =>
    Object.values(errors).some((error) => error.length > 0);

  const commonChecks = isEmpty(exerciseName);
  const cardioChecks =
    [duration, caloriesBurned].some(isEmpty) || hasErrors(cardioErrors);
  const weightChecks = [exerciseName].some(isEmpty) || hasErrors(weightErrors);

  const disabled =
    commonChecks || (exerciseType === "Cardio" ? cardioChecks : weightChecks);

  useEffect(() => {
    setExerciseName(selectedExercise.exerciseName.split("*")[0]);
    setCaloriesBurned(selectedExercise.caloriesPerMinute * duration);
    setIntensity(selectedExercise.intensity);
    setCardioErrors({
      exercise: "",
      duration: "",
      calories: "",
    });
    setWeightErrors({
      exercise: "",
    });
    setIsFormModified(false);
  }, [selectedExercise, duration]);

  const checkForExercise = (exerciseName) => {
    if (exerciseType === "Cardio") {
      const exerciseExists =
        cardioExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.toLowerCase() ===
              exerciseName.trim().toLowerCase()
        ) ||
        usersExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.split("*")[0].toLowerCase() ===
              exerciseName.trim().toLowerCase()
        );

      if (exerciseExists) {
        setCardioErrors({
          ...cardioErrors,
          exercise: "Exercise already exists",
        });
      }
    } else {
      const exerciseExists =
        weightExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.toLowerCase() ===
              exerciseName.trim().toLowerCase()
        ) ||
        usersExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.split("*")[0].toLowerCase() ===
              exerciseName.trim().toLowerCase()
        );

      if (exerciseExists) {
        setWeightErrors({
          ...weightErrors,
          exercise: "Exercise already exists",
        });
      }
    }
  };

  const checkDuration = (duration) => {
    if (duration <= 0) {
      setCardioErrors({ ...cardioErrors, duration: "Must be greater than 0" });
    }
  };

  const checkCaloriesBurned = (caloriesBurned) => {
    if (caloriesBurned <= 0) {
      setCardioErrors({
        ...cardioErrors,
        calories: "Must be greater than 0",
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (exerciseType === "Cardio") {
      const cardioExerciseForm = new FormData();
      cardioExerciseForm.append("exercise_name", exerciseName.trim());
      cardioExerciseForm.append("intensity", intensity);
      cardioExerciseForm.append("duration", duration);
      cardioExerciseForm.append("calories_burned", caloriesBurned);
      try {
        const exercise = await dispatch(
          updateUserCardioExerciseThunk(selectedExercise.id, cardioExerciseForm)
        );
        await dispatch(updateCardioExerciseAllExercises(exercise));
        setIsPanelOpen(false);
      } catch (e) {
        console.error(e);
      }
    } else {
      const weightExerciseForm = new FormData();
      weightExerciseForm.append("exercise_name", exerciseName.trim());
      try {
        const exercise = await dispatch(
          updateUserWeightExerciseThunk(selectedExercise.id, weightExerciseForm)
        );
        await dispatch(updateWeightExerciseAllExercises(exercise));
        setIsPanelOpen(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className={`side-panel`}>
      <div className="edit-exercise-panel-title-container">
        <span>Edit Exercise</span>
      </div>
      <form
        className="edit-exercise-form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <label className="edit-exercise-panel-label">
          Exercise Name:
          <input
            type="text"
            name="exerciseName"
            value={exerciseName}
            onBlur={() => checkForExercise(exerciseName)}
            onChange={(e) => {
              setExerciseName(e.target.value);
              setIsFormModified(true);
              setCardioErrors({ ...cardioErrors, exercise: "" });
              setWeightErrors({ ...weightErrors, exercise: "" });
            }}
          />
        </label>
        {cardioErrors.exercise || weightErrors.exercise ? (
          <div className="exercise-name-error">
            {cardioErrors.exercise || weightErrors.exercise}
          </div>
        ) : (
          <div className="exercise-name-error"></div>
        )}
        {exerciseType === "Cardio" ? (
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
                  checkDuration(duration);
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
                  checkCaloriesBurned(caloriesBurned);
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
        ) : (
          <>
            <div className="edit-exercise-panel-strength-text-container">
              <p>For Strength Exercises, only the name is required</p>
            </div>
            <div className="exercise-name-error"></div>
          </>
        )}
        <div className="edit-exercise-panel-submit-button-container">
          <button
            className="edit-exercise-panel-submit-button"
            disabled={disabled || !isFormModified}
            type="submit"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditExercisePanel;
