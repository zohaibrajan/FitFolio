import React from "react";
import { useState } from "react";
import "./ExercisePage.css";

function ExercisePage() {
  const [exerciseName, setExerciseName] = useState("");
  const [intensity, setIntensity] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sets, setSets] = useState(0);
  const [exerciseType, setExerciseType] = useState("cardio");

  return (
    <div className="exercise-page-container">
      <div className="exercise-page-content">
        <div className="exercise-page-title">
          <span>Create a New Exercise</span>
        </div>
        <div className="create-exercise-container">
          <div className="create-exercise-form">
            <label>
              Exercise Name
              <input
                type="text"
                value={exerciseName}
                name="exercise-name"
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column" }}>
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
                <label className="cardio-labels">
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
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </label>
                <label className="cardio-labels">
                  Calories Burned
                  <input
                    className="cardio-input"
                    type="number"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                  />
                </label>
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
                className="create-exercise-button"
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
