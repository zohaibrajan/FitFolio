const CREATE_GOAL = "goal/CREATE_GOAL";
const USER_GOAL = "goal/USER_GOAL";

const getUsersGoal = (goal) => ({
  type: USER_GOAL,
  goal,
});

const createGoal = (goal) => ({
  type: CREATE_GOAL,
  goal,
});

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
    return errors;
  }
};

const goalReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_GOAL:
        return action.goal.goal
    case CREATE_GOAL:
      return {
        ...state,
        [action.goal.id]: action.goal,
      };
    default:
      return state;
  }
};

export default goalReducer
