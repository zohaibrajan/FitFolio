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
        </div>
      </form>
    </div>
  );
}

export default UpdatingGoalModal;
