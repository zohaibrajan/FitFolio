import { FormWrapper, FormInputAnimated } from "../../FormElements";
import "./GetCurrentAndTargetWeight.css";

export function GetCurrentAndTargetWeight({
  updateData,
  currentWeight,
  targetWeight,
  goal,
}) {

  const maintainWeight = goal === "Maintain Weight";
  if (maintainWeight) {
    targetWeight = currentWeight;
  }

  return (
    <FormWrapper
      title="Current and Target Weight"
      text="We need a few more details to help us calculate your calorie goal"
    >
      <div className="current-weight-input">
        <label className="weight-input-text-1">How much do you weigh?</label>
        <span className="weight-input-text-2">
          It's OK to estimate, you can change this later.
        </span>
        <FormInputAnimated
          type="number"
          min={"50"}
          max={"900"}
          width={"60%"}
          marginTop={"20px"}
          label="currentWeight"
          value={currentWeight}
          updateData={updateData}
          text="Current Weight (lbs)"
        />
      </div>
      <div className="target-weight-input">
        <label className="weight-input-text-1">What is your goal weight?</label>
        <span className="weight-input-text-2">
          Don't worry, you can change this later.
        </span>
        <FormInputAnimated
          disabled={maintainWeight}
          type="number"
          min={"50"}
          max={"900"}
          width={"60%"}
          marginTop={"20px"}
          label="targetWeight"
          value={targetWeight}
          updateData={updateData}
          text="Target Weight (lbs)"
        />
      </div>
    </FormWrapper>
  );
}
