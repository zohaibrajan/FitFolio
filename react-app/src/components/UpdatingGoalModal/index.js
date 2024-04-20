import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMultistepForm } from "../SignupFormPage/useMultistepForm";
import { updateGoalThunk } from "../../store/goal";
import { useModal } from "../../context/Modal";
import { AllGoals } from "./UpdatingGoalSteps";
import {
  WeeklyGoal,
  GetCurrentAndTargetWeight,
} from "../SignupFormPage/SignupFormSteps";

function UpdatingGoalModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();
  const [error, setError] = useState("");
  const goal = useSelector((state) => state.goal);
  const DATA = {
    goal: goal.goal,
    currentWeight: goal.startingWeight,
    targetWeight: goal.targetWeight,
    weeklyGoal: "",
  };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLastStep) return next();
    console.log(data);

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
    <div>
      <form onSubmit={handleSubmit}>
        {step}
        <div>
          <button type="button" onClick={isFirstStep ? closeModal : back}>
            BACK
          </button>
          <button type="submit">{isLastStep ? "CONFIRM" : "NEXT"}</button>
        </div>
      </form>
    </div>
  );
}

export default UpdatingGoalModal;
