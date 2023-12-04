import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllWeightExercisesThunk } from "../../store/weightExercises";

function WeightLogModal() {
  const dispatch = useDispatch();
  const weightExerciseObj = useSelector((state) => state.weightExercises);
  const weightExercises = Object.values(weightExerciseObj);
  const [weightExercise, setWeightExercise] = useState("");


  useEffect(() => {
    dispatch(getAllWeightExercisesThunk());
  }, [dispatch]);

  return (
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
  );
}

export default WeightLogModal;
