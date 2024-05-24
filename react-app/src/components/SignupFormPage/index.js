import React, { useState, useEffect } from "react";
import { useMultistepForm } from "./useMultistepForm"; // Custom React hook that manages the form steps
import {
  GetFirstName,
  CreateGoalForm,
  CalculateCalories,
  GetCurrentAndTargetWeight,
  WeeklyGoal,
  FinalStep,
} from "./SignupFormSteps";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { useHistory } from "react-router-dom";
import { createGoalThunk } from "../../store/goal";
import LoadingSpinner from "../LoadingSpinner";
import { getUsersGoalThunk } from "../../store/goal";
import "./SignupForm.css";
import {
  validateGenderSelection,
  validateGoalSelection,
  validateWeights,
  validateWeeklyGoal,
  validateUsernameAndPassword
} from "../../utils";

const DATA = {
  firstName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  goal: "",
  dob: "",
  gender: "",
  heightFt: "",
  heightIn: "",
  currentWeight: "",
  targetWeight: "",
  weeklyGoal: "",
};

function SignupFormPage() {
  const [data, setData] = useState(DATA);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sessionUser = useSelector((state) => state.session.user);
  const userGoal = useSelector((state) => state.goal);
  const history = useHistory();
  const dispatch = useDispatch();
  function updateData(fields) {
    setData((prev) => ({ ...prev, ...fields }));
  }

  const { step, steps, currentStepIndex, next, back, isLastStep, isFirstStep } =
    useMultistepForm([
      <GetFirstName {...data} updateData={updateData} />,
      <CreateGoalForm {...data} updateData={updateData} />,
      <CalculateCalories {...data} updateData={updateData} />,
      <GetCurrentAndTargetWeight {...data} updateData={updateData} />,
      <WeeklyGoal {...data} updateData={updateData} />,
      <FinalStep {...data} updateData={updateData} />,
    ]);

  useEffect(() => {
    setError("");
  }, [currentStepIndex]);

  useEffect(() => {
    if (sessionUser) {
      setIsLoading(true);
      dispatch(getUsersGoalThunk());
    }
  }, [dispatch, sessionUser]);

  if (sessionUser && userGoal.caloriesPerDay) {
    return <Redirect to="/my-home/diary" />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validators = [
      null, // No validator for the first step
      validateGoalSelection,
      validateGenderSelection,
      validateWeights,
      validateWeeklyGoal,
      validateUsernameAndPassword
    ];

    const validator = validators[currentStepIndex];
    if (validator) {
      const error = validator(data);

      if (error) {
        setError(error);
        return;
      }
    }
    let {
      email,
      username,
      password,
      goal,
      dob,
      gender,
      heightFt,
      heightIn,
      currentWeight,
      targetWeight,
      weeklyGoal,
    } = data;

    if (!isLastStep) return next();
    if (goal === "Maintain Weight") {
      targetWeight = currentWeight;
      weeklyGoal = 0;
    }

    const formDataUser = new FormData();
    const formDataGoal = new FormData();

    formDataUser.append("username", username);
    formDataUser.append("email", email);
    formDataUser.append("password", password);
    formDataUser.append("dob", dob);
    formDataUser.append("gender", gender);
    formDataUser.append("height_ft", heightFt);
    formDataUser.append("height_in", heightIn);
    formDataUser.append("current_weight_lbs", currentWeight);

    formDataGoal.append("goal", goal);
    formDataGoal.append("lbs_per_week", weeklyGoal);
    formDataGoal.append("starting_weight", currentWeight);
    formDataGoal.append("target_weight", targetWeight);

    setIsLoading(true);
    const signUpErrors = await dispatch(signUp(formDataUser));
    if (signUpErrors && signUpErrors.username) {
      setError(signUpErrors.username);
      setIsLoading(false);
    } else if (signUpErrors && signUpErrors.email){
      setError(signUpErrors.email);
      setIsLoading(false);
    } else {
      await dispatch(createGoalThunk(formDataGoal));
      setIsLoading(false);
      history.replace("/my-home/diary");
    }
  }

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="signup-form-parent">
          <form className="signup-form-container" onSubmit={handleSubmit}>
            <progress
              id="signup-progress"
              max={steps.length}
              value={currentStepIndex}
            />
            {step}
            {error && <div id="error-message">{error}</div>}
            <div className="signup-buttons-container">
              <button
                id="signup-back"
                type="button"
                onClick={(e) => {
                  if (isFirstStep) {
                    history.replace("/");
                    e.stopPropagation();
                  } else {
                    back();
                  }
                }}
              >
                BACK
              </button>
              <button id="signup-next" type="submit">
                {isLastStep ? "SIGN UP" : "NEXT"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupFormPage;
