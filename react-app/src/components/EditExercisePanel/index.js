import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserCardioExerciseThunk } from "../../store/userOwnedExercisesFiltered";
import { updateCardioExerciseAllExercises } from "../../store/userOwnedExercises";
import "./EditExercisePanel.css";

function EditExercisePanel({ selectedExercise, exerciseTypeFromMyExercises, exerciseId, setIsPanelOpen }) {
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
  const [exerciseType, setExerciseType] = useState(exerciseTypeFromMyExercises);
  const [exerciseName, setExerciseName] = useState(
    selectedExercise.exerciseName
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
    setExerciseName(selectedExercise.exerciseName);
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


  const checkForExercise = (exerciseName, exerciseId) => {
    if (exerciseType === "Cardio") {
      const exerciseExists =
        cardioExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.toLowerCase() === exerciseName.toLowerCase()
        ) ||
        usersExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.toLowerCase() === exerciseName.toLowerCase()
        );

      if (exerciseExists) {
        setCardioErrors({
          ...cardioErrors,
          exercise: "Exercise already exists",
        });
      }
    } else {
      weightExercises.forEach((exercise) => {
        if (
          exercise.id !== exerciseId &&
          exercise.exerciseName.toLowerCase() === exerciseName.toLowerCase()
        ) {
          setWeightErrors({
            ...weightErrors,
            exercise: "Exercise already exists",
          });
          return;
        }
      });
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
      cardioExerciseForm.append("exercise_name", exerciseName);
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
    }
  };

  return (
    <div className={`side-panel`}>
      <h1>Edit Exercise</h1>
      <form
        className="edit-exercise-form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <label>
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
        <label>
          Exercise Type:
          <select
            type="text"
            name="exerciseType"
            value={exerciseType}
            onBlur={() => checkForExercise(exerciseName, exerciseId)}
            onChange={(e) => {
              setExerciseType(e.target.value);
              setIsFormModified(true);
            }}
          >
            <option value="Cardio">Cardio</option>
            <option value="Strength">Strength</option>
          </select>
        </label>
        {exerciseType === "Cardio" ? (
          <>
            <label className="cardio-labels" style={{ marginBottom: "5px" }}>
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
            <label>
              Duration (Minutes):
              <input
                type="number"
                value={duration}
                onBlur={() => {
                  checkDuration(duration)
                  checkForExercise(exerciseName, exerciseId)
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
            <label>
              Calories Burned:
              <input
                type="number"
                value={caloriesBurned}
                onBlur={() => {
                  checkCaloriesBurned(caloriesBurned)
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
            <p>For Strength Exercises, only the name is required</p>
          </>
        )}
        <button disabled={disabled || !isFormModified} type="submit">
          Confirm
        </button>
      </form>
    </div>
  );
}

export default EditExercisePanel;
