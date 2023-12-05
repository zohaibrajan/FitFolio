const CREATE_WEIGHT_LOG = "weight-logs/CREATE_WEIGHT_LOG";
const ALL_WEIGHT_LOGS = "weight-logs/ALL_WEIGHT_LOGS";

const getAllWeightLogs = (weightLogs) => ({
  type: ALL_WEIGHT_LOGS,
  weightLogs,
});

const createWeightLog = (weightLog) => ({
  type: CREATE_WEIGHT_LOG,
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

const weightLogReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_WEIGHT_LOGS:
      const newState = {};
      action.weightLogs.allWeightLogs.forEach((log) => {
        newState[log.id] = log;
      });
      return newState;
    case CREATE_WEIGHT_LOG:
      return {
        ...state,
        [action.weightLog.id]: action.weightLog,
      };
    default:
      return state;
  }
};

export default weightLogReducer;
