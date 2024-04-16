import React, { useState, useEffect } from "react";
import { useMultistepForm } from "./useMultistepForm";
import {
  GetFirstName,
  CreateGoalForm,
  CalculateCalories,
  GetCurrentAndTargetWeight,
  WeeklyGoal,
} from "./SignupFormSteps";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import { useHistory } from "react-router-dom";
import { createGoalThunk } from "../../store/goal";
import { TailSpin } from "react-loader-spinner";
import { getUsersGoalThunk } from "../../store/goal";
import "./SignupForm.css";
import {
  validateGenderSelection,
  validateGoalSelection,
  validateWeights,
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
  function updateData(fields) {
    setData((prev) => ({ ...prev, ...fields }));
  }
  const stepsComponents = [
    <GetFirstName {...data} updateData={updateData} />,
    <CreateGoalForm {...data} updateData={updateData} />,
    <CalculateCalories {...data} updateData={updateData} />,
    <GetCurrentAndTargetWeight {...data} updateData={updateData} />,
    <WeeklyGoal {...data} updateData={updateData} />,
    <span>h1</span>,
  ];

  const {
    step,
    steps,
    currentStepIndex,
    next,
    back,
    goTo,
    isLastStep,
    isFirstStep,
  } = useMultistepForm(stepsComponents);

  useEffect(() => {
    setError("");
  }, [currentStepIndex]);

  function handleSubmit(e) {
    e.preventDefault();
    const validators = [
      null, // No validator for the first step
      validateGoalSelection,
      validateGenderSelection,
      validateWeights,
    ];

    const validator = validators[currentStepIndex];
    if (validator) {
      const error = validator(data);

      if (error) {
        setError(error);
        return;
      }
    }

    if (!isLastStep) return next();
    console.log(data);
  }

  return (
    <div className="signup-form-parent">
      <form className="signup-form-container" onSubmit={handleSubmit}>
        <progress
          id="signup-progress"
          max={steps.length}
          value={currentStepIndex}
        />
        {step}
        {error && <div>{error}</div>}
        <div>
          <button type="button" onClick={back}>
            Back
          </button>
          <button type="submit">{isLastStep ? "Sign Up" : "Next"}</button>
        </div>
      </form>
    </div>
  );

  //   let today = new Date().getTime();
  //   today = new Date(today);
  //   const year = today.getFullYear();
  //   const history = useHistory();
  //   const month =
  //     today.getMonth() >= 10 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
  //   const day = today.getDate();
  //   const formattedDate =
  //     day >= 10 ? `${year}-${month}-${day}` : `${year}-${month}-0${day}`;
  //   const dispatch = useDispatch();
  //   const sessionUser = useSelector((state) => state.session.user);
  //   const userGoal = useSelector((state) => state.goal);
  //   const [email, setEmail] = useState("");
  //   const [username, setUsername] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [confirmPassword, setConfirmPassword] = useState("");
  //   const [heightError, setHeightError] = useState({
  //     feet: "",
  //     inches: "",
  //   });
  //   const [errors, setErrors] = useState({
  //     gender: "",
  //     username: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     current_weight_lbs: "",
  //     dob: "",
  //   });
  //   const [goal, setGoal] = useState("");
  //   const [gender, setGender] = useState("");
  //   const [heightFt, setHeightFt] = useState("");
  //   const [heightIn, setHeightIn] = useState("");
  //   const [currentWeight, setCurrentWeight] = useState("");
  //   const [targetWeight, setTargetWeight] = useState("");
  //   const [goalErrors, setGoalErrors] = useState("");
  //   const [weeklyGoal, setWeeklyGoal] = useState("");
  //   const [date, setDate] = useState("");
  //   const [isLoading, setIsLoading] = useState(false);
  //   const disabled =
  //     goalErrors.length ||
  //     weeklyGoal === "" ||
  //     targetWeight === "" ||
  //     gender === "" ||
  //     Object.values(errors).some((error) => error.length) ||
  //     heightError.feet ||
  //     heightError.inches ||
  //     username === "" ||
  //     email === "" ||
  //     password === "" ||
  //     confirmPassword === "";
  //   const buttonStyle = disabled ? "disabled-button" : "signup-submit-button";

  //   useEffect(() => {
  //     if (sessionUser) {
  //       setIsLoading(true);
  //       dispatch(getUsersGoalThunk());
  //     }
  //   }, [dispatch, sessionUser]);

  //   if (sessionUser && userGoal.caloriesPerDay) {
  //     return <Redirect to="/my-home/diary" />;
  //   }

  //   const handleGoalClick = (clickedGoal) => {
  //     setGoal(clickedGoal);
  //     if (clickedGoal === "Lose Weight") {
  //       setTargetWeight("");
  //     } else if (clickedGoal === "Maintain Weight") {
  //       setWeeklyGoal("set");
  //       setTargetWeight(currentWeight);
  //     } else if (clickedGoal === "Gain Weight") {
  //       setTargetWeight("");
  //     }

  //     setGoalErrors("");
  //   };

  //   const handleCurrentWeightChange = (e) => {
  //     const newCurrentWeight = e.target.value;
  //     setCurrentWeight(newCurrentWeight);
  //     setTargetWeight("");
  //     setGoalErrors("");

  //     if (goal === "Maintain Weight") {
  //       setTargetWeight(e.target.value);
  //     }
  //   };

  //   const handleTargetWeightChange = (e) => {
  //     const newTargetWeight = e.target.value;

  //     if (
  //       (goal === "Lose Weight" &&
  //         newTargetWeight !== "" &&
  //         parseFloat(newTargetWeight) >= parseFloat(currentWeight)) ||
  //       (goal === "Maintain Weight" &&
  //         newTargetWeight !== "" &&
  //         parseFloat(newTargetWeight) !== parseFloat(currentWeight)) ||
  //       (goal === "Gain Weight" &&
  //         newTargetWeight !== "" &&
  //         parseFloat(newTargetWeight) <= parseFloat(currentWeight))
  //     ) {
  //       setGoalErrors(`Invalid target weight for ${goal} goal.`);
  //     } else if (newTargetWeight < 40) {
  //       setGoalErrors("Invalid target weight. Must be at least 40 lb.");
  //     } else {
  //       setGoalErrors("");
  //     }
  //   };

  //   const renderWeeklyGoalButtons = () => {
  //     if (!goal) {
  //       return (
  //         <div className="checking-if-goal" style={{ height: "50px" }}>
  //           <span
  //             style={{
  //               fontWeight: "600",
  //               fontSize: "15px",
  //               color: "rgb(0, 102, 238)",
  //             }}
  //           >
  //             You have not selected a goal yet
  //           </span>
  //         </div>
  //       );
  //     }
  //     if (goalErrors.length) {
  //       return (
  //         <div className="checking-if-goal" style={{ height: "50px" }}>
  //           <span
  //             style={{
  //               fontWeight: "600",
  //               fontSize: "15px",
  //               color: "rgb(0, 102, 238)",
  //             }}
  //           >
  //             Please correct the errors above
  //           </span>
  //         </div>
  //       );
  //     }
  //     if (goal === "Maintain Weight") {
  //       return (
  //         <div className="checking-if-goal" style={{ height: "50px" }}>
  //           <span
  //             style={{
  //               fontWeight: "600",
  //               fontSize: "15px",
  //               color: "rgb(0, 102, 238)",
  //             }}
  //           >
  //             Your Weekly Goal is to remain at your Current Weight
  //           </span>
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div className="checking-if-goal-buttons">
  //           {goal === "Lose Weight" && (
  //             <>
  //               <button
  //                 type="button"
  //                 className="weekly-goal-buttons"
  //                 onClick={() => setWeeklyGoal(-0.5)}
  //                 style={{
  //                   border:
  //                     weeklyGoal === -0.5
  //                       ? "2px solid rgb(0, 102, 238)"
  //                       : "1px solid black",
  //                   color: weeklyGoal === -0.5 ? "rgb(0, 102, 238)" : "black",
  //                 }}
  //               >
  //                 Lose 0.5 lbs per week
  //               </button>
  //               <button
  //                 type="button"
  //                 className="weekly-goal-buttons"
  //                 onClick={() => setWeeklyGoal(-1)}
  //                 style={{
  //                   border:
  //                     weeklyGoal === -1
  //                       ? "2px solid rgb(0, 102, 238)"
  //                       : "1px solid black",
  //                   color: weeklyGoal === -1 ? "rgb(0, 102, 238)" : "black",
  //                 }}
  //               >
  //                 Lose 1 lb per week
  //               </button>
  //               <button
  //                 type="button"
  //                 className="weekly-goal-buttons"
  //                 onClick={() => setWeeklyGoal(-1.5)}
  //                 style={{
  //                   border:
  //                     weeklyGoal === -1.5
  //                       ? "2px solid rgb(0, 102, 238)"
  //                       : "1px solid black",
  //                   color: weeklyGoal === -1.5 ? "rgb(0, 102, 238)" : "black",
  //                 }}
  //               >
  //                 Lose 1.5 lbs per week
  //               </button>
  //             </>
  //           )}
  //           {goal === "Gain Weight" && (
  //             <>
  //               <button
  //                 type="button"
  //                 className="weekly-goal-buttons"
  //                 onClick={() => setWeeklyGoal(0.5)}
  //                 style={{
  //                   border:
  //                     weeklyGoal === 0.5
  //                       ? "2px solid rgb(0, 102, 238)"
  //                       : "1px solid black",
  //                   color: weeklyGoal === 0.5 ? "rgb(0, 102, 238)" : "black",
  //                 }}
  //               >
  //                 Gain 0.5 lbs per week
  //               </button>
  //               <button
  //                 type="button"
  //                 className="weekly-goal-buttons"
  //                 onClick={() => setWeeklyGoal(1)}
  //                 style={{
  //                   border:
  //                     weeklyGoal === 1
  //                       ? "2px solid rgb(0, 102, 238)"
  //                       : "1px solid black",
  //                   color: weeklyGoal === 1 ? "rgb(0, 102, 238)" : "black",
  //                 }}
  //               >
  //                 Gain 1 lb per week
  //               </button>
  //               <button
  //                 type="button"
  //                 className="weekly-goal-buttons"
  //                 onClick={() => setWeeklyGoal(1.5)}
  //                 style={{
  //                   border:
  //                     weeklyGoal === 1.5
  //                       ? "2px solid rgb(0, 102, 238)"
  //                       : "1px solid black",
  //                   color: weeklyGoal === 1.5 ? "rgb(0, 102, 238)" : "black",
  //                 }}
  //               >
  //                 Gain 1.5 lbs per week
  //               </button>
  //             </>
  //           )}
  //         </div>
  //       );
  //     }
  //   };

  //   const checkDate = (date) => {
  //     console.log(date);
  //     console.log('-', formattedDate);
  //     if (date === formattedDate) {
  //       setErrors({ ...errors, dob: "Please enter a valid date" });
  //     }
  //   };

  //   const checkUsername = (username) => {
  //     if (username.length < 6) {
  //       setErrors({
  //         ...errors,
  //         username: "Username must be at least 6 characters long",
  //       });
  //     } else if (username.length > 50) {
  //       setErrors({
  //         ...errors,
  //         username: "Username must be less than 50 characters",
  //       });
  //     }
  //   };

  //   const checkEmail = (email) => {
  //     if (email.length > 50) {
  //       setErrors({
  //         ...errors,
  //         email: "Email address must be less than 50 characters.",
  //       });
  //     }

  //     const emailRegex = new RegExp(
  //       "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
  //     );
  //     const isValid = emailRegex.test(email);
  //     if (!isValid) {
  //       setErrors({ ...errors, email: "Please enter a valid email address." });
  //     }
  //   };

  //   const checkPassword = (password) => {
  //     if (password.length > 50) {
  //       setErrors({
  //         ...errors,
  //         password: "Password must be less than 50 characters.",
  //       });
  //     } else if (password.length < 6) {
  //       setErrors({
  //         ...errors,
  //         password: "Password must be at least 6 characters long",
  //       });
  //     }
  //   };

  //   const checkHeightFt = (heightFt) => {
  //     if (heightFt < 3 || heightFt > 7) {
  //       setHeightError({
  //         ...heightError,
  //         feet: "Height must be between 3 and 7 feet",
  //       });
  //     }
  //   };

  //   const checkHeightIn = (heightIn) => {
  //     if (heightIn < 0 || heightIn > 11) {
  //       setHeightError({
  //         ...heightError,
  //         inches: "Height must be between 0 and 11 inches",
  //       });
  //     }
  //   };

  //   const checkCurrentWeight = (currentWeight) => {
  //     if (currentWeight < 50 || currentWeight > 900) {
  //       setErrors({
  //         ...errors,
  //         current_weight_lbs: "Invalid weight. Must be between 50 and 900 lb",
  //       });
  //     }
  //   };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const changeToDate = new Date(date);
  //     const correctFormatForDate = changeToDate.toISOString().slice(0, 10);

  //     const formDataUser = new FormData();
  //     const formDataGoal = new FormData();

  //     formDataUser.append("username", username);
  //     formDataUser.append("email", email);
  //     formDataUser.append("password", password);
  //     formDataUser.append("dob", correctFormatForDate);
  //     formDataUser.append("gender", gender);
  //     formDataUser.append("height_ft", heightFt);
  //     formDataUser.append("height_in", heightIn);
  //     formDataUser.append("current_weight_lbs", currentWeight);

  //     formDataGoal.append("goal", goal);
  //     goal === "Maintain Weight"
  //       ? formDataGoal.append("lbs_per_week", 0)
  //       : formDataGoal.append("lbs_per_week", Math.abs(parseFloat(weeklyGoal)));
  //     formDataGoal.append("starting_weight", currentWeight);
  //     formDataGoal.append("target_weight", targetWeight);

  //     if (password === confirmPassword) {
  //       setIsLoading(true);
  //       const data = await dispatch(signUp(formDataUser));
  //       if (data) {
  //         setErrors(data);
  //         setIsLoading(false);
  //       } else {
  //         await dispatch(createGoalThunk(formDataGoal));
  //         setIsLoading(false);
  //         history.replace("/my-home/diary");
  //       }
  //     } else {
  //       setErrors({
  //         ...errors,
  //         confirmPassword:
  //           "Confirm Password field must be the same as the Password field",
  //       });
  //     }
  //   };

  //   return (
  //     <>
  //       {isLoading ? (
  //         <div className="loading-spinner">
  //           <TailSpin
  //             visible={true}
  //             height="80"
  //             width="80"
  //             color="rgb(0, 102, 238)"
  //             ariaLabel="tail-spin-loading"
  //             radius="1"
  //             wrapperStyle={{}}
  //             wrapperClass=""
  //           />
  //         </div>
  //       ) : (
  //         <div className="signup-form-parent">
  //           <div className="signup-form-container">
  //             <h1 style={{ marginBottom: "25px" }}>Lets Create An Account</h1>
  //             <form onSubmit={handleSubmit} className="signup-form">
  //               <label
  //                 className="all-goals-container"
  //                 style={{ height: "170px" }}
  //               >
  //                 Goal
  //                 <span style={{ marginBottom: "3px" }}></span>
  //                 <div className="all-goals-choices">
  //                   {["Lose Weight", "Maintain Weight", "Gain Weight"].map(
  //                     (value) => (
  //                       <button
  //                         className="signup-goal-button"
  //                         key={value}
  //                         type="button"
  //                         value={value}
  //                         onClick={() => handleGoalClick(value)}
  //                         style={{
  //                           height: "40px",
  //                           color: goal === value ? "rgb(0, 102, 238)" : "black",
  //                           border:
  //                             goal === value
  //                               ? "2px solid rgb(0, 102, 238)"
  //                               : "1px solid black",
  //                         }}
  //                       >
  //                         {value}
  //                       </button>
  //                     )
  //                   )}
  //                 </div>
  //               </label>
  //               <div className="signup-form-sub-headers">
  //                 <h3>Help us calculate your calories</h3>
  //                 <span
  //                   style={{
  //                     fontSize: "10px",
  //                     marginTop: "5px",
  //                     color: "darkgray",
  //                   }}
  //                 >
  //                   We use this information to calculate an accurate calorie goal
  //                   for you.
  //                 </span>
  //               </div>
  //               <div className="signup-form-gender-container">
  //                 Gender:
  //                 <div className="signup-form-gender-choices">
  //                   <label className="signup-form-labels-gender">
  //                     <input
  //                       type="radio"
  //                       name="gender"
  //                       value="Female"
  //                       checked={gender === "Female"}
  //                       onChange={(e) => setGender(e.target.value)}
  //                     />
  //                     Female
  //                   </label>
  //                   <label className="signup-form-labels-gender">
  //                     <input
  //                       type="radio"
  //                       name="gender"
  //                       value="Male"
  //                       checked={gender === "Male"}
  //                       onChange={(e) => setGender(e.target.value)}
  //                     />
  //                     Male
  //                   </label>
  //                 </div>
  //               </div>
  //               <div
  //                 style={{
  //                   display: "flex",
  //                   justifyContent: "center",
  //                   minHeight: "10px",
  //                   maxHeight: "10px",
  //                 }}
  //               >
  //                 {errors.gender ? (
  //                   <span
  //                     style={{
  //                       fontSize: "10px",
  //                       color: "red",
  //                     }}
  //                   >
  //                     {errors.gender}
  //                   </span>
  //                 ) : (
  //                   <span
  //                     style={{ fontSize: "8px", color: "transparent" }}
  //                   ></span>
  //                 )}
  //               </div>
  //               <label
  //                 className="goal-form-labels"
  //                 style={{
  //                   display: "flex",
  //                   marginTop: "5px",
  //                   flexDirection: "column",
  //                 }}
  //               >
  //                 Date of Birth
  //                 <input
  //                   type="date"
  //                   style={{ padding: "10px", width: "176px" }}
  //                   value={date}
  //                   pattern="\d{4}-\d{2}-\d{2}"
  //                   max={formattedDate}
  //                   onBlur={(e) => checkDate(e.target.value)}
  //                   onChange={(e) => {
  //                     setErrors({ ...errors, dob: "" });
  //                     setDate(e.target.value)}}
  //                   required
  //                 ></input>
  //               </label>
  //               {errors.dob ? (
  //                 <div className="goal-errors" style={{ marginTop: "5px" }}>
  //                   <span
  //                     style={{
  //                       fontSize: "12px",
  //                       color: "red",
  //                     }}
  //                   >
  //                     {errors.dob}
  //                   </span>
  //                 </div>
  //               ) : (
  //                 <div className="goal-errors" style={{ marginTop: "5px" }}></div>
  //               )}
  //               <div className="height-labels-container">
  //                 <span>How tall are you?</span>
  //                 <div className="height-choices-in-signup-form">
  //                   <label className="height-labels-in-form">
  //                     Height(ft):
  //                     <input
  //                       type="number"
  //                       className="height-inputs"
  //                       value={heightFt}
  //                       onBlur={(e) => checkHeightFt(e.target.value)}
  //                       onChange={(e) => {
  //                         setHeightError({ ...heightError, feet: "" });
  //                         setHeightFt(e.target.value);
  //                       }}
  //                       required
  //                     ></input>
  //                   </label>
  //                   <label className="height-labels-in-form">
  //                     Height(in):
  //                     <input
  //                       type="number"
  //                       className="height-inputs"
  //                       value={heightIn}
  //                       onBlur={(e) => checkHeightIn(e.target.value)}
  //                       onChange={(e) => {
  //                         setHeightError({ ...heightError, inches: "" });
  //                         setHeightIn(e.target.value);
  //                       }}
  //                       required
  //                     ></input>
  //                   </label>
  //                 </div>
  //               </div>
  //               {heightError.feet || heightError.inches ? (
  //                 <div className="height-errors">
  //                   <p
  //                     style={{
  //                       color: "red",
  //                       fontSize: "10px",
  //                       fontWeight: "400",
  //                     }}
  //                   >
  //                     Height is invalid
  //                   </p>
  //                 </div>
  //               ) : (
  //                 <div className="height-errors">
  //                   <p style={{ color: "red" }}></p>
  //                 </div>
  //               )}
  //               <div className="user-weight-inputs-container">
  //                 <label className="goal-form-labels">
  //                   Current Weight:
  //                   <input
  //                     type="number"
  //                     className="weight-inputs"
  //                     style={{ width: "68.5%" }}
  //                     value={currentWeight}
  //                     onBlur={(e) => checkCurrentWeight(e.target.value)}
  //                     onChange={(e) => {
  //                       setErrors({ ...errors, current_weight_lbs: "" });
  //                       handleCurrentWeightChange(e);
  //                     }}
  //                     disabled={goal === ""}
  //                   ></input>
  //                 </label>
  //                 {errors.current_weight_lbs ? (
  //                   <div className="goal-errors">
  //                     <span
  //                       style={{
  //                         fontSize: "12px",
  //                         color: "red",
  //                       }}
  //                     >
  //                       {errors.current_weight_lbs}
  //                     </span>
  //                   </div>
  //                 ) : (
  //                   <div className="goal-errors"></div>
  //                 )}
  //                 <label
  //                   className="goal-form-labels"
  //                   style={{ marginTop: "5px" }}
  //                 >
  //                   Target Weight:
  //                   <input
  //                     type="number"
  //                     className="weight-inputs"
  //                     value={targetWeight}
  //                     onChange={(e) => {
  //                       setGoalErrors("");
  //                       setTargetWeight(e.target.value);
  //                     }}
  //                     onBlur={handleTargetWeightChange}
  //                     disabled={!currentWeight}
  //                     min={40}
  //                   />
  //                 </label>
  //                 {goalErrors ? (
  //                   <div className="goal-errors">
  //                     <p
  //                       style={{
  //                         color: "red",
  //                         fontSize: "12px",
  //                         fontWeight: "400",
  //                       }}
  //                     >
  //                       {goalErrors}
  //                     </p>
  //                   </div>
  //                 ) : (
  //                   <div className="goal-errors"></div>
  //                 )}
  //               </div>
  //               <label className="weekly-goal-container">
  //                 Weekly Goal:
  //                 <div className="weekly-goal-choices">
  //                   {renderWeeklyGoalButtons()}
  //                 </div>
  //               </label>
  //               <div className="user-info">
  //                 <label className="signup-form-labels">
  //                   Username
  //                   <input
  //                     className="user-info-inputs"
  //                     type="text"
  //                     disabled={goal === ""}
  //                     minLength={6}
  //                     value={username}
  //                     onBlur={(e) => checkUsername(e.target.value)}
  //                     onChange={(e) => {
  //                       setErrors({ ...errors, username: "" });
  //                       setUsername(e.target.value);
  //                     }}
  //                   />
  //                 </label>
  //                 <div className="signup-form-errors">
  //                   {errors.username ? (
  //                     <span
  //                       style={{
  //                         fontSize: "10px",
  //                         color: "red",
  //                       }}
  //                     >
  //                       {errors.username}
  //                     </span>
  //                   ) : (
  //                     <span
  //                       style={{ fontSize: "8px", color: "transparent" }}
  //                     ></span>
  //                   )}
  //                 </div>
  //                 <label className="signup-form-labels">
  //                   Email
  //                   <input
  //                     type="email"
  //                     className="user-info-inputs"
  //                     disabled={goal === ""}
  //                     minLength={6}
  //                     value={email}
  //                     onBlur={(e) => checkEmail(e.target.value)}
  //                     onChange={(e) => {
  //                       setErrors({ ...errors, email: "" });
  //                       setEmail(e.target.value);
  //                     }}
  //                   />
  //                 </label>
  //                 <div className="signup-form-errors">
  //                   {errors.email ? (
  //                     <span
  //                       style={{
  //                         fontSize: "10px",
  //                         color: "red",
  //                       }}
  //                     >
  //                       {errors.email}
  //                     </span>
  //                   ) : (
  //                     <span
  //                       style={{ fontSize: "8px", color: "transparent" }}
  //                     ></span>
  //                   )}
  //                 </div>
  //                 <label className="signup-form-labels">
  //                   Password
  //                   <input
  //                     type="password"
  //                     className="user-info-inputs"
  //                     disabled={goal === ""}
  //                     minLength={6}
  //                     value={password}
  //                     onBlur={(e) => checkPassword(e.target.value)}
  //                     onChange={(e) => {
  //                       setErrors({ ...errors, password: "" });
  //                       setPassword(e.target.value);
  //                     }}
  //                   />
  //                 </label>
  //                 <div className="signup-form-errors">
  //                   {errors.password ? (
  //                     <span
  //                       style={{
  //                         fontSize: "10px",
  //                         color: "red",
  //                       }}
  //                     >
  //                       {errors.password}
  //                     </span>
  //                   ) : (
  //                     <span
  //                       style={{ fontSize: "8px", color: "transparent" }}
  //                     ></span>
  //                   )}
  //                 </div>
  //                 <label className="signup-form-labels">
  //                   Confirm Password
  //                   <input
  //                     type="password"
  //                     className="user-info-inputs"
  //                     disabled={goal === ""}
  //                     value={confirmPassword}
  //                     onChange={(e) => {
  //                       setErrors({ ...errors, confirmPassword: "" });
  //                       setConfirmPassword(e.target.value);
  //                     }}
  //                   />
  //                 </label>
  //                 <div className="signup-form-errors">
  //                   {errors.confirmPassword ? (
  //                     <span
  //                       style={{
  //                         fontSize: "10px",
  //                         color: "red",
  //                       }}
  //                     >
  //                       {errors.confirmPassword}
  //                     </span>
  //                   ) : (
  //                     <span
  //                       style={{ fontSize: "8px", color: "transparent" }}
  //                     ></span>
  //                   )}
  //                 </div>
  //               </div>
  //               <div className="signup-submit-button-container">
  //                 <button
  //                   type="submit"
  //                   className={buttonStyle}
  //                   disabled={disabled}
  //                 >
  //                   Sign Up
  //                 </button>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       )}
  //     </>
  //   );
}

export default SignupFormPage;
