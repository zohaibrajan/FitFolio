const CREATE_WEIGHT_LOG = "weight-logs/CREATE_WEIGHT_LOG";
const ALL_WEIGHT_LOGS = "weight-logs/ALL_WEIGHT_LOGS";
const DELETE_WEIGHT_LOG = "weight-logs/DELETE_WEIGHT_LOG";

const getAllWeightLogs = (weightLogs) => ({
  type: ALL_WEIGHT_LOGS,
  weightLogs,
});

const createWeightLog = (weightLog) => ({
  type: CREATE_WEIGHT_LOG,
  weightLog,
});

const deleteAWeightLog = (weightLogId) => ({
  type: DELETE_WEIGHT_LOG,
  weightLogId,
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
      const newState = { ...state }
      delete newState[action.weightLogId]
      return newState
    }
    default:
      return state;
  }
};

export default weightLogReducer;
