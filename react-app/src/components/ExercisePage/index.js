import React from "react";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import StrengthExerciseForm from "./StrengthPage";
import CardioForm from "./CardioPage";
import { FormInput, FormSelect } from "../FormElements";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import MyExercises from "../MyExercises";
import "./ExercisePage.css";

function ExercisePage() {
  const dispatch = useDispatch();
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const weightExercisesObj = useSelector((state) => state.weightExercises);
  const usersExercisesObj = useSelector((state) => state.userExercisesFiltered);
  const usersExercises = Object.values(usersExercisesObj);
  const cardioExercises = Object.values(cardioExercisesObj);
  const weightExercises = Object.values(weightExercisesObj);
  const [exerciseName, setExerciseName] = useState("");
  const [nameError, setNameError] = useState("");
  const [exerciseType, setExerciseType] = useState("cardio");

  useEffect(() => { // useEffect to get exercises based on exerciseType
    const thunkAction =
      exerciseType === "cardio"
        ? getAllCardioExercisesThunk
        : getAllWeightExercisesThunk;
    dispatch(thunkAction());
  }, [dispatch, exerciseType]);

  const checkForExercise = (exerciseName) => {
    const trimmedExerciseName = exerciseName.trim().toLowerCase(); // trim and lowercase exercise name
    const exercises =
      exerciseType === "cardio" ? cardioExercises : weightExercises; // get exercises based on exerciseType

    const exerciseExists = // check if exercise already exists
      exercises.some(
        (exercise) =>
          exercise.exerciseName.toLowerCase() === trimmedExerciseName
      ) ||
      usersExercises.some(
        (exercise) =>
          exercise.exerciseName.split("*")[0].toLowerCase() ===
          trimmedExerciseName
      );

    if (exerciseExists) { // set error if exercise already exists
      setNameError("Exercise already exists");
    } else if (exerciseName.length > 50) {
      setNameError("Must be less than 50 characters");
    }
  };

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
              onBlur={() => checkForExercise(exerciseName)}
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
                { label: "Cardio", value: "cardio" },
                { label: "Strength", value: "strength" },
              ]}
            />
            <ErrorHandlingComponent error={false} />
            {exerciseType === "cardio" ? (
              <CardioForm exerciseName={exerciseName} />
            ) : (
              <StrengthExerciseForm exerciseName={exerciseName} />
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
      <MyExercises exerciseType={exerciseType} />
    </div>
  );
}

export default ExercisePage;
