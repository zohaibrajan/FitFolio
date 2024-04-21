import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllCardioExercisesThunk } from "../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../store/weightExercises";
import {
  useCardioExercises,
  useWeightExercises,
  useUserExercises,
} from "./exerciseHelpers";

export const useCheckForExercise = (exerciseName, exerciseType, setError) => {
  const dispatch = useDispatch();
  const cardioExercises = useCardioExercises();
  const weightExercises = useWeightExercises();
  const usersExercises = useUserExercises();
  const isCardio = exerciseType === "Cardio";

  const checkExercise = useCallback(() => {
    const thunkAction = isCardio
      ? getAllCardioExercisesThunk
      : getAllWeightExercisesThunk;
    dispatch(thunkAction());

    const trimmedExerciseName = exerciseName.trim().toLowerCase();
    const exercises =
      exerciseType === "Cardio" ? cardioExercises : weightExercises;

    const doesExerciseExists =
      exercises.some(
        (exercise) =>
          exercise.exerciseName.toLowerCase() === trimmedExerciseName
      ) ||
      usersExercises.some(
        (exercise) =>
          exercise.exerciseName.split("*")[0].toLowerCase() ===
          trimmedExerciseName
      );

    if (doesExerciseExists) {
      // set error if exercise already exists
      setError("Exercise already exists");
    } else if (exerciseName.length >= 50) {
      setError("Must be less than 50 characters");
    } else if (exerciseName && exerciseName.length < 5) {
      setError("Must be greater than 5 characters");
    } else if (exerciseName.length <= 0) {
      setError("Must not be empty");

    }
  }, [exerciseName, exerciseType, cardioExercises, weightExercises, usersExercises, setError, dispatch]);

  return checkExercise;
};
