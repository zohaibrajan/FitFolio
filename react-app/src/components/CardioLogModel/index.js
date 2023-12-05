import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { useModal } from "../../context/Modal";
import { createCardioLogThunk } from "../../store/cardioLogs";
import "./CardioLog.css";

function CardioLogModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal()
  const today = new Date();
  const history = useHistory()
  const formattedDate = today.toISOString().slice(0, 10);
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const cardioExercises = Object.values(cardioExercisesObj);
  const [cardioExercise, setCardioExercise] = useState(1);
  const [duration, setDuration] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [date, setDate] = useState(formattedDate);


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
    e.preventDefault()

    const changeToDate = new Date(date);
    const correctFormatForDate = changeToDate.toISOString().slice(0, 10);

    const formData = new FormData()
    formData.append("duration", Number(duration));
    formData.append("calories_burned", Number(caloriesBurned));
    formData.append("exercise_name", cardioExercisesObj[cardioExercise].exerciseName);
    formData.append("date", correctFormatForDate)

    try {
        await dispatch(createCardioLogThunk(formData))
        history.replace("/my-home/diary")
        closeModal()
    } catch (e) {
        const errors = await e.json()
        console.error(errors)
    }

  }

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
            min={1}
            step={1}
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>
        <label className="cardio-log-labels">
          Calories Burned:
          <input
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
            max={formattedDate}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CardioLogModal;
