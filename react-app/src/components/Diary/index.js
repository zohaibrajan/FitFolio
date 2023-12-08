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
import { deleteCardioLogThunk } from "../../store/cardioLogs";
import { deleteWeightLogThunk } from "../../store/weightLogs";
import { deleteFoodLogThunk } from "../../store/foodLogs";
import "./Diary.css";

function Diary() {
  const dispatch = useDispatch();
  const goal = useSelector((state) => state.goal);
  const cardioLogsObj = useSelector((state) => state.cardioLogs);
  const weightLogsObj = useSelector((state) => state.weightLogs);
  const foodLogsObj = useSelector((state) => state.foodLogs);
  const foodLogs = Object.values(foodLogsObj);
  const weightLogs = Object.values(weightLogsObj);
  const cardioLogs = Object.values(cardioLogsObj);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const caloriesStyle =
    goal.caloriesPerDay + caloriesBurned - caloriesConsumed > 0
      ? "calories-green"
      : "calories-red";

  useEffect(() => {
    dispatch(getUsersGoalThunk());
    dispatch(getAllCardioLogsForTodayThunk());
    dispatch(getAllWeightLogsForTodayThunk());
    dispatch(getAllFoodLogsForTodayThunk());
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

  const removeCardioLog = (e, cardioLogId) => {
    e.preventDefault();

    dispatch(deleteCardioLogThunk(cardioLogId));
  };

  const removeWeightLog = (e, weightLodId) => {
    e.preventDefault();

    dispatch(deleteWeightLogThunk(weightLodId));
  };

  const removeFoodLog = (e, foodLogId) => {
    e.preventDefault();

    dispatch(deleteFoodLogThunk(foodLogId));
  };

  return (
    <>
      <div className="diary-container">
        <div className="diary-elements-container">
          <div className="diary-details-container">
            <div className="diary-details-title">
              <span>Your Daily Summary</span>
            </div>
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

              <div className="log-buttons-container">
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
              </div>
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
            <div className="diary-details-title">
              <span>Todays Diary</span>
            </div>
            <div className="users-log-container">
              <div className="users-cardio-log">
                <h4>Cardio Training: </h4>
                <div className="users-logs">
                  <table>
                    <tr>
                      <th>Exercise Name</th>
                      <th>Calories Burned</th>
                      <th>Minutes</th>
                      <th></th>
                    </tr>
                    {!cardioLogs.length ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          You have no Cardio Logs
                        </div>
                      </div>
                    ) : (
                      cardioLogs.map((log) => (
                        <>
                          <tr>
                            <td>{log.cardioExercise.exerciseName}</td>
                            <td>{log.caloriesBurned}</td>
                            <td>{log.duration}</td>
                            <td>
                              <button
                                onClick={(e) => removeCardioLog(e, log.id)}
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
                                buttonText={"Edit Exercise"}
                                modalComponent={
                                  <CardioLogModal formType="update" log={log} />
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
              <div className="users-cardio-log">
                <h4>Strength Training: </h4>
                <div className="users-logs">
                  <table>
                    <tr>
                      <th>Exercise Name</th>
                      <th>Sets</th>
                      <th>Repetitions</th>
                      <th>Weight Per Repetitions</th>
                      <th></th>
                    </tr>
                    {!weightLogs.length ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div style={{ fontSize: "12px", fontWeight: "600" }}>
                          You have no Weight Logs
                        </div>
                      </div>
                    ) : (
                      weightLogs.map((log) => (
                        <>
                          <tr>
                            <td>{log.weightExercise.exerciseName}</td>
                            <td>{log.sets}</td>
                            <td>{log.repetitions}</td>
                            <td>{log.weightPerRep}</td>
                            <td>
                              <button
                                onClick={(e) => removeWeightLog(e, log.id)}
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
                                buttonText={"Edit Exercise"}
                                modalComponent={
                                  <WeightLogModal formType="update" log={log} />
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
                                  <FoodLogModal formType="update" log={log} />
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
              {/* <div className="users-logs">
                <h4>Foods: </h4>
                {!foodLogs.length ? (
                  <div>No Food Logs</div>
                ) : (
                  foodLogs.map((log) => (
                    <div key={log.id}>
                      <span>{log.food.name}</span>
                      <span>{log.totalCaloriesConsumed}</span>:
                      <span>{log.totalProteinConsumed}</span>:
                      <button onClick={(e) => removeFoodLog(e, log.id)}>
                        <i
                          className="fa-solid fa-circle-minus"
                          style={{ color: "#ff0000" }}
                        ></i>
                      </button>
                      <OpenModalButton
                        buttonText={"Edit Food Item"}
                        modalComponent={
                          <FoodLogModal formType="update" log={log} />
                        }
                      />
                    </div>
                  ))
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Diary;
