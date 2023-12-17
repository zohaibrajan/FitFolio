import React from "react";
import { useState } from "react";
import "./ExercisePage.css";

function ExercisePage() {
  const [exerciseName, setExerciseName] = useState("");
  const [addToDiary, setAddToDiary] = useState(false);
  const [exerciseType, setExerciseType] = useState("cardio");

  return (
    <div className="exercise-page-container">
      <div className="exercise-page-content">
        <div className="exercise-page-title">
          <span>Create a New Exercise</span>
        </div>
        <div className="create-exercise">
          <label>
            Exercise Name
            <input
              type="text"
              value={exerciseName}
              name="exercise-name"
              onChange={(e) => setExerciseName(e.target.value)}
            />
          </label>
          <label>
            Exercise Type
            <select
              name="exercise-type"
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
            </select>
          </label>
          <label>
            Add to Diary
            <input
              type="checkbox"
              checked={addToDiary}
              name="add-to-diary"
              onChange={(e) => setAddToDiary(e.target.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default ExercisePage;
