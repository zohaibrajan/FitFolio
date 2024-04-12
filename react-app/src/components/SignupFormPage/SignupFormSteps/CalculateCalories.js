import { FormWrapper } from "./FormWrapper";

export function CalculateCalories({ updateData, gender, dob }) {
  const date = new Date()
  return (
    <FormWrapper
      title="Help us calculate your calories"
      text="We use this information to calculate an accurate calorie goal for you."
    >
      <div className="signup-form-gender-choices">
        <label className="signup-form-labels-gender">
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={gender === "Female"}
            onChange={(e) => updateData({ gender: e.target.value })}
          />
          Female
        </label>
        <label className="signup-form-labels-gender">
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={gender === "Male"}
            onChange={(e) => updateData({ gender: e.target.value })}
          />
          Male
        </label>
        <label
          className="goal-form-labels"
          style={{
            display: "flex",
            marginTop: "5px",
            flexDirection: "column",
          }}
        >
          Date of Birth
          <input
            type="date"
            style={{ padding: "10px", width: "176px" }}
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
