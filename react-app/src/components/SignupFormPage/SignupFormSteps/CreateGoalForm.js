import { FormWrapper } from "../../FormElements";
import "./CreateGoalForm.css";

export function CreateGoalForm({ goal, firstName, updateData }) {
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
              onClick={(e) => updateData({ goal: e.target.value })}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </FormWrapper>
  );
}
