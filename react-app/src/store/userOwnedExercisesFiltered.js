const GET_USERS_CARDIO_EXERCISES_FILTERED = 'userOwnedExercisesFiltered/GET_USERS_CARDIO_EXERCISES_FILTERED';
const UPDATE_CARDIO_EXERCISE = 'userOwnedExercisesFiltered/UPDATE_CARDIO_EXERCISE';

const updateCardioExercise = (exercise) => ({
  type: UPDATE_CARDIO_EXERCISE,
  exercise,
});

const getUsersCardioExercisesFiltered = (cardioExercises) => ({
    type: GET_USERS_CARDIO_EXERCISES_FILTERED,
    cardioExercises,
});

export const getUsersCardioExercisesFilteredThunk = () => async (dispatch) => {
    const res = await fetch(`/api/users-cardio-exercises/filtered`);

    if (res.ok) {
        const exercises = await res.json();
        dispatch(getUsersCardioExercisesFiltered(exercises));
        return exercises;
    }
}

export const updateUserCardioExerciseThunk =
  (exerciseId, formData) => async (dispatch) => {
    const res = await fetch(`/api/users-cardio-exercises/${exerciseId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const exercise = await res.json();
      dispatch(updateCardioExercise(exercise));
      return exercise;
    } else {
      const errors = await res.json();
      return errors;
    }
  };

const usersExercisesFilteredReducer = (state = {}, action) => {
    switch (action.type) {
      case GET_USERS_CARDIO_EXERCISES_FILTERED:
        const newState = {};
        action.cardioExercises.cardioExercises.forEach((exercise) => {
          newState[exercise.id] = exercise;
        });
        return newState;
      case UPDATE_CARDIO_EXERCISE:
        return {
          ...state,
          [action.exercise.userCardioExercise.id]:
            action.exercise.userCardioExercise,
        };
      default:
        return state;
    }
};

export default usersExercisesFilteredReducer
