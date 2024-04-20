import { useState } from "react";
import { useSelector } from "react-redux";
import { useMultistepForm } from "../SignupFormPage/useMultistepForm";
import { AllGoals } from "./UpdatingGoalSteps/AllGoals";

function UpdatingGoalModal() {
  const goal = useSelector((state) => state.goal);
  const DATA = {
    goal: goal.goal,
    startingWeight: goal.startingWeight,
    targetWeight: goal.targetWeight,
    lbsPerWeek: goal.lbsPerWeek,
  }
  const updateData = (fields) => {
    setData((prev) => ({ ...prev, ...fields }));
  };
  const [data, setData] = useState(DATA);
  console.log(data);
  const { step, next, back, isLastStep } =
    useMultistepForm([
      <AllGoals {...data} updateData={updateData}/>
    ]);

  return (
    <div>
      <form>
        {step}
        <div>
          <button onClick={back}>BACK</button>
          <button onClick={next}>{isLastStep ? "CONFIRM" : "NEXT"}</button>
        </div>
      </form>
    </div>
  );
}

export default UpdatingGoalModal;
