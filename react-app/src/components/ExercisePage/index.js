import React from "react";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import StrengthExerciseForm from "./StrengthPage";
import CardioForm from "./CardioPage";
import MyExercises from "../MyExercises";
import { FormInput, FormSelect } from "../FormElements";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import { checkForExercise } from "../../utils";
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
  const [exerciseType, setExerciseType] = useState("Cardio");

  useEffect(() => { // useEffect to get exercises based on exerciseType
    const thunkAction =
      exerciseType === "cardio"
        ? getAllCardioExercisesThunk
        : getAllWeightExercisesThunk;
    dispatch(thunkAction());
    checkForExercise(
      exerciseName,
      exerciseType,
      cardioExercises,
      weightExercises,
      usersExercises,
      setNameError
    ); // checks for exercise when exerciseType changes
    // eslint-disable-next-line
  }, [dispatch, exerciseType]);

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
              onBlur={(e) => checkForExercise(e.target.value, exerciseType, cardioExercises, weightExercises, usersExercises, setNameError)}
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
            {exerciseType === "Cardio" ? (
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
      <MyExercises type={exerciseType} />
    </div>
  );
}

export default ExercisePage;
