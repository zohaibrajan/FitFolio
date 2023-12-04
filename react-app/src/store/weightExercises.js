const ALL_WEIGHT_EXERCISES = "exercises/ALL_WEIGHT_EXERCISES";

const getAllWeightExercises = (weightExercises) => ({
  type: ALL_WEIGHT_EXERCISES,
  weightExercises,
});

export const getAllWeightExercisesThunk = () => async (dispatch) => {
  const res = await fetch("/api/weight-exercises");

  if (res.ok) {
    const exercises = await res.json();
    dispatch(getAllWeightExercises(exercises));
    return exercises;
  }
};

const weightExerciseReducer = (state = {}, action) => {
    switch (action.type) {
        case ALL_WEIGHT_EXERCISES:
            const weightExercises = {};
            action.weightExercises.weightExercises.forEach((exercise) => {
                weightExercises[exercise.id] = exercise
            })
            return weightExercises;
        default:
            return state
    }
}

export default weightExerciseReducer
