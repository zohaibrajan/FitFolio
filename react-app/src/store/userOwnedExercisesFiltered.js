const GET_USERS_CARDIO_EXERCISES_FILTERED =
  "userOwnedExercisesFiltered/GET_USERS_CARDIO_EXERCISES_FILTERED";
const UPDATE_CARDIO_EXERCISE =
  "userOwnedExercisesFiltered/UPDATE_CARDIO_EXERCISE";
const DELETE_CARDIO_EXERCISE =
  "userOwnedExercisesFiltered/DELETE_CARDIO_EXERCISE";
const GET_USERS_WEIGHT_EXERCISES_FILTERED =
  "userOwnedExercisesFiltered/GET_USERS_WEIGHT_EXERCISES_FILTERED";
const UPDATE_WEIGHT_EXERCISE =
  "userOwnedExercisesFiltered/UPDATE_WEIGHT_EXERCISE";
const DELETE_WEIGHT_EXERCISE =
  "userOwnedExercisesFiltered/DELETE_WEIGHT_EXERCISE";

const getUsersWeightExercisesFiltered = (weightExercises) => ({
  type: GET_USERS_WEIGHT_EXERCISES_FILTERED,
  weightExercises,
});

const updateCardioExercise = (exercise) => ({
  type: UPDATE_CARDIO_EXERCISE,
  exercise,
});

const updateWeightExercise = (exercise) => ({
  type: UPDATE_WEIGHT_EXERCISE,
  exercise,
});

const deleteCardioExercise = (exercise) => ({
  type: DELETE_CARDIO_EXERCISE,
  exercise,
});

const deleteWeightExercise = (exercise) => ({
  type: DELETE_WEIGHT_EXERCISE,
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
};

export const getUsersWeightExercisesFilteredThunk = () => async (dispatch) => {
  const res = await fetch(`/api/users-weight-exercises/filtered`);

  if (res.ok) {
    const exercises = await res.json();
    dispatch(getUsersWeightExercisesFiltered(exercises));
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

export const updateUserWeightExerciseThunk = (exerciseId, formData) => async (dispatch) => {
  const res = await fetch(`/api/users-weight-exercises/${exerciseId}`, {
    method: "PUT",
    body: formData,
  });

  if (res.ok) {
    const exercise = await res.json();
    dispatch(updateWeightExercise(exercise));
    return exercise;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteUserCardioExerciseThunk =
  (exerciseId) => async (dispatch) => {
    const res = await fetch(`/api/users-cardio-exercises/${exerciseId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      const exercise = await res.json();
      dispatch(deleteCardioExercise(exercise));
      return exercise;
    }
  };

export const deleteUserWeightExerciseThunk = (exerciseId) => async (dispatch) => {
  const res = await fetch(`/api/users-weight-exercises/${exerciseId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const exercise = await res.json();
    dispatch(deleteWeightExercise(exercise));
    return exercise;
  }
};

const usersExercisesFilteredReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USERS_CARDIO_EXERCISES_FILTERED:
      const newState = {};
      action.cardioExercises.userCardioExercises.forEach((exercise) => {
        newState[exercise.id] = exercise;
      });
      return newState;
    case GET_USERS_WEIGHT_EXERCISES_FILTERED:
      const newState3 = {};
      action.weightExercises.userWeightExercises.forEach((exercise) => {
        newState3[exercise.id] = exercise;
      });
      return newState3;
    case UPDATE_CARDIO_EXERCISE:
      return {
        ...state,
        [action.exercise.userCardioExercise.id]:
          action.exercise.userCardioExercise,
      };
    case UPDATE_WEIGHT_EXERCISE:
      return {
        ...state,
        [action.exercise.userWeightExercise.id]:
          action.exercise.userWeightExercise,
      };
    case DELETE_CARDIO_EXERCISE:
      const newState2 = { ...state };
      delete newState2[action.exercise.userCardioExercise.id];
      return newState2;
    case DELETE_WEIGHT_EXERCISE:
      const newState4 = { ...state };
      delete newState4[action.exercise.userWeightExercise.id];
      return newState4;
    default:
      return state;
  }
};

export default usersExercisesFilteredReducer;
