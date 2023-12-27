import React, { useState, useEffect } from "react";
import "./EditExercisePanel.css";

function EditExercisePanel({ selectedExercise, exerciseTypeFromMyExercises }) {
  const [duration, setDuration] = useState(60);
  const [exerciseType, setExerciseType] = useState(exerciseTypeFromMyExercises);
  const [exerciseName, setExerciseName] = useState(
    selectedExercise.exerciseName
  );
  const [caloriesBurned, setCaloriesBurned] = useState(
    selectedExercise.caloriesPerMinute * duration
  );

  useEffect(() => {
    setExerciseName(selectedExercise.exerciseName);
    setCaloriesBurned(selectedExercise.caloriesPerMinute * duration);
  }, [selectedExercise, duration]);

  
  return (
    <div className={`side-panel`}>
      <h1>Edit Exercise</h1>
      <form className="edit-exercise-form" encType="multipart/form-data">
        <label>
          Exercise Name:
          <input
            type="text"
            name="exerciseName"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
          />
        </label>
        <label>
          Exercise Type:
          <select
            type="text"
            name="exerciseType"
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
          >
            <option value="Cardio">Cardio</option>
            <option value="Strength">Strength</option>
          </select>
        </label>
        {exerciseType === "Cardio" ? (
          <>
            <label>
              Duration (Minutes):
              <input
                type="number"
                value={duration}
                name="exerciseDuration"
                onChange={(e) => setDuration(e.target.value)}
              ></input>
            </label>
            <label>
              Calories Burned:
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
              ></input>
            </label>
          </>
        ) : (
          <>
            <p>For Strength Exercises, only the name is required</p>
          </>
        )}
      </form>
    </div>
  );
}

export default EditExercisePanel;
