const CREATE_GOAL = "goal/CREATE_GOAL";
const USER_GOAL = "goal/USER_GOAL";
const CLEAR_STATE = "goal/CLEAR_STATE";
const UPDATE_GOAL = "goal/UPDATE_GOAL";

const getUsersGoal = (goal) => ({
  type: USER_GOAL,
  goal,
});

const createGoal = (goal) => ({
  type: CREATE_GOAL,
  goal,
});

export const clearGoalState = () => ({
  type: CLEAR_STATE,
});

const updateGoal = (goal) => ({
  type: UPDATE_GOAL,
  goal
})

export const getUsersGoalThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/goal");

  if (res.ok) {
    const goal = await res.json();
    dispatch(getUsersGoal(goal));
    return goal;
  }
};

export const createGoalThunk = (goal) => async (dispatch) => {
  const res = await fetch("/api/users/goal", {
    method: "POST",
    body: goal,
  });

  if (res.ok) {
    const newGoal = await res.json();
    dispatch(createGoal(newGoal));
    return newGoal;
  } else {
    const errors = await res.json();
    console.log("something is breaking", errors);
    return errors;
  }
};

export const updateGoalThunk = (goal) => async (dispatch) => {
  const res = await fetch("/api/users/goal", {
    method: "PUT",
    body: goal,
  });

  if (res.ok) {
    const updatedGoal = await res.json();
    dispatch(updateGoal(updatedGoal));
    return updatedGoal;
  } else {
    const errors = await res.json();
    console.log("something is breaking", errors);
    return errors;
  }
};

const goalReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_GOAL:
      return action.goal.goal;
    case CREATE_GOAL:
      return {
        ...state,
        [action.goal.id]: action.goal,
      };
    case UPDATE_GOAL: {
      const newState = {}
      newState[action.goal.id] = action.goal
      return newState
    }
    case CLEAR_STATE: {
      return {};
    }
    default:
      return state;
  }
};

export default goalReducer;
