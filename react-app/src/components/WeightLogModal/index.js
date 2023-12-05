import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createWeightLogThunk } from "../../store/weightLogs";
import "./WeightLog.css";

function WeightLogModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const today = new Date();
  const history = useHistory();
  const formattedDate = today.toISOString().slice(0, 10);
  const weightExerciseObj = useSelector((state) => state.weightExercises);
  const weightExercises = Object.values(weightExerciseObj);
  const [date, setDate] = useState(formattedDate);
  const [exerciseId, setExerciseId] = useState(1);
  const [sets, setSets] = useState(0)
  const [reps, setReps] = useState(0)
  const [weightPerRep, setWeightPerRep] = useState(0)

  useEffect(() => {
    dispatch(getAllWeightExercisesThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const exerciseName = weightExerciseObj[exerciseId].exerciseName;
    const changeToDate = new Date(date)
    const correctFormatForDate = changeToDate.toISOString().slice(0, 10);

    console.log(correctFormatForDate)

    const formData = new FormData()
    formData.append("exercise_name", exerciseName)
    formData.append("sets", sets)
    formData.append("repetitions", reps)
    formData.append("weight_per_rep", weightPerRep)
    formData.append("date", correctFormatForDate)

    try {
      await dispatch(createWeightLogThunk(formData))
      history.replace("/my-home/diary")
      closeModal()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="weight-log-container">
      <form
        className="weight-log-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label className="weight-log-labels">
          Weight Exercises
          <select
            type="text"
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            placeholder="Weight Exercises"
          >
            {weightExercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.exerciseName}
              </option>
            ))}
          </select>
        </label>
        <label className="weight-log-labels">
          Sets:
          <input
            min={1}
            step={1}
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        </label>
        <label className="weight-log-labels">
          Repetitions:
          <input
            min={1}
            step={1}
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </label>
        <label className="weight-log-labels">
          Weight Per Repetition:
          <input
            min={1}
            step={1}
            type="number"
            value={weightPerRep}
            onChange={(e) => setWeightPerRep(e.target.value)}
          />
        </label>
        <label className="cardio-log-labels">
          Date:
          <input
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default WeightLogModal;
