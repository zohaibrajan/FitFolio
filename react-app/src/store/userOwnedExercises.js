const GET_USERS_WEIGHT_EXERCISES = 'userOwnedExercises/GET_USERS_WEIGHT_EXERCISES';
const GET_USERS_CARDIO_EXERCISES = 'userOwnedExercises/GET_USERS_CARDIO_EXERCISES';


const getUsersCardioExercises = (cardioExercises) => ({
    type: GET_USERS_CARDIO_EXERCISES,
    cardioExercises,
});

const getUsersWeightExercises = (weightExercises) => ({
    type: GET_USERS_WEIGHT_EXERCISES,
    weightExercises,
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


const userExercisesReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_USERS_CARDIO_EXERCISES:
            const cardioExercises = {};
            action.cardioExercises.cardioExercises.forEach((exercise) => {
                cardioExercises[exercise.id] = exercise
            })
            return cardioExercises;
        case GET_USERS_WEIGHT_EXERCISES:
            const weightExercises = {};
            action.weightExercises.weightExercises.forEach((exercise) => {
                weightExercises[exercise.id] = exercise
            })
            return weightExercises;
        default:
            return state
    }
}

export default userExercisesReducer
