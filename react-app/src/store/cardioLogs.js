const CREATE_CARDIO_LOG = "cardio-logs/CREATE_CARDIO_LOG";
const ALL_CARDIO_LOGS = "cardio-logs/ALL_CARDIO_LOGS"
const DELETE_CARDIO_LOG = "cardio-logs/DELETE_CARDIO_LOG"


const getAllCardioLogs = (cardioLogs) => ({
  type: ALL_CARDIO_LOGS,
  cardioLogs,
});

const createCardioLog = (cardioLog) => ({
    type: CREATE_CARDIO_LOG,
    cardioLog
})

const deleteACardioLog = (cardioLogId) => ({
  type: DELETE_CARDIO_LOG,
  cardioLogId
})

export const getAllCardioLogsThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/cardio-logs");

  if (res.ok) {
    const cardioLogs = await res.json();
    dispatch(getAllCardioLogs(cardioLogs));
    return cardioLogs;
  }
};

export const getAllCardioLogsForTodayThunk = () => async (dispatch) => {
  const res = await fetch("/api/users/cardio-logs/today");

  if (res.ok) {
    const cardioLogs = await res.json();
    dispatch(getAllCardioLogs(cardioLogs));
    return cardioLogs;
  }
};

export const createCardioLogThunk = (cardioLog) => async (dispatch) => {
    const res = await fetch("/api/users/cardio-logs", {
        method: "POST",
        body: cardioLog
    })

    if (res.ok) {
        const newLog = await res.json()
        dispatch(createCardioLog(newLog))
        return newLog
    } else {
        const errors = await res.json()
        return errors
    }
};

export const deleteCardioLogThunk = (cardioLogId) => async (dispatch) => {
  const res = await fetch(`/api/users/cardio-logs/${cardioLogId}`, {
    method: "DELETE"
  })

  if (res.ok) {
    const confirm = await res.json()
    dispatch(deleteACardioLog(cardioLogId))
    return confirm
  }
}

const cardioLogReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_CARDIO_LOGS: {
      const newState = {};
      action.cardioLogs.allCardioLogs.forEach(log => {
        newState[log.id] = log
      })
      return newState;
    }
    case CREATE_CARDIO_LOG:
        return {
            ...state,
            [action.cardioLog.id]: action.cardioLog
        }
    case DELETE_CARDIO_LOG: {
      const newState = { ...state }
      delete newState[action.cardioLogId]
      return newState
    }
    default:
      return state;
  }
};

export default cardioLogReducer
