const CREATE_FOOD_LOG = "food-logs/CREATE_FOOD_LOG";
const ALL_FOOD_LOGS = "food-logs/ALL_FOOD_LOGS"
const DELETE_FOOD_LOG = "food-logs/DELETE_FOOD_LOG";
const UPDATE_FOOD_LOG = "food-logs/UPDATE_FOOD_LOG";

const getAllFoodLogs = (foodLogs) => ({
  type: ALL_FOOD_LOGS,
  foodLogs,
});

const createFoodLog = (foodLog) => ({
  type: CREATE_FOOD_LOG,
  foodLog,
});

export const deleteAFoodLog = (foodLogId) => ({
  type: DELETE_FOOD_LOG,
  foodLogId,
});

const updateAFoodLog = (foodLog) => ({
  type: UPDATE_FOOD_LOG,
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

export const getAllFoodLogsForTodayThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/food-logs/today");

  if (res.ok) {
    const foodLogs = await res.json();
    dispatch(getAllFoodLogs(foodLogs));
    return foodLogs;
  }
};

export const deleteFoodLogThunk = (foodLogId) => async (dispatch) => {
  const res = await fetch(`/api/users/food-logs/${foodLogId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const confirm = await res.json();
    dispatch(deleteAFoodLog(foodLogId));
    return confirm;
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

export const updateCardioLogThunk =
  (foodLogId, foodLog) => async (dispatch) => {
    const res = await fetch(`/api/users/food-logs/${foodLogId}`, {
      method: "PUT",
      body: foodLog,
    });

    if (res.ok) {
      const updatedLog = await res.json();
      dispatch(updateAFoodLog(updatedLog));
      return updatedLog;
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
    case DELETE_FOOD_LOG: {
      const newState = { ...state };
      delete newState[action.foodLogId];
      return newState;
    }
    case UPDATE_FOOD_LOG: {
      const newState = { ...state }
      newState[action.foodLog.id] = action.foodLog
      return newState
    }
    default:
      return state;
  }
};

export default foodLogReducer;
