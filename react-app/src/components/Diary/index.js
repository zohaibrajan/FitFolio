import React, { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import FoodLogModal from "../FoodLogModal";
import { getUsersGoalThunk } from "../../store/goal";
import { getAllCardioLogsForTodayThunk } from "../../store/cardioLogs";
import { getAllWeightLogsForTodayThunk } from "../../store/weightLogs";
import { useDispatch, useSelector } from "react-redux";
import { getAllFoodLogsForTodayThunk } from "../../store/foodLogs";



function Diary() {
  const dispatch = useDispatch()
  const goal = useSelector(state => state.goal)
  const cardioLogsObj = useSelector(state => state.cardioLogs)
  const weightLogsObj = useSelector(state => state.weightLogs)
  const foodLogsObj = useSelector(state => state.foodLogs)
  const foodLogs = Object.values(foodLogsObj)
  const weightLogs = Object.values(weightLogsObj)
  const cardioLogs = Object.values(cardioLogsObj)
  const [caloriesBurned, setCaloriesBurned] = useState(0)
  const [caloriesConsumed, setCaloriesConsumed] = useState(0)

  useEffect(() => {
    dispatch(getUsersGoalThunk())
    dispatch(getAllCardioLogsForTodayThunk())
    dispatch(getAllWeightLogsForTodayThunk())
    dispatch(getAllFoodLogsForTodayThunk())
  }, [dispatch])

  useEffect(() => {
    let caloriesB = 0
    let caloriesC = 0
    if (cardioLogs.length) {
      cardioLogs.forEach(log => {
        caloriesB += log.caloriesBurned
      })

      setCaloriesBurned(caloriesB)
    }

    if (foodLogs.length) {
      foodLogs.forEach(log => {
        caloriesC += log.totalCaloriesConsumed
      })

      setCaloriesConsumed(caloriesC)
    }
  }, [cardioLogs, foodLogs])

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
      <span>Calories Remaining</span>
      {goal.caloriesPerDay && (
        <h2>{goal.caloriesPerDay + caloriesBurned - caloriesConsumed}</h2>
      )}
      <span>Exercise: {caloriesBurned}</span>
      <span>Food: {caloriesConsumed}</span>
      <div>
        <h3>Today's Diary</h3>
        <h4>Cardio: </h4>
        {!cardioLogs.length ? (
          <div>You have no Cardio Logs</div>
        ) : (
          cardioLogs.map((log) => (
            <div key={log.id}>
              <span>{log.cardioExercise.exerciseName}</span> :
              <span>{log.caloriesBurned}</span> :<span>{log.duration}</span>
            </div>
          ))
        )}
        <h4>Strength Training: </h4>
        {!weightLogs.length ? (
          <div>You have no Weight Logs</div>
        ) : (
          weightLogs.map((log) => (
            <div key={log.id}>
              <span>{log.weightExercise.exerciseName}</span>
              <span>{log.sets}</span> :<span>{log.repetitions}</span> :
              <span>{log.weightPerRep}</span>
            </div>
          ))
        )}
        <h4>Foods: </h4>
        {!foodLogs.length ? (
          <div>No Food Logs</div>
        ) : (
          foodLogs.map((log) => (
            <div key={log.id}>
              <span>{log.food.name}</span>
              <span>{log.totalCaloriesConsumed}</span>:
              <span>{log.totalProteinConsumed}</span>:
            </div>
          ))
        )}
        <progress
          max={`${goal.caloriesPerDay + caloriesBurned}`}
          value={`${goal.caloriesPerDay + caloriesBurned - caloriesConsumed}`}
        />
      </div>
    </>
  );
}

export default Diary;
