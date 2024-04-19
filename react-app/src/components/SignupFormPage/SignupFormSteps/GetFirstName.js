import { FormWrapper, FormInputAnimated } from "../../FormElements";

export function GetFirstName({ firstName, updateData }) {
  return (
    <FormWrapper
      title="Welcome to the FitFolio!"
      text="Let's get to know a little about you."
    >
      <FormInputAnimated
        text="First Name"
        label="firstName"
        value={firstName}
        updateData={updateData}
      />
    </FormWrapper>
  );
}
