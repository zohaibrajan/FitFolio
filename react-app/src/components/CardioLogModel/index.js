import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { useModal } from "../../context/Modal";
import {
  createCardioLogThunk,
  updateCardioLogThunk,
  deleteACardioLog,
} from "../../store/cardioLogs";
import { gettingTodaysDate, formattingUserInputDate } from "../../utils";
import "./CardioLog.css";

function CardioLogModal({ formType = "create", log = {}, dateFromDiary = "" }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const today = gettingTodaysDate()
  const diaryDate = formattingUserInputDate(dateFromDiary)
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const cardioExercises = Object.values(cardioExercisesObj);
  const [cardioExercise, setCardioExercise] = useState(
    formType === "update" ? log.cardioExercise.id : 1
  );
  const [duration, setDuration] = useState(
    formType === "update" ? log.duration : 0
  );
  const [caloriesBurned, setCaloriesBurned] = useState(
    formType === "update" ? log.caloriesBurned : 0
  );
  const [date, setDate] = useState(
    formType === "update" ? log.date : diaryDate
  );


  useEffect(() => {
    dispatch(getAllCardioExercisesThunk());
  }, [dispatch]);

  useEffect(() => {
    const exercise = cardioExercisesObj[cardioExercise];
    if (exercise) {
      setCaloriesBurned(exercise.caloriesPerMinute * duration);
    }
  }, [cardioExercise, duration, cardioExercisesObj]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("duration", Number(duration));
    formData.append("calories_burned", Number(caloriesBurned));
    formData.append(
      "exercise_name",
      cardioExercisesObj[cardioExercise].exerciseName
    );
    formData.append("date", date);

    if (formType === "create") {
      if (date !== diaryDate) {
        await fetch("/api/users/cardio-logs", {
          method: "POST",
          body: formData,
        });
        closeModal();
      } else {
        try {
          await dispatch(createCardioLogThunk(formData));
          closeModal();
        } catch (e) {
          const errors = await e.json();
          console.error(errors);
        }
      }
    } else {
      if (date !== diaryDate) {
        await fetch(`/api/users/cardio-logs/${log.id}`, {
          method: "PUT",
          body: formData,
        });
        dispatch(deleteACardioLog(log.id));
        closeModal();
      } else {
        try {
          await dispatch(updateCardioLogThunk(log.id, formData));
          closeModal();
        } catch (e) {
          const errors = await e.json();
          console.error(errors);
        }
      }
    }
  };

  return (
    <div className="cardio-log-container">
      <form
        className="cardio-log-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label className="cardio-log-labels">
          Cardio Exercises:
          <select
            type="text"
            value={cardioExercise}
            onChange={(e) => setCardioExercise(e.target.value)}
            placeholder="Cardio Exercises"
          >
            {cardioExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.exerciseName}
              </option>
            ))}
          </select>
        </label>
        <label className="cardio-log-labels">
          Duration:
          <input
            className="duration-cb"
            min={1}
            step={1}
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          min
        </label>
        <label className="cardio-log-labels">
          Calories Burned:
          <input
            className="duration-cb"
            min={1}
            step={1}
            type="number"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(e.target.value)}
          />
        </label>
        <label className="cardio-log-labels">
          Date:
          <input
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button className="cardio-log-submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default CardioLogModal;
