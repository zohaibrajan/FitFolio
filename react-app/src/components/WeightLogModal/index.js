import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { gettingTodaysDate, formattingUserInputDate } from "../../utils";
import { createWeightLogThunk, updateWeightLogThunk, deleteAWeightLog } from "../../store/weightLogs";
import "./WeightLog.css";


function WeightLogModal({ formType = "create", log = {}, dateFromDiary = "" }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const today = gettingTodaysDate();
  const diaryDate = formattingUserInputDate(dateFromDiary);
  const history = useHistory();
  const weightExerciseObj = useSelector((state) => state.weightExercises);
  const weightExercises = Object.values(weightExerciseObj);
  const [date, setDate] = useState(
    formType === "update" ? log.date : diaryDate
  );
  const [exerciseId, setExerciseId] = useState(
    formType === "update" ? log.weightExercise.id : 1
  );
  const [sets, setSets] = useState(formType === "update" ? log.sets : 0);
  const [reps, setReps] = useState(formType === "update" ? log.repetitions : 0);
  const [weightPerRep, setWeightPerRep] = useState(
    formType === "update" ? log.weightPerRep : 0
  );

  useEffect(() => {
    dispatch(getAllWeightExercisesThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exerciseName = weightExerciseObj[exerciseId].exerciseName;
    const changeToDate = new Date(date);
    const correctFormatForDate = changeToDate.toISOString().slice(0, 10);

    const formData = new FormData();
    formData.append("exercise_name", exerciseName);
    formData.append("sets", sets);
    formData.append("repetitions", reps);
    formData.append("weight_per_rep", weightPerRep);
    formData.append("date", correctFormatForDate);

    if (formType === "create") {
      if (correctFormatForDate !== diaryDate) {
        await fetch("/api/users/weight-logs", {
          method: "POST",
          body: formData,
        });
        closeModal();
      } else {
        try {
          await dispatch(createWeightLogThunk(formData));
          history.replace("/my-home/diary");
          closeModal();
        } catch (e) {
          const errors = await e.json();
          console.error(errors);
        }
      }
    } else {
      if (correctFormatForDate !== diaryDate) {
        await fetch(`/api/users/weight-logs/${log.id}`, {
          method: "PUT",
          body: formData,
        });
        dispatch(deleteAWeightLog(log.id))
        closeModal()
      } else {
        try {
          await dispatch(updateWeightLogThunk(log.id, formData));
          closeModal()
        } catch (e) {
          const errors = await e.json()
          console.error(errors)
        }
      }
    }
  };

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
            className="weight-log-inputs"
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
            className="weight-log-inputs"
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
            className="weight-log-inputs"
            min={1}
            step={1}
            type="number"
            value={weightPerRep}
            onChange={(e) => setWeightPerRep(e.target.value)}
          />
        </label>
        <label className="weight-log-labels">
          Date:
          <input
            type="date"
            value={date}
            pattern="\d{4}-\d{2}-\d{2}"
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button className="weight-log-submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default WeightLogModal;
