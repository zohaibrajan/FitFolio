import React, { useState, useEffect } from "react";
import {
  getUsersCardioExercisesFilteredThunk,
  getUsersWeightExercisesFilteredThunk,
  deleteUserCardioExerciseThunk,
  deleteUserWeightExerciseThunk
} from "../../store/userOwnedExercisesFiltered";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import { useDispatch, useSelector } from "react-redux";
import "./MyExercises.css";
import EditExercisePanel from "../EditExercisePanel";

function MyExercises({ exerciseType }) {
  exerciseType = exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1);
  const dispatch = useDispatch();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState({});
  const userExercisesObj = useSelector((state) => state.userExercisesFiltered);
  const userExercises = Object.values(userExercisesObj);

  useEffect(() => {
    if (exerciseType === "Cardio") {
      dispatch(getUsersCardioExercisesFilteredThunk());
    } else {
      dispatch(getUsersWeightExercisesFilteredThunk());
    }
  }, [dispatch, exerciseType]);

  useEffect(() => {
    setIsPanelOpen(false);
  }, [exerciseType]);

  const handleDelete = (e, exerciseId) => {
    e.preventDefault();
    if (exerciseType === "Cardio") {
      dispatch(deleteUserCardioExerciseThunk(exerciseId));
    } else {
      dispatch(deleteUserWeightExerciseThunk(exerciseId));
    }
  };

  return (
    <>
      <div className="exercise-container">
        <div className="all-exercise-cards">
          <h1>My {exerciseType} Exercises</h1>
          <p>
            Welcome to the exercise section! Exercises marked with{" "}
            <span style={{ color: "rgb(0, 102, 238)" }}>*</span> are custom
            exercises.
          </p>
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
                  onClick={(e) => handleDelete(e, exercise.id)}
                  style={{
                    padding: "0",
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                  }}
                  title="Delete"
                >
                  <i
                    className="fa-solid fa-circle-minus"
                    style={{ color: "#ff0000" }}
                  ></i>
                </button>
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

        <div className="edit-exercise-panel-parent">
          {isPanelOpen && (
            <EditExercisePanel
              exerciseTypeFromMyExercises={exerciseType}
              selectedExercise={selectedExercise}
              exerciseId={selectedExercise.id}
              setIsPanelOpen={setIsPanelOpen}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default MyExercises;
