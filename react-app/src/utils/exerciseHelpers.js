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

  const checkCardioExercise = (exerciseId, cardioExercises, usersExercises, exerciseName, cardioErrors, setCardioErrors) => {
    const exerciseExists =
      cardioExercises.some(
        (exercise) =>
          exercise.id !== exerciseId &&
          exercise.exerciseName.toLowerCase() ===
            exerciseName.trim().toLowerCase()
      ) ||
      usersExercises.some(
        (exercise) =>
          exercise.id !== exerciseId &&
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

  const checkWeightExercise = (exerciseId, weightExercises, usersExercises, exerciseName, weightErrors, setWeightErrors) => {
    const exerciseExists =
        weightExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.toLowerCase() ===
              exerciseName.trim().toLowerCase()
        ) ||
        usersExercises.some(
          (exercise) =>
            exercise.id !== exerciseId &&
            exercise.exerciseName.split("*")[0].toLowerCase() ===
              exerciseName.trim().toLowerCase()
        );

      if (exerciseExists) {
        setWeightErrors({
          ...weightErrors,
          exercise: "Exercise already exists",
        });
      }
    }


export {
    checkDuration,
    checkCaloriesBurned,
    checkSets,
    checkReps,
    checkWeightPerRep,
    };
