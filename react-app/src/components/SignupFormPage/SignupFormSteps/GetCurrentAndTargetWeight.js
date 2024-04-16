import { FormWrapper } from "./FormWrapper";
import FormInputAnimated from "../../FormElements/FormInputAnimated";

export function GetCurrentAndTargetWeight({
  updateData,
  currentWeight,
  targetWeight,
  goal
}) {
    const maintainWeight = goal === "Maintain Weight";
    if (maintainWeight) {
        targetWeight = currentWeight;
    }
  return (
    <FormWrapper
      title="Current and Target weight"
      text="We use this information to calculate your daily calorie goal."
    >
      <FormInputAnimated
        type="number"
        min={"50"}
        max={"900"}
        label="currentWeight"
        value={currentWeight}
        updateData={updateData}
        text="Current Weight"
      />
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
