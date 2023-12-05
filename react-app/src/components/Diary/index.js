import React, { useEffect } from "react";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import FoodLogModal from "../FoodLogModal";
import { getUsersGoalThunk } from "../../store/goal";
import { getAllCardioLogsThunk } from "../../store/cardioLogs";
import { getAllWeightLogsThunk } from "../../store/weightLogs";
import { useDispatch, useSelector } from "react-redux";
import { getAllFoodLogsThunk } from "../../store/foodLogs";



function Diary() {
  const dispatch = useDispatch()
  const goal = useSelector(state => state.goal)

  console.log(goal)

  useEffect(() => {
    dispatch(getUsersGoalThunk())
    dispatch(getAllCardioLogsThunk())
    dispatch(getAllWeightLogsThunk())
    dispatch(getAllFoodLogsThunk())
  }, [dispatch])




  return (
    <>
      <OpenModalButton
        modalComponent={<CardioLogModal />}
        buttonText={"Add Cardio Exercise"}
      />
      <OpenModalButton
        modalComponent={<WeightLogModal />}
        buttonText={"Add Weight Exercise"}
      />
      <OpenModalButton
        modalComponent={<FoodLogModal />}
        buttonText={"Add Food"}
      />
      <h2>{goal.caloriesPerDay}</h2>
    </>
  );
}

export default Diary;
