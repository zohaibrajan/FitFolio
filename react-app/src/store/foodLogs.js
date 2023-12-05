const CREATE_FOOD_LOG = "food-logs/CREATE_FOOD_LOG";
const ALL_FOOD_LOGS = "food-logs/ALL_FOOD_LOGS"

const getAllFoodLogs = (foodLogs) => ({
  type: ALL_FOOD_LOGS,
  foodLogs,
});

const createFoodLog = (foodLog) => ({
  type: CREATE_FOOD_LOG,
  foodLog,
});

export const getAllFoodLogsThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/food-logs");

  if (res.ok) {
    const foodLogs = await res.json();
    dispatch(getAllFoodLogs(foodLogs));
    return foodLogs;
  }
};

export const createFoodLogThunk = (foodLog) => async (dispatch) => {
  const res = await fetch("/api/users/food-logs", {
    method: "POST",
    body: foodLog,
  });

  if (res.ok) {
    const newLog = await res.json();
    dispatch(createFoodLog(newLog));
    return newLog;
  } else {
    const errors = await res.json();
    return errors;
  }
};

const foodLogReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_FOOD_LOGS:
      const newState = {};
      action.foodLogs.allFoodLogs.forEach((log) => {
        newState[log.id] = log;
      });
      return newState;
    case CREATE_FOOD_LOG:
      return {
        ...state,
        [action.foodLog.id]: action.foodLog,
      };
    default:
      return state;
  }
};

export default foodLogReducer;
