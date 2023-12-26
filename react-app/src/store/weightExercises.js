const ALL_WEIGHT_EXERCISES = "exercises/ALL_WEIGHT_EXERCISES";
const CREATE_WEIGHT_EXERCISE = "exercises/CREATE_WEIGHT_EXERCISE";


const getAllWeightExercises = (weightExercises) => ({
  type: ALL_WEIGHT_EXERCISES,
  weightExercises,
});

const createWeightExercise = (weightExercise) => ({
  type: CREATE_WEIGHT_EXERCISE,
  weightExercise,
});


export const getAllWeightExercisesThunk = () => async (dispatch) => {
  const res = await fetch("/api/weight-exercises");

  if (res.ok) {
    const exercises = await res.json();
    dispatch(getAllWeightExercises(exercises));
    return exercises;
  }
};

export const createWeightExerciseThunk = (exercise) => async (dispatch) => {
  const res = await fetch("/api/weight-exercises/new", {
    method: "POST",
    body: exercise,
  });

  if (res.ok) {
    const newExercise = await res.json();
    dispatch(createWeightExercise(newExercise));
    return newExercise;
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
        case CREATE_WEIGHT_EXERCISE:
            return { ...state, [action.weightExercise.weightExercise.id]: action.weightExercise.weightExercise }
        default:
            return state
    }
}

export default weightExerciseReducer
