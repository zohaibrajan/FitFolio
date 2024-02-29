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

function MyExercises() {
  // exerciseType = exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1);
  const [exerciseType, setExerciseType] = useState("Cardio"); // ["Cardio", "Strength"]
  const dispatch = useDispatch();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState({});
  const userExercisesObj = useSelector((state) => state.userExercisesFiltered);
  const userExercises = Object.values(userExercisesObj);
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 10;
  const endIndex = currentPage * exercisesPerPage;
  const startIndex = endIndex - exercisesPerPage;

  useEffect(() => {
    if (exerciseType === "Cardio") {
      dispatch(getUsersCardioExercisesFilteredThunk());
      setCurrentPage(1);
    } else {
      dispatch(getUsersWeightExercisesFilteredThunk());
      setCurrentPage(1);
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
            <span>
              My
              <select
                onChange={(e) => setExerciseType(e.target.value)}
                className="exercise-type-select"
              >
                <option value="Cardio">
                  Cardio
                </option>
                <option value="Strength">
                  Strength
                </option>
              </select>
              Exercises
            </span>
          </div>
          <div className="my-exercise-text">
            <p>
              Welcome to the exercise section! Here you can view all of your
              Exercises
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
              userExercises.slice(startIndex, endIndex).map((exercise) => (
                <tr>
                  <td>{exercise.exerciseName.split("*")[0]}</td>
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
              <div className="exercise-card-no-exercises">
                <h4>No Exercise, add one from above </h4>
              </div>
            )}
          </table>
          <div className="pagination-my-exercise-button-container">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="previous-my-exercise-button"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="next-my-exercise-button"
              disabled={
                currentPage ===
                  Math.ceil(userExercises.length / exercisesPerPage) ||
                userExercises.length === 0
              }
            >
              Next
            </button>
          </div>
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
