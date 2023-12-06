import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersGoalThunk } from "../../store/goal";
import OpenModalButton from "../OpenModalButton";
import UpdatingGoalModal from "../UpdatingGoalModal";


function Goal() {
  const dispatch = useDispatch()
  const goal = useSelector(state => state.goal)


  useEffect(() => {
    dispatch(getUsersGoalThunk());
  }, [dispatch])


  return (
    <div>
      <h1>Your Current Goal</h1>
      <div>
        <h2>{goal.goal}</h2>
        <span>Current Calories Needed: {goal.caloriesPerDay}</span>
        <span>Starting Weight: {goal.startingWeight}</span>
        <span>Target Weight: {goal.targetWeight}</span>
      </div>
      <OpenModalButton modalComponent={<UpdatingGoalModal />} buttonText={"Update Goal"}/>
    </div>
  );
}

export default Goal;
