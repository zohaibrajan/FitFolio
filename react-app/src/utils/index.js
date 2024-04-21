//Desc: This file contains all the utility functions used in the application

export * from "./createFoodHelpers";
export * from "./diaryHelpers";
export * from "./exerciseHelpers";
export * from "./useCheckForExercise"


export const gettingTodaysDate = () => {
    let today = new Date().getTime();
    today = new Date(today);
    const year = today.getFullYear();
    const month =
      today.getMonth() >= 10
        ? today.getMonth() + 1
        : `0${today.getMonth() + 1}`;
    const day = today.getDate();
    const formattedDate =
      day >= 10 ? `${year}-${month}-${day}` : `${year}-${month}-0${day}`;

    return formattedDate;
}


export const formattingUserInputDate = (userDate) => {
    let date = new Date(userDate).getTime();
    date = new Date(date);
    const year = date.getFullYear();
    const month =
      date.getMonth() >= 10
        ? date.getMonth() + 1
        : `0${date.getMonth() + 1}`;
    const day = date.getDate();
    const formattedDate =
      day >= 10 ? `${year}-${month}-${day}` : `${year}-${month}-0${day}`;

    return formattedDate;
}

function validateGoal(goal, currentWeight, targetWeight) {
  targetWeight = parseInt(targetWeight);
  currentWeight = parseInt(currentWeight);

  if (goal === "Lose Weight" && targetWeight >= currentWeight) {
    return "Your target weight must be less than your current weight";
  }
  if (goal === "Gain Weight" && targetWeight <= currentWeight) {
    return "Your target weight must be greater than your current weight";
  }
  return "";
}

export function validateGoalSelection(data) {
  if (!data.goal) {
    return "Please select a goal";
  }
  return "";
}

export function validateGenderSelection(data) {
  if (!data.gender) {
    return "Please select a gender";
  }
  return "";
}

export function validateWeights(data) {
  if (data.currentWeight && data.targetWeight) {
    return validateGoal(data.goal, data.currentWeight, data.targetWeight);
  }
  return "";
}

export function validateWeeklyGoal(data) {
  if (data.goal === "Maintain Weight") {
    return "";
  }
  if (!data.weeklyGoal) {
    return "Please select a weekly goal";
  }
  return "";
}

export function validateUsernameAndPassword(data) {
  const { username, password, confirmPassword } = data;
  if (username.length < 5 || username.length > 50) {
    return "Username must be between 5 and 50 characters";
  }
  if (password.length < 8 || password.length > 50) {
    return "Password must be between 8 and 50 characters";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
}





export const isEmpty = (str) => str === "";
export const hasErrors = (errors) =>
    Object.values(errors).some((error) => error !== "");
