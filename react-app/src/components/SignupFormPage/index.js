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
      setWeeklyGoal("set");
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
      return <span>Your Weekly Goal is to remain at your Current Weight</span>;
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
              <div>
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
              </div>
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
    formDataGoal.append("starting_weight", currentWeight);
    formDataGoal.append("target_weight", targetWeight);

    if (password === confirmPassword) {
      const data = await dispatch(signUp(formDataUser));
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
      <div className="signup-form-parent">
        <div className="signup-form-container">
          <h1 style={{ marginBottom: "25px" }}>Lets Create An Account</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label className="signup-form-labels">
              Goal
              <span style={{ marginBottom: "3px" }}></span>
              {["Lose Weight", "Maintain Weight", "Gain Weight"].map(
                (value) => (
                  <button
                    className="signup-goal-button"
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
                )
              )}
            </label>
            <div className="signup-form-sub-headers">
              <h3>Help us calculate your calories</h3>
              <span
                style={{
                  fontSize: "10px",
                  marginTop: "5px",
                  color: "darkgray",
                }}
              >
                We use this information to calculate an accurate calorie goal
                for you.
              </span>
            </div>
            <div className="signup-form-gender-container">
              Gender:
              <div className="signup-form-gender-choices">
                <label className="signup-form-labels-gender">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </label>
                <label className="signup-form-labels-gender">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </label>
              </div>
            </div>
            <label
              className="goal-form-labels"
              style={{ display: "flex", gap: "15px", marginTop: "5px" }}
            >
              Date of Birth
              <input
                type="date"
                style={{ padding: "10px" }}
                value={date}
                pattern="\d{4}-\d{2}-\d{2}"
                max={formattedDate}
                onChange={(e) => setDate(e.target.value)}
                required
              ></input>
            </label>
            <div className="height-labels-container">
              How tall are you?
              <div className="height-choices-in-signup-form">
                <label className="height-labels-in-form">
                  Height(ft):
                  <input
                    type="number"
                    className="height-inputs"
                    value={heightFt}
                    onChange={(e) => setHeightFt(e.target.value)}
                    max={7}
                    min={3}
                    required
                  ></input>
                </label>
                <label className="height-labels-in-form">
                  Height(in):
                  <input
                    type="number"
                    className="height-inputs"
                    value={heightIn}
                    onChange={(e) => setHeightIn(e.target.value)}
                    max={11}
                    min={0}
                    required
                  ></input>
                </label>
              </div>
            </div>
            {!goal ? (
              <div className="checking-if-goal">
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "rgb(0, 102, 238)",
                  }}
                >
                  Please select a goal before continuing
                </span>
              </div>
            ) : (
              <div className="checking-if-goal">
                <span></span>
              </div>
            )}
            <div className="user-weight-inputs-container">
              <label className="goal-form-labels">
                Current Weight:
                <input
                  type="number"
                  className="weight-inputs"
                  style={{ width: "68.5%" }}
                  value={currentWeight}
                  onChange={handleCurrentWeightChange}
                  max={900}
                  min={50}
                  disabled={goal === ""}
                  required
                ></input>
              </label>
              <label className="goal-form-labels" style={{ marginTop: "5px" }}>
                Target Weight:
                <input
                  type="number"
                  className="weight-inputs"
                  value={targetWeight}
                  onChange={handleTargetWeightChange}
                  disabled={!currentWeight}
                  min={40}
                  required
                />
                {goalErrors && <p style={{ color: "red" }}>{goalErrors}</p>}
              </label>
            </div>
            <label className="signup-form-labels">
              Weekly Goal:
              {renderWeeklyGoalButtons()}
            </label>
            <label className="signup-form-labels">
              Username
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="signup-form-labels">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="signup-form-labels">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label className="signup-form-labels">
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <div className="signup-submit-button-container">
              <button
                type="submit"
                className="signup-submit-button"
                disabled={goalErrors.length || weeklyGoal === ""}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignupFormPage;
