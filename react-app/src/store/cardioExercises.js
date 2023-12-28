const ALL_CARDIO_EXERCISES = "exercises/ALL_CARDIO_EXERCISES";
const CREATE_CARDIO_EXERCISE = "exercises/CREATE_CARDIO_EXERCISE";



const getAllCardioExercises = (cardioExercises) => ({
  type: ALL_CARDIO_EXERCISES,
  cardioExercises,
});

const createCardioExercise = (cardioExercise) => ({
  type: CREATE_CARDIO_EXERCISE,
  cardioExercise,
});

export const getAllCardioExercisesThunk = () => async (dispatch) => {
  const res = await fetch("/api/cardio-exercises");

  if (res.ok) {
    const exercises = await res.json();
    dispatch(getAllCardioExercises(exercises));
    return exercises;
  }
};

export const createCardioExerciseThunk = (exercise) => async (dispatch) => {
  const res = await fetch("/api/cardio-exercises/new", {
    method: "POST",
    body: exercise
  });

  if (res.ok) {
    const newExercise = await res.json();
    dispatch(createCardioExercise(newExercise));
    return newExercise;
  }
};


const cardioExerciseReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_CARDIO_EXERCISES:
      const newState = {};
      action.cardioExercises.cardioExercises.forEach((exercise) => {
        newState[exercise.id] = exercise;
      });
      return newState;
    case CREATE_CARDIO_EXERCISE:
      return { ...state, [action.cardioExercise.cardioExercise.id]: action.cardioExercise.cardioExercise };
    default:
      return state;
  }
};

export default cardioExerciseReducer;
