import { FormWrapper } from "./FormWrapper";
import FormInputAnimated from "../../FormElements/FormInputAnimated";

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
      title="Current and Target weight"
      text="A few more details to help us calculate your calorie goal"
    >
      <div id="current-weight-input">
        <label>How much do you weigh?</label>
        <span>It's OK to estimate, you can change this later.</span>
        <FormInputAnimated
          type="number"
          min={"50"}
          max={"900"}
          label="currentWeight"
          value={currentWeight}
          updateData={updateData}
          text="Current Weight"
        />
      </div>
      <FormInputAnimated
        disabled={maintainWeight}
        type="number"
        label="targetWeight"
        value={targetWeight}
        updateData={updateData}
        text="Target Weight"
      />
    </FormWrapper>
  );
}
