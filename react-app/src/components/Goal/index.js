import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersGoalThunk } from "../../store/goal";

function Goal() {
  const dispatch = useDispatch()
  const goal = useSelector(state => state.goal)
  // const user = useSelector(state => state.user)


  useEffect(() => {
    dispatch(getUsersGoalThunk());
  }, [dispatch])


  return (
    <div>
      <h1>Your Current Goal</h1>
      <div>
        <span>Your Goal: <h2>{goal.goal}</h2></span>
        <span>Current Calories Needed: {goal.caloriesPerDay}</span>
        <span>Starting Weight: {goal.startingWeight}</span>
        <span>Target Weight: {goal.targetWeight}</span>
      </div>
    </div>
  );
}

export default Goal;
