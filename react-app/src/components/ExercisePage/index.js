import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import "./ExercisePage.css";

function ExercisePage() {
  const dispatch = useDispatch();
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const weightExercisesObj = useSelector((state) => state.weightExercises);
  const cardioExercises = Object.values(cardioExercisesObj);
  const weightExercises = Object.values(weightExercisesObj);
  const [exerciseName, setExerciseName] = useState("");
  const [intensity, setIntensity] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sets, setSets] = useState(0);
  const [exerciseType, setExerciseType] = useState("cardio");
  const [errors, setErrors] = useState({});
  const disabled = exerciseName === "" || Object.values(errors).length > 0;
  console.log(disabled)
  const buttonStyle = disabled ? "create-exercise-button-disabled" : "create-exercise-button";

  useEffect(() => {
    dispatch(getAllCardioExercisesThunk());
    dispatch(getAllWeightExercisesThunk());
  }, [dispatch]);

  const checkForExercise = (exerciseName) => {
    if (exerciseType === "cardio") {
      cardioExercises.forEach((exercise) => {
        if ((exercise.exerciseName).toLowerCase() === (exerciseName).toLowerCase()) {
          setErrors({ exerciseName: "Exercise already exists" });
          return
        }
      });
    } else {
      for (let exercise in weightExercises) {
        if (weightExercises[exercise].name === exerciseName) {
          setErrors({ exerciseName: "Exercise already exists" });
          return
        }
      }
    }
  }

  const checkDuration = (duration) => {
    if (duration <= 0) {
      setErrors({ duration: "Duration must be greater than 0" });
    }
  }

  const checkCaloriesBurned = (caloriesBurned) => {
    if (caloriesBurned <= 0) {
      setErrors({ caloriesBurned: "Calories burned must be greater than 0" });
    }
  }

  return (
    <div className="exercise-page-container">
      <div className="exercise-page-content">
        <div className="exercise-page-title">
          <span>Create a New Exercise</span>
        </div>
        <div className="create-exercise-container">
          <div className="create-exercise-form">
            <label
              style={{ display: "flex", flexDirection: "column", gap: "3px" }}
            >
              Exercise Name
              <input
                type="text"
                value={exerciseName}
                name="exercise-name"
                onBlur={() => checkForExercise(exerciseName)}
                onChange={(e) => {
                  setExerciseName(e.target.value);
                  setErrors({ exerciseName: "" });
                }}
              />
            </label>
            {errors.exerciseName ? (
              <div className="exercise-name-error">{errors.exerciseName}</div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3px",
                marginBottom: "7px",
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
                <label className="cardio-labels" style={{ marginBottom: "5px"}}>
                  Intensity?
                  <select
                    className="cardio-input"
                    name="intensity"
                    value={intensity}
                    onChange={(e) => setIntensity(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
                <label className="cardio-labels">
                  How Long?
                  <input
                    className="cardio-input"
                    type="number"
                    value={duration}
                    min={0}
                    onBlur={() => checkDuration(duration)}
                    onChange={(e) => {
                      setDuration(e.target.value);
                      setErrors({ duration: "" });
                    }}
                  />
                </label>
                {errors.duration ? (
                  <div className="exercise-name-error">{errors.duration}</div>
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
                      setErrors({ caloriesBurned: "" });
                    }}
                  />
                </label>
                {errors.caloriesBurned ? (
                  <div className="exercise-name-error">{errors.caloriesBurned}</div>
                ) : (
                  <div className="exercise-name-error"></div>
                )}
              </>
            ) : (
              <label>
                Sets?
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
              </label>
            )}
            <div className="create-exercise-button-container">
              <button
                className={buttonStyle}
                disabled={disabled}
                onClick={() => {
                  console.log({
                    exerciseName,
                    exerciseType,
                    intensity,
                    duration,
                    caloriesBurned,
                    sets,
                  });
                }}
              >
                Add Exercise
              </button>
            </div>
          </div>
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
