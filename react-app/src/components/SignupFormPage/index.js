import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { createGoalThunk } from "../../store/goal";
import "./SignupForm.css";

function SignupFormPage() {
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [goal, setGoal] = useState("");
  const [gender, setGender] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [goalErrors, setGoalErrors] = useState("");
  const [weeklyGoal, setWeeklyGoal] = useState("");
  const [date, setDate] = useState("");

  if (sessionUser) return <Redirect to="/my-home/diary" />;

  const handleGoalClick = (clickedGoal) => {
    setGoal(clickedGoal);
    if (clickedGoal === "Lose Weight") {
      setTargetWeight("");
    } else if (clickedGoal === "Maintain Weight") {
      setTargetWeight(currentWeight);
    } else if (clickedGoal === "Gain Weight") {
      setTargetWeight("");
    }

    setGoalErrors("");
  };

  const handleCurrentWeightChange = (e) => {
    const newCurrentWeight = e.target.value;
    setCurrentWeight(newCurrentWeight);
    setTargetWeight("");
    setGoalErrors("");
  };

  const handleTargetWeightChange = (e) => {
    const newTargetWeight = e.target.value;
    setTargetWeight(newTargetWeight);

    if (
      (goal === "Lose Weight" &&
        newTargetWeight !== "" &&
        parseFloat(newTargetWeight) >= parseFloat(currentWeight)) ||
      (goal === "Maintain Weight" &&
        newTargetWeight !== "" &&
        parseFloat(newTargetWeight) !== parseFloat(currentWeight)) ||
      (goal === "Gain Weight" &&
        newTargetWeight !== "" &&
        parseFloat(newTargetWeight) <= parseFloat(currentWeight))
    ) {
      setGoalErrors(`Invalid target weight for ${goal} goal.`);
    } else {
      setGoalErrors("");
      setTargetWeight(newTargetWeight);
    }
  };

  const renderWeeklyGoalButtons = () => {
    if (!goal) {
      return <span>You have not selected a goal yet</span>;
    }
    if (goal === "Maintain Weight") {
      return <span>Your Weekly Goal to remain at your Current Weight</span>;
    } else {
      return (
        <div>
          {goal === "Lose Weight" && (
            <>
              <button
                type="button"
                onClick={() => setWeeklyGoal(-0.5)}
                style={{
                  border:
                    weeklyGoal === -0.5
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 0.5 lbs per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(-1)}
                style={{
                  border:
                    weeklyGoal === -1
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 1 lb per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(-1.5)}
                style={{
                  border:
                    weeklyGoal === -1.5
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -1.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 1.5 lbs per week
              </button>
            </>
          )}
          {goal === "Gain Weight" && (
            <>
              <button
                type="button"
                onClick={() => setWeeklyGoal(0.5)}
                style={{
                  border:
                    weeklyGoal === 0.5
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 0.5 lbs per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(1)}
                style={{
                  border:
                    weeklyGoal === 1
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 1 lb per week
              </button>
              <button
                type="button"
                onClick={() => setWeeklyGoal(1.5)}
                style={{
                  border:
                    weeklyGoal === 1.5
                      ? "1px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 1.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 1.5 lbs per week
              </button>
            </>
          )}
        </div>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changeToDate = new Date(date);
    const correctFormatForDate = changeToDate.toISOString().slice(0, 10);

    const formDataUser = new FormData();
    const formDataGoal = new FormData();

    formDataUser.append("username", username);
    formDataUser.append("email", email);
    formDataUser.append("password", password);
    formDataUser.append("dob", correctFormatForDate);
    formDataUser.append("gender", gender);
    formDataUser.append("height_ft", heightFt);
    formDataUser.append("height_in", heightIn);
    formDataUser.append("current_weight_lbs", currentWeight);

    formDataGoal.append("goal", goal);
    goal === "Maintain Weight"
      ? formDataGoal.append("lbs_per_week", 0)
      : formDataGoal.append("lbs_per_week", Math.abs(parseFloat(weeklyGoal)));
    formDataGoal.append("starting_weight", currentWeight)
    formDataGoal.append("target_weight", targetWeight)

    if (password === confirmPassword) {
      const data = await dispatch(signUp(formDataUser))
      if (data) {
        setErrors(data);
      } else {
        await dispatch(createGoalThunk(formDataGoal));
      }
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  return (
    <>
      <h1>Lets Create An Account</h1>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Goal
          {["Lose Weight", "Maintain Weight", "Gain Weight"].map((value) => (
            <button
              key={value}
              type="button"
              value={value}
              onClick={() => handleGoalClick(value)}
              style={{
                color: goal === value ? "rgb(0, 102, 238)" : "black",
                border:
                  goal === value
                    ? "2px solid rgb(0, 102, 238)"
                    : "1px solid black",
                backgroundColor: "white",
              }}
            >
              {value}
            </button>
          ))}
        </label>
        <h3>Help us calculate your calories</h3>
        <span>Gender</span>
        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={gender === "Female"}
            onChange={(e) => setGender(e.target.value)}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={gender === "Male"}
            onChange={(e) => setGender(e.target.value)}
          />
          Male
        </label>
        <label>
          Date of Birth
          <input
            type="date"
            value={date}
            pattern="\d{4}-\d{2}-\d{2}"
            max={formattedDate}
            onChange={(e) => setDate(e.target.value)}
            required
          ></input>
        </label>
        <span>How tall are you?</span>
        <label>
          Height(ft)
          <input
            type="number"
            value={heightFt}
            onChange={(e) => setHeightFt(e.target.value)}
            max={7}
            min={3}
            required
          ></input>
        </label>
        <label>
          Height(in)
          <input
            type="number"
            value={heightIn}
            onChange={(e) => setHeightIn(e.target.value)}
            max={11}
            min={0}
            required
          ></input>
        </label>
        {!goal && <span>Please select a goal before continuing</span>}
        <label>
          Current Weight
          <input
            type="number"
            value={currentWeight}
            onChange={handleCurrentWeightChange}
            max={900}
            min={50}
            disabled={goal === ""}
            required
          ></input>
        </label>
        <label>
          Target Weight:
          <input
            type="number"
            value={targetWeight}
            onChange={handleTargetWeightChange}
            disabled={!currentWeight}
            min={40}
            required
          />
          {goalErrors && <p style={{ color: "red" }}>{goalErrors}</p>}
        </label>
        <label>
          Weekly Goal:
          {renderWeeklyGoalButtons()}
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={goalErrors.length}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormPage;
