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

  const checkForExercise = (exerciseName, exerciseType, cardioExercises, weightExercises, usersExercises, setNameError) => {
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

    if (exerciseExists) {
      // set error if exercise already exists
      setNameError("Exercise already exists");
    } else if (exerciseName.length > 50) {
      setNameError("Must be less than 50 characters");
    }
  };


export {
    checkDuration,
    checkCaloriesBurned,
    checkSets,
    checkReps,
    checkWeightPerRep,
    checkForExercise
    };
