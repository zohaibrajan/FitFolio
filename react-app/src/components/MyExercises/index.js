import React, { useState, useEffect } from "react";
import {
  getUsersCardioExercisesFilteredThunk,
  getUsersWeightExercisesFilteredThunk,
  deleteUserCardioExerciseThunk,
  deleteUserWeightExerciseThunk,
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
          <div className="my-exercise-title-container">
            <span>My {exerciseType} Exercises</span>
          </div>
          <div className="my-exercise-text">
            <p>
              Welcome to the exercise section! Exercises marked with{" "}
              <span style={{ color: "rgb(0, 102, 238)" }}>*</span> are custom
              exercises.
            </p>
          </div>

          <table className="my-exercise-table">
            <tr>
              <th>Exercise Name</th>
              <th></th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>

            {userExercises.length > 0 ? (
              userExercises.map((exercise) => (
                <tr>
                  <td>{exercise.exerciseName}</td>
                  <td>
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
                  </td>
                  <td>
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
                  </td>
                  <td>
                    <button
                    className="edit-my-exercise-button"
                      onClick={() => {
                        setIsPanelOpen(true);
                        setSelectedExercise(exercise);
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <div className="exercise-card">
                <h2>No Exercises</h2>
              </div>
            )}
          </table>
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
