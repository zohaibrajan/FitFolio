import { formattingUserInputDate, gettingTodaysDate } from "../../../utils";
import { FormWrapper } from "./FormWrapper";
import FormInputAnimated from "../../FormElements/FormInputAnimated";
import "./CalculateCalories.css";

export function CalculateCalories({
  updateData,
  gender,
  dob,
  heightFt,
  heightIn,
}) {
  const maxDate = gettingTodaysDate();
  const date = formattingUserInputDate(dob);
  return (
    <FormWrapper
      title="Help us calculate your calories"
      text="We use this information to calculate an accurate calorie goal for you."
    >
      <span id="gender">Gender</span>
      <div className="gender-choices">
        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={gender === "Female"}
            onChange={(e) => updateData({ gender: e.target.value })}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={gender === "Male"}
            onChange={(e) => updateData({ gender: e.target.value })}
          />
          Male
        </label>
      </div>
      <div>
        <label id="goal-form-label">
          When were you born?
          <input
            type="date"
            id="date-input"
            max={maxDate}
            value={date}
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={(e) => updateData({ dob: e.target.value })}
            required
          ></input>
        </label>
      </div>
      <div style={{ marginTop: "25px" }}></div>
      <label id="height">Height</label>
      <div className="height-input-container">
        <FormInputAnimated
          text="Height (ft)"
          label="heightFt"
          width={"40%"}
          marginTop={"10px"}
          value={heightFt}
          updateData={updateData}
        />
        <FormInputAnimated
          text="Height (in)"
          label="heightIn"
          width={"40%"}
          marginTop={"10px"}
          value={heightIn}
          updateData={updateData}
        />
      </div>
    </FormWrapper>
  );
}
