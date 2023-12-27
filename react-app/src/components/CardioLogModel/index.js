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
import { useSelectedDate } from "../../context/SelectedDate";

function CardioLogModal({
  formType = "create",
  log = {},
  exerciseName = "",
  exerciseId = 1,
}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const today = gettingTodaysDate();
  const diaryDate = formattingUserInputDate(useSelectedDate().selectedDate);
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const cardioExercises = Object.values(cardioExercisesObj);
  const [searchTerm, setSearchTerm] = useState(
    formType === "update" ? log.cardioExercise.exerciseName : exerciseName
  );
  const [cardioExerciseId, setCardioExerciseId] = useState(
    formType === "update" ? log.cardioExercise.id : exerciseId
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

  const [isExerciseSelected, setIsExerciseSelected] = useState(
    formType === "update" || exerciseName ? true : false
  );

  useEffect(() => {
    dispatch(getAllCardioExercisesThunk());
  }, [dispatch]);

  useEffect(() => {
    const exercise = cardioExercisesObj[cardioExerciseId];
    if (exercise) {
      if (formType === "update" && duration === log.duration) {
        setCaloriesBurned(log.caloriesBurned);
      } else {
        setCaloriesBurned(exercise.caloriesPerMinute * duration);
      }
    }
  }, [cardioExerciseId, duration, cardioExercisesObj, formType, log]);

  const filteredCardioExercises = cardioExercises.filter((exercise) =>
    exercise.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExerciseClick = (exercise) => {
    setSearchTerm(exercise.exerciseName);
    setCardioExerciseId(exercise.id);
    setIsExerciseSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("duration", Number(duration));
    formData.append("calories_burned", Number(caloriesBurned));
    formData.append("exercise_name", searchTerm);
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
        <label
          className="cardio-log-labels"
          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          Cardio Exercise:
          <input
            type="text"
            style={{
              margin: "0px",
            }}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsExerciseSelected(false);
            }}
            placeholder="Search for an exercise"
          ></input>
          {searchTerm &&
            !isExerciseSelected &&
            filteredCardioExercises.length > 0 && (
              <div className="scrollable-cardio-exercises">
                {filteredCardioExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    className="cardio-exercise-list-item"
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    {exercise.exerciseName}
                  </button>
                ))}
              </div>
            )}
        </label>
        <label className="cardio-log-labels">
          Duration:
          <input
            disabled={!isExerciseSelected}
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
            disabled={!isExerciseSelected}
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
        <button
          disabled={!isExerciseSelected || duration < 1 || caloriesBurned < 1}
          className="cardio-log-submit-button"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CardioLogModal;
