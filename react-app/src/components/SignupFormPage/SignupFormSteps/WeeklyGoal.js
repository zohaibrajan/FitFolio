import { FormWrapper } from "./FormWrapper";

export function WeeklyGoal({ goal, weeklyGoal, updateData }) {
    const maintainWeight = goal === "Maintain Weight";

    const goalText = goal === "Lose Weight" ? "Lose" : "Gain"
    const goalValues = {
      [`${goalText} 0.5 lbs per week`]: 0.5,
      [`${goalText} 1 lb per week`]: 1,
      [`${goalText} 1.5 lbs per week`]: 1.5,
    };
  return (
    <>
      {maintainWeight ? (
        <FormWrapper title="Congratulations!">
          <span>
            You're one step closer to achieving your fitness goals. Lets create
            your account!!
          </span>
        </FormWrapper>
      ) : (
        <FormWrapper
          title="Weekly Goal"
          text="Let's break down your health goal into a weekly one you can maintain"
        >
          <div className="all-goals-container">
            <div className="all-goals-choices">
              {Object.entries(goalValues).map(([text, value]) => (
                <button
                  className={`signup-goal-button ${
                    weeklyGoal === value ? "active" : ""
                  }`}
                  key={text}
                  type="button"
                  value={value}
                  onClick={() => updateData({ weeklyGoal: value })}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </FormWrapper>
      )}
    </>
  );
}
