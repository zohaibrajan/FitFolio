import React, { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import FoodLogModal from "../FoodLogModal";
import AllLogs from "../AllLogs";
import { isTodayOrFuture } from "../../utils";
import { useSelectedDate } from "../../context/SelectedDate";
import { getUsersGoalThunk } from "../../store/goal";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./Diary.css";

function Diary() {
  const dispatch = useDispatch();
  const today = new Date();
  const goal = useSelector((state) => state.goal);
  const cardioLogsObj = useSelector((state) => state.cardioLogs);
  const foodLogsObj = useSelector((state) => state.foodLogs);
  const foodLogs = Object.values(foodLogsObj);
  const cardioLogs = Object.values(cardioLogsObj);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const { selectedDate, setSelectedDate } = useSelectedDate();

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

  const incrementDate = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const decrementDate = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

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
              <div className="diary-calendar-container">
                <button className="prev-date-button" onClick={decrementDate}>
                  <i
                    className="fa-solid fa-angle-left"
                    style={{ color: "white" }}
                  ></i>
                </button>
                <DatePicker
                  className="date-picker"
                  showIcon
                  selected={selectedDate}
                  maxDate={today}
                  onChange={(date) => {
                    if (date <= today) {
                      setSelectedDate(date);
                    }
                  }}
                />
                <button
                  className="next-date-button"
                  onClick={incrementDate}
                  disabled={isTodayOrFuture(selectedDate)}
                >
                  <i
                    className="fa-solid fa-angle-right"
                    style={{ color: "white" }}
                  />
                </button>
              </div>
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
          <AllLogs />
        </div>
      </div>
    </>
  );
}

export default Diary;
