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

  const handleGoalClick = (clickedGoal) => {
    setGoal(clickedGoal);
    if (clickedGoal === "Lose Weight") {
      setWeeklyGoal(0)
      setTargetWeight("");
    } else if (clickedGoal === "Maintain Weight") {
      setWeeklyGoal('set')
      setTargetWeight(currentWeight);
    } else if (clickedGoal === "Gain Weight") {
      setWeeklyGoal(0);
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
      return <span>You have not selected a goal yet</span>;
    }
    if (goal === "Maintain Weight") {
      return <span>Your Weekly Goal to remain at your Current Weight</span>;
    } else {
      return (
        <div>
          {goal === "Lose Weight" && (
            <>
              <button
                type="button"
                onClick={() => setWeeklyGoal(-0.5)}
                style={{
                  border:
                    weeklyGoal === -0.5
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 0.5 lbs per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(-1)}
                style={{
                  border:
                    weeklyGoal === -1
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 1 lb per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(-1.5)}
                style={{
                  border:
                    weeklyGoal === -1.5
                      ? "1px solid rgb(0, 102, 238)"
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
                onClick={() => setWeeklyGoal(0.5)}
                style={{
                  border:
                    weeklyGoal === 0.5
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 0.5 lbs per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(1)}
                style={{
                  border:
                    weeklyGoal === 1
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 1 lb per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(1.5)}
                style={{
                  border:
                    weeklyGoal === 1.5
                      ? "1px solid rgb(0, 102, 238)"
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
    <div>
      <h1>Let's Change your goal</h1>
      <form className="updating-goal-form" onSubmit={handleSubmit}>
        <label>
          Goal
          {["Lose Weight", "Maintain Weight", "Gain Weight"].map((value) => (
            <button
              key={value}
              type="button"
              value={value}
              onClick={() => handleGoalClick(value)}
              style={{
                color: goal === value ? "rgb(0, 102, 238)" : "black",
                border:
                  goal === value
                    ? "2px solid rgb(0, 102, 238)"
                    : "1px solid black",
                backgroundColor: "white",
              }}
            >
              {value}
            </button>
          ))}
        </label>
        {!goal && <span>Please select a goal before continuing</span>}
        <label>
          Current Weight
          <input
            type="number"
            value={currentWeight}
            onChange={handleCurrentWeightChange}
            max={900}
            min={50}
            disabled={goal === ""}
            required
          ></input>
        </label>
        <label>
          Target Weight:
          <input
            type="number"
            value={targetWeight}
            onChange={handleTargetWeightChange}
            disabled={!currentWeight}
            min={40}
            required
          />
          {goalErrors && <p style={{ color: "red" }}>{goalErrors}</p>}
        </label>
        <label>
          Weekly Goal:
          {renderWeeklyGoalButtons()}
        </label>
        <button disabled={!targetWeight || goalErrors.length || weeklyGoal === 0} type="submit">Update Goal</button>
      </form>
    </div>
  );
}

export default UpdatingGoalModal;
