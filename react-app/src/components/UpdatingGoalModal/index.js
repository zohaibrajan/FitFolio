import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMultistepForm } from "../SignupFormPage/useMultistepForm";
import { updateGoalThunk } from "../../store/goal";
import { useModal } from "../../context/Modal";
import { AllGoals } from "./UpdatingGoalSteps";
import { validateWeeklyGoal, validateWeights } from "../../utils";
import {
  WeeklyGoal,
  GetCurrentAndTargetWeight,
} from "../SignupFormPage/SignupFormSteps";
import "./UpdatingGoalModal.css";

function UpdatingGoalModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { closeModal } = useModal();
  const [error, setError] = useState("");
  const goal = useSelector((state) => state.goal);
  const DATA = {
    goal: goal.goal,
    currentWeight: goal.startingWeight,
    targetWeight: goal.targetWeight,
    // Weekly goal is intentionally left blank to be filled in by user
    weeklyGoal: "",
  }
  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };
  const [data, setData] = useState(DATA);
  const { step, next, back, isLastStep, isFirstStep, currentStepIndex } =
    useMultistepForm([
      <AllGoals {...data} updateData={updateData} />,
      <WeeklyGoal {...data} updateData={updateData} />,
      <GetCurrentAndTargetWeight {...data} updateData={updateData} />,
    ]);

  useEffect(() => {
    setError("");
  }, [currentStepIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validators = [null, validateWeeklyGoal, validateWeights];
    const validator = validators[currentStepIndex];
    if (validator && validator(data)) {
      setError(validator(data));
      return;
    }

    if (!isLastStep) return next();

    let { goal, currentWeight, targetWeight, weeklyGoal } = data;
    if (goal === "Maintain Weight") {
      targetWeight = currentWeight;
      weeklyGoal = 0;
    }

    const formDataGoal = new FormData();
    formDataGoal.append("goal", goal);
    formDataGoal.append("lbs_per_week", weeklyGoal);
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
<<<<<<< HEAD
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
=======
    <div className="update-goal-form-parent">
      <form className="update-goal-form-container" onSubmit={handleSubmit}>
        {step}
        {error && <div id="error-message">{error}</div>}
        <div className="update-goal-buttons-container">
          <button
            id="update-goal-form-back"
            type="button"
            onClick={isFirstStep ? closeModal : back}
          >
            BACK
          </button>
          <button id="update-goal-form-next" type="submit">
            {isLastStep ? "CONFIRM" : "NEXT"}
          </button>
>>>>>>> refactor
        </div>
      </form>
    </div>
  );
}

export default UpdatingGoalModal;
