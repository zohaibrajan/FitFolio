import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCardioExercisesThunk } from "../../store/cardioExercises";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";


function Diary() {
  const dispatch = useDispatch();
  const cardioExercisesObj = useSelector((state) => state.cardioExercises);
  const weightExerciseObj = useSelector((state) => state.weightExercises);
  const weightExercises = Object.values(weightExerciseObj);
  const cardioExercises = Object.values(cardioExercisesObj);
  const [cardioExercise, setCardioExercise] = useState("");
  const [weightExercise, setWeightExercise] = useState("");

  useEffect(() => {
    dispatch(getAllCardioExercisesThunk());
    dispatch(getAllWeightExercisesThunk())
  }, [dispatch]);

  return (
    <>
      <div className="create-logs-div">
        <label className="cardio-log-creation">
          Cardio Exercises
          <select
            type="text"
            value={cardioExercise}
            onChange={(e) => setCardioExercise(e.target.value)}
            placeholder="Cardio Exercises"
          >
            {cardioExercises.map((exercise) => (
              <option
                key={exercise.id}
                value={`${exercise.exerciseName}, ${exercise.id}`}
              >
                {exercise.exerciseName}
              </option>
            ))}
          </select>
        </label>
        <label className="weight-log-creation">
          Weight Exercises
          <select
            type="text"
            value={weightExercise}
            onChange={(e) => setWeightExercise(e.target.value)}
            placeholder="Weight Exercises"
          >
            {weightExercises.map((exercise) => (
              <option
                key={exercise.id}
                value={`${exercise.exerciseName}, ${exercise.id}`}
              >
                {exercise.exerciseName}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}

export default Diary;
