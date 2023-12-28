const GET_USERS_WEIGHT_EXERCISES = 'userOwnedExercises/GET_USERS_WEIGHT_EXERCISES';
const GET_USERS_CARDIO_EXERCISES = 'userOwnedExercises/GET_USERS_CARDIO_EXERCISES';
const CLEAR_USER_EXERCISES = 'userOwnedExercises/CLEAR_USER_EXERCISES';
const UPDATE_CARDIO_EXERCISE = 'userOwnedExercises/UPDATE_CARDIO_EXERCISE';

const updateCardioExercise = (exercise) => ({
    type: UPDATE_CARDIO_EXERCISE,
    exercise,
});


const getUsersCardioExercises = (cardioExercises) => ({
    type: GET_USERS_CARDIO_EXERCISES,
    cardioExercises,
});

const getUsersWeightExercises = (weightExercises) => ({
    type: GET_USERS_WEIGHT_EXERCISES,
    weightExercises,
});

export const clearUserExercises = () => ({
    type: CLEAR_USER_EXERCISES,
});

export const getUsersWeightExercisesThunk = () => async (dispatch) => {
  const res = await fetch(`/api/weight-exercises/my-exercises`);

  if (res.ok) {
    const exercises = await res.json();
    dispatch(getUsersWeightExercises(exercises));
    return exercises;
  }
};


export const getUsersCardioExercisesThunk = () => async (dispatch) => {
  const res = await fetch(`/api/users-cardio-exercises`);

  if (res.ok) {
    const exercises = await res.json();
    dispatch(getUsersCardioExercises(exercises));
    return exercises;
  }
};

export const updateUserCardioExerciseThunk = (exerciseId, formData) => async (dispatch) => {
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
}


const userExercisesReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_USERS_CARDIO_EXERCISES:
            const cardioExercises = {};
            if (!action.cardioExercises.userCardioExercises) return {};
            action.cardioExercises.userCardioExercises.forEach((exercise) => {
                cardioExercises[exercise.id] = exercise
            })
            return cardioExercises;
        case GET_USERS_WEIGHT_EXERCISES:
            const weightExercises = {};
            action.weightExercises.weightExercises.forEach((exercise) => {
                weightExercises[exercise.id] = exercise
            })
            return weightExercises;
        case UPDATE_CARDIO_EXERCISE:
            console.log('------', action)
            return {
                ...state,
                [action.exercise.userCardioExercise.id]: action.exercise.userCardioExercise
            }
        case CLEAR_USER_EXERCISES:
            return {};
        default:
            return state
    }
}

export default userExercisesReducer
