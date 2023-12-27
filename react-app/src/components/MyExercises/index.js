import React, { useState, useEffect } from "react";
import {
  getUsersCardioExercisesThunk,
  getUsersWeightExercisesThunk,
} from "../../store/userOwnedExercises";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import { useDispatch, useSelector } from "react-redux";
import "./MyExercises.css";

function MyExercises({ exerciseType }) {
  exerciseType = exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1);
  const dispatch = useDispatch();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [duration, setDuration] = useState(60);
  const [selectedExercise, setSelectedExercise] = useState({});
  const [caloriesBurned, setCaloriesBurned] = useState(selectedExercise?.caloriesPerMinute * duration);
  const userExercisesObj = useSelector((state) => state.userExercises);
  const userExercises = Object.values(userExercisesObj);

  useEffect(() => {
    if (exerciseType === "Cardio") {
      dispatch(getUsersCardioExercisesThunk());
    } else {
      dispatch(getUsersWeightExercisesThunk());
    }
  }, [dispatch, exerciseType]);


  console.log(selectedExercise)
  console.log(caloriesBurned)

  return (
    <>
      <div>
        <h1>My {exerciseType} Exercises</h1>

        <div className="exercise-container">
          {userExercises.length > 0 ? (
            userExercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <p>{exercise.exerciseName}</p>
                <OpenModalButton
                  modalComponent={
                    exerciseType === "Cardio" ? (
                      <CardioLogModal
                        exerciseName={exercise.exerciseName}
                        exerciseId={exercise.id}
                      />
                    ) : (
                      <WeightLogModal
                        exerciseName={exercise.exerciseName}
                        exerciseIdProp={exercise.id}
                      />
                    )
                  }
                  buttonText={"Add to Diary"}
                />
                <button
                  onClick={() => {
                    setIsPanelOpen(true);
                    setSelectedExercise(exercise);
                  }}
                >
                  Edit Exercise
                </button>
              </div>
            ))
          ) : (
            <div className="exercise-card">
              <h2>No Exercises</h2>
            </div>
          )}
        </div>
        {isPanelOpen && (
          <div className={`side-panel ${isPanelOpen ? "" : "hidden"}`}>
            <h1>Edit Exercise</h1>
            <form>
              <label>
                Exercise Name:
                <input
                  type="text"
                  name="exerciseName"
                  value={selectedExercise.exerciseName}
                  onChange={(e) => {
                    setSelectedExercise({
                      ...selectedExercise,
                      exerciseName: e.target.value,
                    });
                  }}
                />
              </label>
              <label>
                Exercise Type:
                <select
                  type="text"
                  name="exerciseType"
                  value={selectedExercise.exerciseType}
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                </select>
              </label>
              <label>
                Duration:
                <input
                  type="number"
                  value={duration}
                  name="exerciseDuration"
                  onChange={(e) => setDuration(e.target.value)}
                ></input>
              </label>
              <label>
                Calories Burned:
                <input type="number" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)}></input>
              </label>
            </form>
            <button onClick={() => setIsPanelOpen(false)}>Close</button>
          </div>
        )}
      </div>
    </>
  );
}

export default MyExercises;
