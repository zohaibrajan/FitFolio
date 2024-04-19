import { useState } from "react";
import { useMultistepForm } from "../SignupFormPage/useMultistepForm";
import { useSelector } from "react-redux";

function UpdatingGoalModal() {
  const goal = useSelector((state) => state.goal);
  const DATA = {
    goal: goal.goal,
    weeklyGoal: goal.weeklyGoal,
    startingWeight: goal.startingWeight,
    targetWeight: goal.targetWeight,
    lbsPerWeek: goal.lbsPerWeek,
  }
  const [data, setData] = useState(DATA);

  
  return (
    <div>
      <form>
        <div>
          <button></button>
          <button></button>
        </div>
      </form>
    </div>
  );
}

export default UpdatingGoalModal;
