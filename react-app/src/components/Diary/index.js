import React, { useEffect, useState } from "react";
import AllLogs from "../AllLogs";
import Calendar from "../Calendar";
import LogButtons from "../LogButtons";
import { getUsersGoalThunk } from "../../store/goal";
import { useDispatch, useSelector } from "react-redux";
import "./Diary.css";

function Diary() { // Diary component - contains all other components. All goal related data is fetched and computed here
  const dispatch = useDispatch();
  const goal = useSelector((state) => state.goal);
  const cardioLogsObj = useSelector((state) => state.cardioLogs);
  const foodLogsObj = useSelector((state) => state.foodLogs);
  const foodLogs = Object.values(foodLogsObj);
  const cardioLogs = Object.values(cardioLogsObj);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  const caloriesStyle =
    goal.caloriesPerDay + caloriesBurned - caloriesConsumed > 0
      ? "calories-green"
      : "calories-red";

  useEffect(() => {
    dispatch(getUsersGoalThunk());
  }, [dispatch]);

  useEffect(() => { // calculating the total calories burned and consumed
    let caloriesBurn = 0; // calories burned
    let caloriesCon = 0; // calories consumed
    if (cardioLogs.length) {
      cardioLogs.forEach((log) => {
        caloriesBurn += log.caloriesBurned;
      });
    }
    setCaloriesBurned(caloriesBurn);

    if (foodLogs.length) {
      foodLogs.forEach((log) => {
        caloriesCon += log.totalCaloriesConsumed;
      });
    }
    setCaloriesConsumed(caloriesCon);
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
            <LogButtons /> {/* Contains the OpenModalButton component, allows use to add cardio, strength, and food logs to diary */}
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
