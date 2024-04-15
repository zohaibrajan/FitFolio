import { formattingUserInputDate, gettingTodaysDate } from "../../../utils";
import { FormWrapper } from "./FormWrapper";
import "./CalculateCalories.css";

export function CalculateCalories({ updateData, gender, dob }) {
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
        <label className="goal-form-labels">
          When were you born?
          <input
            type="date"
            style={{ padding: "10px", width: "176px" }}
            max={maxDate}
            value={date}
            pattern="\d{4}-\d{2}-\d{2}"
            onChange={(e) => updateData({ dob: e.target.value })}
            required
          ></input>
        </label>
      </div>
    </FormWrapper>
  );
}
