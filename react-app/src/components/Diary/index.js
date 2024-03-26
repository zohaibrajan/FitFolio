import React, { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import FoodLogModal from "../FoodLogModal";
import AllLogs from "../AllLogs";
import Calendar from "../Calendar";
import { useSelectedDate } from "../../context/SelectedDate";
import { getUsersGoalThunk } from "../../store/goal";
import { useDispatch, useSelector } from "react-redux";
import "./Diary.css";

function Diary() {
  const dispatch = useDispatch();
  const goal = useSelector((state) => state.goal);
  const cardioLogsObj = useSelector((state) => state.cardioLogs);
  const foodLogsObj = useSelector((state) => state.foodLogs);
  const foodLogs = Object.values(foodLogsObj);
  const cardioLogs = Object.values(cardioLogsObj);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const { selectedDate } = useSelectedDate();

  const caloriesStyle =
    goal.caloriesPerDay + caloriesBurned - caloriesConsumed > 0
      ? "calories-green"
      : "calories-red";

  useEffect(() => {
    dispatch(getUsersGoalThunk());
  }, [dispatch]);

  useEffect(() => {
    let caloriesB = 0;
    let caloriesC = 0;
    if (cardioLogs.length) {
      cardioLogs.forEach((log) => {
        caloriesB += log.caloriesBurned;
      });
    }
    setCaloriesBurned(caloriesB);

    if (foodLogs.length) {
      foodLogs.forEach((log) => {
        caloriesC += log.totalCaloriesConsumed;
      });
    }
    setCaloriesConsumed(caloriesC);
  }, [cardioLogs, foodLogs]);

  return (
    <>
      <div className="diary-container">
        <div className="diary-elements-container">
          <div className="diary-details-container">
            <div className="diary-details-title">
              <span>Your Daily Summary</span>
            </div>
            <div className="diary-inner-details-container">
              <div className="diary-details">
                <span style={{ fontWeight: "600" }}>Calories Remaining</span>
                {goal.caloriesPerDay && (
                  <h2 className={caloriesStyle}>
                    {goal.caloriesPerDay + caloriesBurned - caloriesConsumed}
                  </h2>
                )}
                <span style={{ fontWeight: "600" }}>
                  Exercise:{" "}
                  <span style={{ fontWeight: "400" }}>
                    {caloriesBurned} Calories Burned
                  </span>
                </span>
                <span style={{ fontWeight: "600" }}>
                  Food:{" "}
                  <span style={{ fontWeight: "400" }}>
                    {caloriesConsumed} Calories Consumed
                  </span>
                </span>
              </div>
              <Calendar /> {/* Contains the DatePicker component - makes changing dates easier */}
            </div>
            <div className="log-buttons-container">
              <OpenModalButton
                modalComponent={<CardioLogModal dateFromDiary={selectedDate} />}
                buttonText={"Add Cardio Exercise"}
              />
              <OpenModalButton
                modalComponent={<WeightLogModal dateFromDiary={selectedDate} />}
                buttonText={"Add Weight Exercise"}
              />
              <OpenModalButton
                modalComponent={<FoodLogModal dateFromDiary={selectedDate} />}
                buttonText={"Add Food"}
              />
            </div>

            <div className="calories-progress-bar-container">
              <progress
                className="progress-bar"
                max={`${goal.caloriesPerDay + caloriesBurned}`}
                value={`${caloriesConsumed}`}
              />
            </div>
          </div>
          <AllLogs /> {/* Contains all cardio, strength and food logs - saved 150+ lines of code */}
        </div>
      </div>
    </>
  );
}

export default Diary;
