import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { createGoalThunk } from "../../store/goal";
import "./SignupForm.css";

function SignupFormPage() {
  let today = new Date().getTime();
  today = new Date(today);
  const year = today.getFullYear();
  const month =
    today.getMonth() >= 10 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
  const day = today.getDate();
  const formattedDate =
    day >= 10 ? `${year}-${month}-${day}` : `${year}-${month}-0${day}`;
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
  const [isLoading, setIsLoading] = useState(false);
  const disabled =
    goalErrors.length || weeklyGoal === "" || targetWeight === "";
  const buttonStyle = disabled ? "disabled-button" : "signup-submit-button";

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
      return (
        <div className="checking-if-goal" style={{ height: "50px" }}>
          <span
            style={{
              fontWeight: "600",
              fontSize: "15px",
              color: "rgb(0, 102, 238)",
            }}
          >
            You have not selected a goal yet
          </span>
        </div>
      );
    }
    if (goal === "Maintain Weight") {
      return (
        <div className="checking-if-goal" style={{ height: "50px" }}>
          <span
            style={{
              fontWeight: "600",
              fontSize: "15px",
              color: "rgb(0, 102, 238)",
            }}
          >
            Your Weekly Goal is to remain at your Current Weight
          </span>
        </div>
      );
    } else {
      return (
        <div className="checking-if-goal-buttons">
          {goal === "Lose Weight" && (
            <>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(-0.5)}
                style={{
                  border:
                    weeklyGoal === -0.5
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 0.5 lbs per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(-1)}
                style={{
                  border:
                    weeklyGoal === -1
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === -1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Lose 1 lb per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(-1.5)}
                style={{
                  border:
                    weeklyGoal === -1.5
                      ? "2px solid rgb(0, 102, 238)"
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
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(0.5)}
                style={{
                  border:
                    weeklyGoal === 0.5
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 0.5 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 0.5 lbs per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(1)}
                style={{
                  border:
                    weeklyGoal === 1
                      ? "2px solid rgb(0, 102, 238)"
                      : "1px solid black",
                  color: weeklyGoal === 1 ? "rgb(0, 102, 238)" : "black",
                }}
              >
                Gain 1 lb per week
              </button>
              <button
                type="button"
                className="weekly-goal-buttons"
                onClick={() => setWeeklyGoal(1.5)}
                style={{
                  border:
                    weeklyGoal === 1.5
                      ? "2px solid rgb(0, 102, 238)"
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
      setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }
  };

  return (
    <>
      <div className="signup-form-parent">
        <div className="signup-form-container">
          <h1 style={{ marginBottom: "25px" }}>Lets Create An Account</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <label className="all-goals-container" style={{ height: "170px" }}>
              Goal
              <span style={{ marginBottom: "3px" }}></span>
              <div className="all-goals-choices">
                {["Lose Weight", "Maintain Weight", "Gain Weight"].map(
                  (value) => (
                    <button
                      className="signup-goal-button"
                      key={value}
                      type="button"
                      value={value}
                      onClick={() => handleGoalClick(value)}
                      style={{
                        height: "40px",
                        color: goal === value ? "rgb(0, 102, 238)" : "black",
                        border:
                          goal === value
                            ? "2px solid rgb(0, 102, 238)"
                            : "1px solid black",
                      }}
                    >
                      {value}
                    </button>
                  )
                )}
              </div>
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                minHeight: "10px",
                marginBottom: "12px",
                maxHeight: "10px",
              }}
            >
              {errors.gender ? (
                <span
                  style={{
                    fontSize: "10px",
                    color: "red",
                  }}
                >
                  {errors.gender}
                </span>
              ) : (
                <span style={{ fontSize: "8px", color: "transparent" }}></span>
              )}
            </div>
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
                max={formattedDate}
                onChange={(e) => setDate(e.target.value)}
                required
              ></input>
            </label>
            <div className="height-labels-container">
              <span>How tall are you?</span>
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
              <div
                className="checking-if-goal"
                style={{ height: "10px", alignItems: "flex-end" }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "transparent",
                  }}
                >
                  Please select a goal before continuing
                </span>
              </div>
            ) : (
              <div className="checking-if-goal" style={{ height: "10px" }}>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "12px",
                    color: "transparent",
                  }}
                >
                  Please select a goal before continuing
                </span>
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
                ></input>
              </label>
              <div
                style={{
                  minHeight: "10px",
                  marginBottom: "12px",
                  maxHeight: "10px",
                }}
              >
                {errors.current_weight_lbs ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "red",
                    }}
                  >
                    {errors.current_weight_lbs}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "8px", color: "transparent" }}
                  ></span>
                )}
              </div>
              <label className="goal-form-labels" style={{ marginTop: "5px" }}>
                Target Weight:
                <input
                  type="number"
                  className="weight-inputs"
                  value={targetWeight}
                  onChange={handleTargetWeightChange}
                  disabled={!currentWeight}
                  min={40}
                />
              </label>
              {goalErrors ? (
                <div className="goal-errors">
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {goalErrors}
                  </p>
                </div>
              ) : (
                <div className="goal-errors">
                  <p style={{ color: "red" }}></p>
                </div>
              )}
            </div>
            <label className="weekly-goal-container">
              Weekly Goal:
              <div className="weekly-goal-choices">
                {renderWeeklyGoalButtons()}
              </div>
            </label>
            <div className="user-info">
              <label className="signup-form-labels">
                Username
                <input
                  className="user-info-inputs"
                  type="text"
                  disabled={goal === ""}
                  minLength={6}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <div
                style={{
                  minHeight: "10px",
                  marginBottom: "12px",
                  maxHeight: "10px",
                }}
              >
                {errors.username ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "red",
                    }}
                  >
                    {errors.username}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "8px", color: "transparent" }}
                  ></span>
                )}
              </div>
              <label className="signup-form-labels">
                Email
                <input
                  type="email"
                  className="user-info-inputs"
                  disabled={goal === ""}
                  minLength={6}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <div
                style={{
                  minHeight: "10px",
                  marginBottom: "12px",
                  maxHeight: "10px",
                }}
              >
                {errors.email ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "red",
                    }}
                  >
                    {errors.email}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "8px", color: "transparent" }}
                  ></span>
                )}
              </div>
              <label className="signup-form-labels">
                Password
                <input
                  type="password"
                  className="user-info-inputs"
                  disabled={goal === ""}
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div
                style={{
                  minHeight: "10px",
                  marginBottom: "12px",
                  maxHeight: "10px",
                }}
              >
                {errors.password ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "red",
                    }}
                  >
                    {errors.password}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "8px", color: "transparent" }}
                  ></span>
                )}
              </div>
              <label className="signup-form-labels">
                Confirm Password
                <input
                  type="password"
                  className="user-info-inputs"
                  disabled={goal === ""}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
              <div
                style={{
                  minHeight: "10px",
                  marginBottom: "12px",
                  maxHeight: "10px",
                }}
              >
                {errors.confirmPassword ? (
                  <span
                    style={{
                      fontSize: "10px",
                      color: "red",
                    }}
                  >
                    {errors.confirmPassword}
                  </span>
                ) : (
                  <span
                    style={{ fontSize: "8px", color: "transparent" }}
                  ></span>
                )}
              </div>
            </div>
            <div className="signup-submit-button-container">
              <button type="submit" className={buttonStyle} disabled={disabled}>
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
