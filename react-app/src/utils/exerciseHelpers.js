import { useSelector } from "react-redux";

const checkDuration = (duration, cardioErrors, setCardioErrors) => {
  if (duration <= 0) {
    setCardioErrors({ ...cardioErrors, duration: "Must be greater than 0" });
  }
};

const checkCaloriesBurned = (caloriesBurned, cardioErrors, setCardioErrors) => {
  if (caloriesBurned <= 0) {
    setCardioErrors({
      ...cardioErrors,
      calories: "Must be greater than 0",
    });
  }
};

const checkSets = (sets, weightErrors, setWeightErrors) => {
  if (sets <= 0) {
    setWeightErrors({ ...weightErrors, sets: "Must be greater than 0" });
  }
};

const checkReps = (reps, weightErrors, setWeightErrors) => {
  if (reps <= 0) {
    setWeightErrors({ ...weightErrors, reps: "Must be greater than 0" });
  }
};

const checkWeightPerRep = (weightPerRep, weightErrors, setWeightErrors) => {
  if (weightPerRep <= 0) {
    setWeightErrors({
      ...weightErrors,
      weightPerRep: "Must be greater than 0",
    });
  }
};

const checkForExercise = (
  exerciseName,
  exerciseType,
  cardioExercises,
  weightExercises,
  usersExercises,
  setNameError
) => {
  const trimmedExerciseName = exerciseName.trim().toLowerCase();
  const exercises =
    exerciseType === "Cardio" ? cardioExercises : weightExercises;

  const doesExerciseExists = // check if exercise already exists // add comment here
    exercises.some(
      (exercise) => exercise.exerciseName.toLowerCase() === trimmedExerciseName
    ) ||
    usersExercises.some(
      (exercise) =>
        exercise.exerciseName.split("*")[0].toLowerCase() === // here
        trimmedExerciseName
    );

  if (doesExerciseExists) {
    // set error if exercise already exists
    setNameError("Exercise already exists");
  } else if (exerciseName.length >= 50) {
    setNameError("Must be less than 50 characters");
  } else if (exerciseName && exerciseName.length < 5) {
    setNameError("Must be greater than 5 characters");
  }
};

const useCardioExercises = () => {
  return useSelector((state) => Object.values(state.cardioExercises));
};

const useWeightExercises = () => {
  return useSelector((state) => Object.values(state.weightExercises));
};

const useUserExercises = () => {
  return useSelector((state) => Object.values(state.userExercisesFiltered));
};


export {
  checkDuration,
  checkCaloriesBurned,
  checkSets,
  checkReps,
  checkWeightPerRep,
  checkForExercise,
  useCardioExercises,
  useWeightExercises,
  useUserExercises
};
