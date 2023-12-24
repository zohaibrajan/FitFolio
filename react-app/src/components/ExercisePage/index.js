import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import { createCardioExerciseThunk } from "../../store/cardioExercises";
import { createCardioLogThunk } from "../../store/cardioLogs";
import "./ExercisePage.css";
import { gettingTodaysDate } from "../../utils";

function ExercisePage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const weightExercisesObj = useSelector((state) => state.weightExercises);
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
    dispatch(getAllCardioExercisesThunk());
    dispatch(getAllWeightExercisesThunk());
  }, [dispatch]);

  const checkForExercise = (exerciseName) => {
    if (exerciseType === "cardio") {
      cardioExercises.forEach((exercise) => {
        if (
          exercise.exerciseName.toLowerCase() === exerciseName.toLowerCase()
        ) {
          setCardioErrors({
            ...cardioErrors,
            exercise: "Exercise already exists",
          });
          return;
        }
      });
    } else {
      weightExercises.forEach((exercise) => {
        if (
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
      cardioLog.append("date", gettingTodaysDate());
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
      // dispatch(createWeightExerciseThunk({
      //   exerciseName,
      //   sets,
      // }));
    }
  };

  return (
    <div className="exercise-page-container">
      <div className="exercise-page-content">
        <div className="exercise-page-title">
          <span>Create a New Exercise</span>
        </div>
        <div className="create-exercise-container">
          <form className="create-exercise-form" onSubmit={handleSubmit}>
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
                type="text"
                value={exerciseName}
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
                  className="cardio-labels"
                  style={{ marginBottom: "5px" }}
                >
                  Intensity?
                  <select
                    className="cardio-input"
                    name="intensity"
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>
                <div className="exercise-name-error"></div>
                <label className="cardio-labels">
                  How Long? (Minutes)
                  <input
                    className="cardio-input"
                    type="number"
                    value={duration}
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
                <label className="cardio-labels">
                  Calories Burned
                  <input
                    className="cardio-input"
                    type="number"
                    min={0}
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
                <label className="cardio-labels">
                  Sets
                  <input
                    className="cardio-input"
                    type="number"
                    value={sets}
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
                <label className="cardio-labels">
                  Repetitions:
                  <input
                    className="cardio-input"
                    type="number"
                    value={reps}
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
                <label className="cardio-labels">
                  Weight Per Repetition:
                  <input
                    className="cardio-input"
                    type="number"
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
    </div>
  );
}

export default ExercisePage;
