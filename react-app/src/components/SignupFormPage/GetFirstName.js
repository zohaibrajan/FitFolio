import { FormWrapper } from "./FormWrapper";
import "./GetFirstName.css";


export function GetFirstName({ firstName, updateData }) {

  return (
    <FormWrapper
      title="Welcome to the FitFolio!"
      text="Let's get to know a little about you."
    >
      <div className="input-container">
        <input
          required
          type="text"
          className="input-field"
          placeholder=" "
          value={firstName}
          onChange={(e) => updateData({ firstName: e.target.value })}
        />
        <label className="input-label">First Name</label>
      </div>
    </FormWrapper>
  );
}
