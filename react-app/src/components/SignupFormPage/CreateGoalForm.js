import { FormWrapper } from "./FormWrapper";
import { useState } from "react";
import "./CreateGoalForm.css";

export function CreateGoalForm({ goal, firstName, updateData }) {
  const [isGoalSelected, setIsGoalSelected] = useState(false);

  const handleClick = (e) => {
    updateData({ goal: e.target.value });
    setIsGoalSelected(true);
  }

  return (
    <FormWrapper title={`Thanks ${firstName}! Now for your goals`} text="What is your primary goal?">
      <div className="all-goals-container">
        <div className="all-goals-choices">
          {["Lose Weight", "Maintain Weight", "Gain Weight"].map((value) => (
            <button
              className={`signup-goal-button ${goal === value ? "active" : ""}`}
              key={value}
              type="button"
              value={value}
              onClick={handleClick}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </FormWrapper>
  );
}
