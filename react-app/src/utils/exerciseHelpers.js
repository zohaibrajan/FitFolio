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
  useCardioExercises,
  useWeightExercises,
  useUserExercises
};
