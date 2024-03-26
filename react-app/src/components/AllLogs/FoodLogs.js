import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FoodLogModal from "../FoodLogModal";
import OpenModalButton from "../OpenModalButton";
import { useSelectedDate } from "../../context/SelectedDate";
import { formattingUserInputDate } from "../../utils";
import { getAllFoodLogsForADayThunk } from "../../store/foodLogs";
import { useRemoveFoodLog } from "../../utils";
import { useEffect } from "react";

function FoodLogs() {
  const dispatch = useDispatch();
  const { selectedDate } = useSelectedDate();
  const removeFoodLog = useRemoveFoodLog();
  const foodLogsObj = useSelector((state) => state.foodLogs);
  const foodLogs = Object.values(foodLogsObj);

  useEffect(() => {
    const formattedDateForFetch = formattingUserInputDate(selectedDate);
    dispatch(getAllFoodLogsForADayThunk(formattedDateForFetch));
  }, [dispatch, selectedDate]);

  return (
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
            <div style={{ display: "flex", justifyContent: "center" }}>
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
  );
}


export default FoodLogs;
