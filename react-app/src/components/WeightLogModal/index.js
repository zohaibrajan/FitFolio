import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { gettingTodaysDate, formattingUserInputDate } from "../../utils";
import {
  createWeightLogThunk,
  updateWeightLogThunk,
  deleteAWeightLog,
} from "../../store/weightLogs";
import "./WeightLog.css";
import { useSelectedDate } from "../../context/SelectedDate";

function WeightLogModal({ formType = "create", log = {}, exerciseName = "", exerciseIdProp = 1}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const today = gettingTodaysDate();
  const diaryDate = formattingUserInputDate(useSelectedDate().selectedDate);
  const history = useHistory();
  const weightExerciseObj = useSelector((state) => state.weightExercises);
  const weightExercises = Object.values(weightExerciseObj);
  const [date, setDate] = useState(
    formType === "update" ? log.date : diaryDate
  );
  const [sets, setSets] = useState(formType === "update" ? log.sets : 0);
  const [reps, setReps] = useState(formType === "update" ? log.repetitions : 0);
  const [weightPerRep, setWeightPerRep] = useState(
    formType === "update" ? log.weightPerRep : 0
  );
  const [isExerciseSelected, setIsExerciseSelected] = useState(
    formType === "update" || exerciseName ? true : false
  );
  const [searchTerm, setSearchTerm] = useState(
    formType === "update" ? log.weightExercise.exerciseName : exerciseName
  );

  const filteredWeightExercises = weightExercises.filter((exercise) =>
    exercise.exerciseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExerciseClick = (exercise) => {
    setSearchTerm(exercise.exerciseName);
    setIsExerciseSelected(true);
  };

  useEffect(() => {
    dispatch(getAllWeightExercisesThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("exercise_name", searchTerm);
    formData.append("sets", sets);
    formData.append("repetitions", reps);
    formData.append("weight_per_rep", weightPerRep);
    formData.append("date", date);

    if (formType === "create") {
      if (date !== diaryDate) {
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
      if (date !== diaryDate) {
        await fetch(`/api/users/weight-logs/${log.id}`, {
          method: "PUT",
          body: formData,
        });
        dispatch(deleteAWeightLog(log.id));
        closeModal();
      } else {
        try {
          await dispatch(updateWeightLogThunk(log.id, formData));
          closeModal();
        } catch (e) {
          const errors = await e.json();
          console.error(errors);
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
        <label
          className="weight-log-labels"
          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          Weight Exercise:
          <input
            type="text"
            style={{
              margin: "0px",
            }}
            value={searchTerm}
            disabled={exerciseName.length > 0}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsExerciseSelected(false);
            }}
            placeholder="Search for an exercise"
          />
          {searchTerm &&
            !isExerciseSelected &&
            filteredWeightExercises.length > 0 && (
              <div className="scrollable-weight-exercises">
                {filteredWeightExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    className="weight-log-exercise-list-item"
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    {exercise.exerciseName}
                  </button>
                ))}
              </div>
            )}
        </label>
        <label className="weight-log-labels">
          Sets:
          <input
            disabled={!isExerciseSelected}
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
            disabled={!isExerciseSelected}
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
            disabled={!isExerciseSelected}
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
        <button
          disabled={
            !isExerciseSelected || reps < 1 || weightPerRep < 1 || sets < 1
          }
          className="weight-log-submit-button"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default WeightLogModal;
