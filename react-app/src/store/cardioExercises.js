const ALL_CARDIO_EXERCISES = "exercises/ALL_CARDIO_EXERCISES";


const getAllCardioExercises = (cardioExercises) => ({
  type: ALL_CARDIO_EXERCISES,
  cardioExercises,
});


export const getAllCardioExercisesThunk = () => async (dispatch) => {
  const res = await fetch("/api/cardio-exercises");

  if (res.ok) {
    const exercises = await res.json();
    dispatch(getAllCardioExercises(exercises));
    return exercises;
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
    default:
      return state;
  }
};

export default cardioExerciseReducer;
