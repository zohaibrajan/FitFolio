import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CardioLogModal from "../CardioLogModel"
import OpenModalButton from "../OpenModalButton";
import { useSelectedDate } from "../../context/SelectedDate";
import { formattingUserInputDate } from "../../utils";
import { getAllCardioLogsForADateThunk } from "../../store/cardioLogs";
import { useRemoveCardioLog } from "../../utils";
import { useEffect } from "react";
import "../Diary/Diary.css";

function CardioLogs() {
  const dispatch = useDispatch();
  const { selectedDate } = useSelectedDate();
  const removeCardioLog = useRemoveCardioLog();
  const cardioLogsObj = useSelector((state) => state.cardioLogs);
  const cardioLogs = Object.values(cardioLogsObj);

  useEffect(() => {
    const formattedDateForFetch = formattingUserInputDate(selectedDate);
    dispatch(getAllCardioLogsForADateThunk(formattedDateForFetch));
  }, [dispatch, selectedDate]);

  return (
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
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                        <CardioLogModal
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

export default CardioLogs;
