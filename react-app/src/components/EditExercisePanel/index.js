import React, { useState, useEffect } from "react";
import EditCardioExercise from "./EditCardioExercise";
import { FormInput } from "../FormElements";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import { useDispatch } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import {
  checkForExercise,
  useCardioExercises,
  useWeightExercises,
  useUserExercises,
} from "../../utils";
import "./EditExercisePanel.css";

function EditExercisePanel({ selectedExercise, isCardio, setIsPanelOpen }) {
  const [exerciseName, setExerciseName] = useState(
    selectedExercise.exerciseName.split("*")[0]
  );
  const [nameError, setNameError] = useState("");
  const dispatch = useDispatch();
  const usersExercises = useUserExercises();
  const cardioExercises = useCardioExercises();
  const weightExercises = useWeightExercises();

  console.log(usersExercises);

  useEffect(() => {
    // useEffect to get exercises based on exerciseType
    const thunkAction = isCardio
      ? getAllCardioExercisesThunk
      : getAllWeightExercisesThunk;
    dispatch(thunkAction());
    checkForExercise(
      exerciseName,
      isCardio ? "Cardio" : "Strength",
      cardioExercises,
      weightExercises,
      usersExercises,
      setNameError
    ); // checks for exercise when exerciseType changes
    // eslint-disable-next-line
  }, [dispatch, isCardio]);
  return (
    <div className={`side-panel`}>
      <div className="edit-exercise-panel-title-container">
        <span>Edit Exercise</span>
        <i
          onClick={() => setIsPanelOpen(false)}
          className="fa-solid fa-xmark close-panel"
        ></i>
      </div>
      <div>
        <FormInput
          label={"Exercise Name"}
          type={"text"}
          value={exerciseName}
          name={"exercise-name"}
          onChange={(e) => {
            setExerciseName(e.target.value);
            setNameError("");
          }}
        />
        <ErrorHandlingComponent error={false} />
        {isCardio ? (
          <EditCardioExercise exerciseData={selectedExercise} />
        ) : (
          <h1>Strength</h1>
        )}
      </div>
    </div>
  );
}

export default EditExercisePanel;
