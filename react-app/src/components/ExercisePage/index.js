import React, { useState } from "react";
import ErrorHandlingComponent from "../ErrorHandlingComponent"; // absolute import
import StrengthExerciseForm from "./StrengthPage";
import CardioForm from "./CardioPage";
import MyExercises from "../MyExercises";
import { FormInput, FormSelect } from "../FormElements";
import { useCheckForExercise } from "../../utils";
import "./ExercisePage.css";

function ExercisePage() {
  const [exerciseName, setExerciseName] = useState("");
  const [nameError, setNameError] = useState("");
  const [exerciseType, setExerciseType] = useState("Cardio");
  const isCardio = exerciseType === "Cardio";
  const checkExercise = useCheckForExercise(
    exerciseName,
    exerciseType,
    setNameError
  );

  return (
    <div className="exercise-page-container">
      <div className="exercise-page-content">
        <div className="exercise-page-title">
          <span>Create a New Exercise</span>
        </div>
        <div className="create-exercise-container">
          <div className="create-exercise-form">
            <FormInput
              label={"Exercise Name"}
              type={"text"}
              value={exerciseName}
              placeholder={"Exercise Name eg. Running"}
              name={"exercise-name"}
              onBlur={checkExercise}
              onChange={(e) => {
                setExerciseName(e.target.value);
                setNameError("");
              }}
            />
            <ErrorHandlingComponent error={nameError} />
            <FormSelect
              label={"Exercise Type"}
              name={"exercise-type"}
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              options={[
                { label: "Cardio", value: "Cardio" },
                { label: "Strength", value: "Strength" },
              ]}
            />
            <ErrorHandlingComponent error={false} />
            {isCardio ? (
              <CardioForm exerciseName={exerciseName} nameError={nameError}/> // creates a cardio exercise and log
            ) : (
              <StrengthExerciseForm exerciseName={exerciseName} nameError={nameError}/> // creates a strength exercise and log
            )}
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
      <MyExercises type={exerciseType} /> {/* displays user's exercises based on exerciseType */}
    </div>
  );
}

export default ExercisePage;
