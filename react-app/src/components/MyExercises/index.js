import React, { useState, useEffect } from "react";
import {
  getUsersCardioExercisesThunk,
  getUsersWeightExercisesThunk,
} from "../../store/userOwnedExercises";
import { useDispatch, useSelector } from "react-redux";

function MyExercises({ exerciseType }) {
  exerciseType = exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1);
  const dispatch = useDispatch();
  const userExercisesObj = useSelector((state) => state.userExercises);
  const userExercises = Object.values(userExercisesObj);


  useEffect(() => {
    if (exerciseType === "Cardio") {
      dispatch(getUsersCardioExercisesThunk());
    } else {
      dispatch(getUsersWeightExercisesThunk());
    }
  }, [dispatch, exerciseType]);

  return (
    <>
      <div>
        <h1>My {exerciseType} Exercises</h1>

        <div className="exercise-container">
          {userExercises.length > 0 ? (
            userExercises.map((exercise) => (
              <div className="exercise-card">
                <p>{exercise.exerciseName}</p>
              </div>
            ))
          ) : (
            <div className="exercise-card">
              <h2>No Exercises</h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyExercises;
