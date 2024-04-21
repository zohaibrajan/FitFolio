import React, { useState } from "react";
import EditCardioExercise from "./EditCardioExercise";
import { FormInput } from "../FormElements";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import { useCheckForExercise } from "../../utils";
import "./EditExercisePanel.css";

function EditExercisePanel({ selectedExercise, isCardio, setIsPanelOpen }) {
  const [exerciseName, setExerciseName] = useState(
    selectedExercise.exerciseName.split("*")[0]
  );
  const [nameError, setNameError] = useState("");
  const checkExercise = useCheckForExercise(
    exerciseName,
    isCardio ? "Cardio" : "Strength",
    setNameError
  );

  return (
    <div className={`side-panel`}>
      <div className="edit-exercise-panel-title-container">
        <span>Edit Exercise</span>
        <i
          onClick={() => setIsPanelOpen(false)}
          className="fa-solid fa-xmark close-panel"
        ></i>
      </div>
      <div className="edit-exercise-form">
        <FormInput
          label={"Exercise Name"}
          type={"text"}
          value={exerciseName}
          name={"exercise-name"}
          onBlur={checkExercise}
          onChange={(e) => {
            setExerciseName(e.target.value);
            setNameError("");
          }}
        />
        <ErrorHandlingComponent error={nameError} />
        {isCardio ? (
          <EditCardioExercise exerciseData={selectedExercise} nameError={nameError} />
        ) : (
          <h1>Strength</h1>
        )}
      </div>
    </div>
  );
}

export default EditExercisePanel;
