const CREATE_WEIGHT_LOG = "weight-logs/CREATE_WEIGHT_LOG";
const ALL_WEIGHT_LOGS = "weight-logs/ALL_WEIGHT_LOGS";
const DELETE_WEIGHT_LOG = "weight-logs/DELETE_WEIGHT_LOG";
const UPDATE_WEIGHT_LOG = "weight-logs/UPDATE_WEIGHT_LOG";
const CLEAR_WEIGHT_LOG_STATE = "weight-logs/CLEAR_WEIGHT_LOG_STATE";

const getAllWeightLogs = (weightLogs) => ({
  type: ALL_WEIGHT_LOGS,
  weightLogs,
});

const createWeightLog = (weightLog) => ({
  type: CREATE_WEIGHT_LOG,
  weightLog,
});

export const deleteAWeightLog = (weightLogId) => ({
  type: DELETE_WEIGHT_LOG,
  weightLogId,
});

export const clearWeightLogState = () => ({
  type: CLEAR_WEIGHT_LOG_STATE,
});

const updateAWeightLog = (weightLog) => ({
  type: UPDATE_WEIGHT_LOG,
  weightLog,
});

export const getAllWeightLogsThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/weight-logs");

  if (res.ok) {
    const weightLogs = await res.json();
    dispatch(getAllWeightLogs(weightLogs));
    return weightLogs;
  }
};

export const getAllWeightLogsForTodayThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/weight-logs/today");

  if (res.ok) {
    const weightLogs = await res.json();
    dispatch(getAllWeightLogs(weightLogs));
    return weightLogs;
  }
};

export const createWeightLogThunk = (weightLog) => async (dispatch) => {
  const res = await fetch("/api/users/weight-logs", {
    method: "POST",
    body: weightLog,
  });

  if (res.ok) {
    const newLog = await res.json();
    dispatch(createWeightLog(newLog));
    return newLog;
  } else {
    const errors = await res.json();
    return errors;
  }
};

export const deleteWeightLogThunk = (weightLogId) => async (dispatch) => {
  const res = await fetch(`/api/users/weight-logs/${weightLogId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    const confirm = await res.json();
    dispatch(deleteAWeightLog(weightLogId));
    return confirm;
  }
};

export const updateWeightLogThunk =
  (weightLogId, weightLog) => async (dispatch) => {
    const res = await fetch(`/api/users/weight-logs/${weightLogId}`, {
      method: "PUT",
      body: weightLog,
    });

    if (res.ok) {
      const updatedLog = await res.json();
      dispatch(updateAWeightLog(updatedLog));
      return updatedLog;
    }
  };

const weightLogReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_WEIGHT_LOGS: {
      const newState = {};
      action.weightLogs.allWeightLogs.forEach((log) => {
        newState[log.id] = log;
      });
      return newState;
    }
    case CREATE_WEIGHT_LOG:
      return {
        ...state,
        [action.weightLog.id]: action.weightLog,
      };
    case DELETE_WEIGHT_LOG: {
      const newState = { ...state };
      delete newState[action.weightLogId];
      return newState;
    }
    case UPDATE_WEIGHT_LOG: {
      const newState = { ...state };
      newState[action.weightLog.id] = action.weightLog;
      return newState;
    }
    case CLEAR_WEIGHT_LOG_STATE:
      return {};
    default:
      return state;
  }
};

export default weightLogReducer;
