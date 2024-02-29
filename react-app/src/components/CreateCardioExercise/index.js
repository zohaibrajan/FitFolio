import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { createCardioExerciseThunk } from "../../store/cardioExercises";
import { createCardioLogThunk } from "../../store/cardioLogs";
import { useSelectedDate } from "../../context/SelectedDate";

function CreateCardioExercise({ exerciseName }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const date = useSelectedDate();
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const usersExercisesObj = useSelector((state) => state.userExercisesFiltered);
  const usersExercises = Object.values(usersExercisesObj);
  const cardioExercises = Object.values(cardioExercisesObj);
  const [intensity, setIntensity] = useState("Low");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [duration, setDuration] = useState("");
  const [cardioErrors, setCardioErrors] = useState({
    exercise: "",
    duration: "",
    calories: "",
  });
  const isEmpty = (str) => str === "";
  const hasErrors = (errors) =>
    Object.values(errors).some((error) => error.length > 0);
  const commonChecks = isEmpty(exerciseName);
  const cardioChecks =
    [duration, caloriesBurned].some(isEmpty) || hasErrors(cardioErrors);

  useEffect(() => {
    dispatch(getAllCardioExercisesThunk());
  }, [dispatch]);

  const checkDuration = (duration) => {
    if (duration <= 0) {
      setCardioErrors({
        ...cardioErrors,
        duration: "Must be greater than 0",
      });
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

  const checkForExercise = (exerciseName) => {
    if (exerciseType === "cardio") {
      const exerciseExists =
        cardioExercises.some(
          (exercise) =>
            exercise.exerciseName.toLowerCase() ===
            exerciseName.trim().toLowerCase()
        ) ||
        usersExercises.some(
          (exercise) =>
            exercise.exerciseName.split("*")[0].toLowerCase() ===
            exerciseName.trim().toLowerCase()
        );

      if (exerciseExists) {
        setCardioErrors({
          ...cardioErrors,
          exercise: "Exercise already exists",
        });
      }
    }
  };
}

export default CreateCardioExercise;
