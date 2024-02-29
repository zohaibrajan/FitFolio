import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import { createCardioExerciseThunk } from "../../store/cardioExercises";
import { createWeightExerciseThunk } from "../../store/weightExercises";
import { createWeightLogThunk } from "../../store/weightLogs";
import { createCardioLogThunk } from "../../store/cardioLogs";
import MyExercises from "../MyExercises";
import "./ExercisePage.css";
import { useSelectedDate } from "../../context/SelectedDate";
import { formattingUserInputDate } from "../../utils";

function ExercisePage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const date = useSelectedDate();
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const weightExercisesObj = useSelector((state) => state.weightExercises);
  const usersExercisesObj = useSelector((state) => state.userExercisesFiltered);
  const usersExercises = Object.values(usersExercisesObj);
  const cardioExercises = Object.values(cardioExercisesObj);
  const weightExercises = Object.values(weightExercisesObj);
  const [exerciseName, setExerciseName] = useState("");
  const [intensity, setIntensity] = useState("Low");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [duration, setDuration] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weightPerRep, setWeightPerRep] = useState("");
  const [exerciseType, setExerciseType] = useState("cardio");
  const [cardioErrors, setCardioErrors] = useState({
    exercise: "",
    duration: "",
    calories: "",
  });
  const [weightErrors, setWeightErrors] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weightPerRep: "",
  });

  const isEmpty = (str) => str === "";
  const hasErrors = (errors) =>
    Object.values(errors).some((error) => error.length > 0);

  const commonChecks = isEmpty(exerciseName);
  const cardioChecks =
    [duration, caloriesBurned].some(isEmpty) || hasErrors(cardioErrors);
  const weightChecks =
    [sets, reps, weightPerRep].some(isEmpty) || hasErrors(weightErrors);

  const disabled =
    commonChecks || (exerciseType === "cardio" ? cardioChecks : weightChecks);

  const buttonStyle = disabled
    ? "create-exercise-button-disabled"
    : "create-exercise-button";

  useEffect(() => {
    if (exerciseType === "cardio") {
      dispatch(getAllCardioExercisesThunk());
    } else {
      dispatch(getAllWeightExercisesThunk());
    }
  }, [dispatch, exerciseType]);

  const checkForExercise = (exerciseName) => {
    if (exerciseType === "cardio") {
      const exerciseExists =
        cardioExercises.some(
          (exercise) =>
            exercise.exerciseName.toLowerCase() ===
            exerciseName.trim().toLowerCase()
        ) ||
        usersExercises.some(
          (exercise) =>
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
            exercise.exerciseName.toLowerCase() ===
            exerciseName.trim().toLowerCase()
        ) ||
        usersExercises.some(
          (exercise) =>
            exercise.exerciseName.split("*")[0].toLowerCase() ===
            exerciseName.trim().toLowerCase()
        );

      if (exerciseExists) {
        setCardioErrors({
          ...cardioErrors,
          exercise: "Exercise already exists",
        });
      }
    }

    if (exerciseName.length > 50) {
      setCardioErrors({
        ...cardioErrors,
        exercise: "Must be less than 50 characters",
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

  const checkSets = (sets) => {
    if (sets <= 0) {
      setWeightErrors({ ...weightErrors, sets: "Must be greater than 0" });
    }
  };

  const checkReps = (reps) => {
    if (reps <= 0) {
      setWeightErrors({ ...weightErrors, reps: "Must be greater than 0" });
    }
  };

  const checkWeightPerRep = (weightPerRep) => {
    if (weightPerRep <= 0) {
      setWeightErrors({
        ...weightErrors,
        weightPerRep: "Must be greater than 0",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (exerciseType === "cardio") {
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
        // const cardioErrors = await e.json();
        console.error(e);
      }
    } else {
      const strengthExerciseForm = new FormData();
      const strengthLog = new FormData();
      strengthLog.append("sets", sets);
      strengthLog.append("repetitions", reps);
      strengthLog.append("weight_per_rep", weightPerRep);
      strengthLog.append("date", formattingUserInputDate(date.selectedDate));
      strengthLog.append("exercise_name", exerciseName);
      strengthExerciseForm.append("exercise_name", exerciseName);

      try {
        await dispatch(createWeightExerciseThunk(strengthExerciseForm));
        await dispatch(createWeightLogThunk(strengthLog));
        history.replace("/my-home/diary");
      } catch (e) {
        // const strengthErrors = await e.json();
        console.error(e);
      }
    }
  };

  return (
    <div className="exercise-page-container">
      <div className="exercise-page-content">
        <div className="exercise-page-title">
          <span>Create a New Exercise</span>
        </div>
        <div className="create-exercise-container">
          <form
            className="create-exercise-form"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                fontWeight: "bold",
                width1: "100%",
              }}
            >
              Exercise Name
              <input
                className="exercise-inputs"
                type="text"
                value={exerciseName}
                placeholder="Exercise Name eg. Running"
                name="exercise-name"
                onBlur={() => checkForExercise(exerciseName)}
                onChange={(e) => {
                  setExerciseName(e.target.value);
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
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                marginBottom: "7px",
                fontWeight: "bold",
              }}
            >
              Exercise Type
              <select
                style={{ width: "65%" }}
                name="exercise-type"
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
              >
                <option value="cardio">Cardio</option>
                <option value="strength">Strength</option>
              </select>
            </label>
            {exerciseType === "cardio" ? (
              <>
                <label
                  className="exercise-labels"
                  style={{ marginBottom: "5px" }}
                >
                  Intensity?
                  <select
                    className="exercise-inputs"
                    name="intensity"
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
                <span style={{ height: "5px" }}></span>
                <label className="exercise-labels">
                  How Long? (Minutes)
                  <input
                    className="exercise-inputs"
                    type="number"
                    value={duration}
                    placeholder="Duration eg. 30"
                    min={0}
                    onBlur={() => checkDuration(duration)}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setCardioErrors({ ...cardioErrors, duration: "" });
                    }}
                  />
                </label>
                {cardioErrors.duration ? (
                  <div className="exercise-name-error">
                    {cardioErrors.duration}
                  </div>
                ) : (
                  <div className="exercise-name-error"></div>
                )}
                <label className="exercise-labels">
                  Calories Burned
                  <input
                    className="exercise-inputs"
                    type="number"
                    min={0}
                    placeholder="Calories Burned eg. 300"
                    value={caloriesBurned}
                    onBlur={() => checkCaloriesBurned(caloriesBurned)}
                    onChange={(e) => {
                      setCaloriesBurned(e.target.value);
                      setCardioErrors({ ...cardioErrors, calories: "" });
                    }}
                  />
                </label>
                {cardioErrors.calories ? (
                  <div className="exercise-name-error">
                    {cardioErrors.calories}
                  </div>
                ) : (
                  <div className="exercise-name-error"></div>
                )}
              </>
            ) : (
              <>
                <label className="exercise-labels">
                  Sets
                  <input
                    className="exercise-inputs"
                    type="number"
                    value={sets}
                    placeholder="Sets eg. 3"
                    onBlur={() => checkSets(sets)}
                    onChange={(e) => {
                      setSets(e.target.value);
                      setWeightErrors({ ...weightErrors, sets: "" });
                    }}
                  />
                </label>
                {weightErrors.sets ? (
                  <div className="exercise-name-error">{weightErrors.sets}</div>
                ) : (
                  <div className="exercise-name-error"></div>
                )}
                <label className="exercise-labels">
                  Repetitions:
                  <input
                    className="exercise-inputs"
                    type="number"
                    value={reps}
                    placeholder="Repetitions eg. 10"
                    onBlur={() => checkReps(reps)}
                    onChange={(e) => {
                      setReps(e.target.value);
                      setWeightErrors({ ...weightErrors, reps: "" });
                    }}
                  />
                </label>
                {weightErrors.reps ? (
                  <div className="exercise-name-error">{weightErrors.reps}</div>
                ) : (
                  <div className="exercise-name-error"></div>
                )}
                <label className="exercise-labels">
                  Weight Per Repetition:
                  <input
                    className="exercise-inputs"
                    type="number"
                    placeholder="Weight Per Rep eg. 50"
                    value={weightPerRep}
                    onBlur={() => checkWeightPerRep(weightPerRep)}
                    onChange={(e) => {
                      setWeightPerRep(e.target.value);
                      setWeightErrors({ ...weightErrors, weightPerRep: "" });
                    }}
                  />
                </label>
                {weightErrors.weightPerRep ? (
                  <div className="exercise-name-error">
                    {weightErrors.weightPerRep}
                  </div>
                ) : (
                  <div className="exercise-name-error"></div>
                )}
              </>
            )}
            <div className="create-exercise-button-container">
              <button type="submit" className={buttonStyle} disabled={disabled}>
                Add Exercise
              </button>
            </div>
          </form>
          <div className="create-exercise-text">
            <h3>Creating a New Exercise</h3>
            <p>
              If you can't find an exercise in our database, you can easily add
              it yourself.
            </p>
            <p>
              When it comes to cardio workouts and uncertain calorie counts,
              rather than creating a new exercise, it's advisable to select a
              similar existing exercise from our database. This approach will
              give you a ballpark figure of the calories burned.
            </p>
            <p>
              After successfully adding an exercise, you can conveniently search
              for it and incorporate it into your exercise log whenever needed.
            </p>
          </div>
        </div>
      </div>
      <MyExercises exerciseType={exerciseType} />
    </div>
  );
}

export default ExercisePage;
