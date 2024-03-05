import { useDispatch } from "react-redux";
import { deleteCardioLogThunk } from "../store/cardioLogs";
import { deleteWeightLogThunk } from "../store/weightLogs";
import { deleteFoodLogThunk } from "../store/foodLogs";

function useRemoveCardioLog() {
  const dispatch = useDispatch();
  return (e, cardioLogId) => {
    e.preventDefault();
    dispatch(deleteCardioLogThunk(cardioLogId));
  };
}

function useRemoveStrengthLog() {
  const dispatch = useDispatch();
  return (e, strengthLogId) => {
    e.preventDefault();
    dispatch(deleteWeightLogThunk(strengthLogId));
  };
}

function useRemoveFoodLog() {
  const dispatch = useDispatch();
  return (e, foodLogId) => {
    e.preventDefault();
    dispatch(deleteFoodLogThunk(foodLogId));
  };
}

function isTodayOrFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date.setHours(0, 0, 0, 0));

  return selectedDate >= today;
}

export {
  useRemoveCardioLog,
  useRemoveStrengthLog,
  useRemoveFoodLog,
  isTodayOrFuture,
};
