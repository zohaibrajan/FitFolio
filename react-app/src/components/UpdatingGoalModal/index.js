import React, { useState } from "react";
import { updateGoalThunk } from "../../store/goal";
import { useModal } from "../../context/Modal";
import "./UpdatingGoal.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function UpdatingGoalModal() {
  const currentGoal = useSelector((state) => state.goal);
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const [goal, setGoal] = useState(currentGoal.goal);
  const [currentWeight, setCurrentWeight] = useState(
    currentGoal.startingWeight
  );
  const [targetWeight, setTargetWeight] = useState(currentGoal.targetWeight);
  const [goalErrors, setGoalErrors] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState(
    currentGoal.goal === "Lose Weight"
      ? -1 * currentGoal.lbsPerWeek
      : currentGoal.lbsPerWeek
  );
  const disabled =
    goalErrors.length || weeklyGoal === "" || targetWeight === "";
  const buttonStyle = disabled ? "disabled-button" : "signup-submit-button";

  const handleGoalClick = (clickedGoal) => {
    setGoal(clickedGoal);
    if (clickedGoal === "Lose Weight") {
      setWeeklyGoal("")
      setTargetWeight("");
    } else if (clickedGoal === "Maintain Weight") {
      setWeeklyGoal("set");
      setTargetWeight(currentWeight);
    } else if (clickedGoal === "Gain Weight") {
      setWeeklyGoal("");
      setTargetWeight("");
    }

    setGoalErrors("");
  };

  const handleCurrentWeightChange = (e) => {
    const newCurrentWeight = e.target.value;
    setCurrentWeight(newCurrentWeight);
    setTargetWeight("");
    setGoalErrors("");
  };

  const handleTargetWeightChange = (e) => {
    const newTargetWeight = e.target.value;
    setTargetWeight(newTargetWeight);

    if (
      (goal === "Lose Weight" &&
        newTargetWeight !== "" &&
        parseFloat(newTargetWeight) >= parseFloat(currentWeight)) ||
      (goal === "Maintain Weight" &&
        newTargetWeight !== "" &&
        parseFloat(newTargetWeight) !== parseFloat(currentWeight)) ||
      (goal === "Gain Weight" &&
        newTargetWeight !== "" &&
        parseFloat(newTargetWeight) <= parseFloat(currentWeight))
    ) {
      setGoalErrors(`Invalid target weight for ${goal} goal.`);
    } else {
      setGoalErrors("");
      setTargetWeight(newTargetWeight);
    }
  };

  const renderWeeklyGoalButtons = () => {
    if (!goal) {
      return (
        <div className="checking-if-goal" style={{ height: "50px" }}>
          <span
            style={{
              fontWeight: "600",
              fontSize: "15px",
              color: "rgb(0, 102, 238)",
            }}
          >
            You have not selected a goal yet
          </span>
        </div>
      );
    }
    if (goal === "Maintain Weight") {
      return (
        <div className="checking-if-goal" style={{ height: "50px" }}>
          <span
            style={{
              fontWeight: "600",
              fontSize: "15px",
              color: "rgb(0, 102, 238)",
            }}
          >
            Your Weekly Goal is to remain at your Current Weight
          </span>
        </div>
      );
    } else {
      return (
        <div className="checking-if-goal-buttons">
          {goal === "Lose Weight" && (
            <>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(-0.5)}
                style={{
                  border:
                    weeklyGoal === -0.5
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 0.5 lbs per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(-1)}
                style={{
                  border:
                    weeklyGoal === -1
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 1 lb per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(-1.5)}
                style={{
                  border:
                    weeklyGoal === -1.5
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -1.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 1.5 lbs per week
              </button>
            </>
          )}
          {goal === "Gain Weight" && (
            <>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(0.5)}
                style={{
                  border:
                    weeklyGoal === 0.5
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 0.5 lbs per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(1)}
                style={{
                  border:
                    weeklyGoal === 1
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 1 lb per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(1.5)}
                style={{
                  border:
                    weeklyGoal === 1.5
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 1.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 1.5 lbs per week
              </button>
            </>
          )}
        </div>
      );
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataGoal = new FormData();

    formDataGoal.append("goal", goal);
    goal === "Maintain Weight"
      ? formDataGoal.append("lbs_per_week", 0)
      : formDataGoal.append("lbs_per_week", Math.abs(parseFloat(weeklyGoal)));
    formDataGoal.append("starting_weight", currentWeight);
    formDataGoal.append("target_weight", targetWeight);

    try {
      await dispatch(updateGoalThunk(formDataGoal));
      closeModal();
      history.replace("/my-home/diary");
    } catch (e) {
      const errors = await e.json();
      console.error(errors);
    }
  };

  return (
    <>
      <div>
        <div className="update-goal-form-container" style={{ borderRadius: "10px" }}>
          <h1 style={{ marginBottom: "25px" }}>Let's Update your Goal</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <label className="all-goals-container" style={{ height: "170px" }}>
              Goal
              <span style={{ marginBottom: "3px" }}></span>
              <div className="all-goals-choices">
                {["Lose Weight", "Maintain Weight", "Gain Weight"].map(
                  (value) => (
                    <button
                      className="signup-goal-button"
                      key={value}
                      type="button"
                      value={value}
                      onClick={() => handleGoalClick(value)}
                      style={{
                        height: "40px",
                        color: goal === value ? "rgb(0, 102, 238)" : "black",
                        border:
                          goal === value
                            ? "2px solid rgb(0, 102, 238)"
                            : "1px solid black",
                      }}
                    >
                      {value}
                    </button>
                  )
                )}
              </div>
            </label>
            {!goal ? (
              <div
                className="checking-if-goal"
                style={{ height: "10px", alignItems: "flex-end" }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "transparent",
                  }}
                >
                  Please select a goal before continuing
                </span>
              </div>
            ) : (
              <div className="checking-if-goal" style={{ height: "10px" }}>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "transparent",
                  }}
                >
                  Please select a goal before continuing
                </span>
              </div>
            )}
            <div className="user-weight-inputs-container">
              <label className="goal-form-labels">
                Current Weight:
                <input
                  type="number"
                  className="weight-inputs"
                  style={{ width: "68.5%" }}
                  value={currentWeight}
                  onChange={handleCurrentWeightChange}
                  max={900}
                  min={50}
                  disabled={goal === ""}
                ></input>
              </label>
              <label className="goal-form-labels" style={{ marginTop: "5px" }}>
                Target Weight:
                <input
                  type="number"
                  className="weight-inputs"
                  value={targetWeight}
                  onChange={handleTargetWeightChange}
                  disabled={!currentWeight}
                  min={40}
                />
              </label>
              {goalErrors ? (
                <div className="goal-errors">
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {goalErrors}
                  </p>
                </div>
              ) : (
                <div className="goal-errors">
                  <p style={{ color: "red" }}></p>
                </div>
              )}
            </div>
            <label className="weekly-goal-container">
              Weekly Goal:
              <div className="weekly-goal-choices">
                {renderWeeklyGoalButtons()}
              </div>
            </label>
            <div className="signup-submit-button-container" style={{marginTop: "15px"}}>
              <button type="submit" className={buttonStyle} disabled={disabled}>
                Update Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdatingGoalModal;
