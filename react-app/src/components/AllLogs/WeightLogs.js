import React from "react";
import { useSelector, useDispatch } from "react-redux";
import WeightLogModal from "../WeightLogModal";
import OpenModalButton from "../OpenModalButton";
import { useSelectedDate } from "../../context/SelectedDate";
import { formattingUserInputDate } from "../../utils";
import { getAllWeightLogForADayThunk } from "../../store/weightLogs";
import { useRemoveStrengthLog } from "../../utils";
import { useEffect } from "react";
import "../Diary/Diary.css";



function WeightLogs() {

    return (
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
              <div style={{ display: "flex", justifyContent: "center" }}>
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
                          <WeightLogModal
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
