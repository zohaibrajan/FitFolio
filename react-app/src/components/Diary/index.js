import React, { useEffect, useState } from "react";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import FoodLogModal from "../FoodLogModal";
import { CardioLogs, WeightLogs } from "../AllLogs";
import {
  useRemoveFoodLog,
  isTodayOrFuture,
  formattingUserInputDate,
} from "../../utils";
import { useSelectedDate } from "../../context/SelectedDate";
import { getUsersGoalThunk } from "../../store/goal";
import { getAllFoodLogsForADayThunk } from "../../store/foodLogs";
import { useDispatch, useSelector } from "react-redux";
import { getUsersCardioExercisesThunk } from "../../store/userOwnedExercises";
import DatePicker from "react-datepicker";
import { addDays, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./Diary.css";

function Diary() {
  const dispatch = useDispatch();
  const today = new Date();
  const removeFoodLog = useRemoveFoodLog();
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
    const formattedDateForFetch = formattingUserInputDate(selectedDate);
    dispatch(getUsersGoalThunk());
    dispatch(getAllFoodLogsForADayThunk(formattedDateForFetch));
    // dispatch(getUsersCardioExercisesThunk());
  }, [dispatch, selectedDate]);

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

          <div className="all-diary-logs">
            <div
              className="diary-details-title"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>Todays Diary</span>
              <span style={{ fontSize: "12px", fontWeight: "600" }}>
                Exercises and Foods marked with a * are your custom.
              </span>
            </div>
            <div className="users-log-container">
              <CardioLogs />
              <WeightLogs />
              <div className="users-cardio-log">
                <h4>Foods: </h4>
                <div className="users-logs">
                  <table>
                    <tr>
                      <th>Food Name</th>
                      <th>Calories</th>
                      <th>Protein (g)</th>
                      <th></th>
                    </tr>
                    {!foodLogs.length ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          No Food Logs
                        </div>
                      </div>
                    ) : (
                      foodLogs.map((log) => (
                        <>
                          <tr>
                            <td>{log.food.name}</td>
                            <td>{log.totalCaloriesConsumed}</td>
                            <td>{log.totalProteinConsumed}</td>
                            <td>
                              <button
                                onClick={(e) => removeFoodLog(e, log.id)}
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
                              <span style={{ color: "transparent" }}>Z</span>
                              <OpenModalButton
                                buttonText={"Edit Food Item"}
                                modalComponent={
                                  <FoodLogModal
                                    formType="update"
                                    log={log}
                                    dateFromDiary={selectedDate}
                                  />
                                }
                              />
                            </td>
                          </tr>
                        </>
                      ))
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Diary;
