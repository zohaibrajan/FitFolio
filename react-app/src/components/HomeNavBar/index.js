import React from "react";
import "./HomeNavBar.css";
import { useHistory } from "react-router-dom";

function HomeNavBar({ path }) {
  const history = useHistory();
  let homeClassName = "my-home";
  let goalClassName = "my-goal";
  let exerciseClassName = "my-exercise";
  let foodClassName = "my-food";

  homeClassName = path === "home" ? "my-home-active" : "my-home";
  goalClassName = path === "goal" ? "my-goal-active" : "my-goal";
  exerciseClassName = path === "exercise" ? "my-exercise-active" : "my-exercise";
  foodClassName = path === "food" ? "my-food-active" : "my-food";

  const exercise = () => {
    exerciseClassName = "my-exercise-active";
    homeClassName = "my-home";
    goalClassName = "my-goal";
    foodClassName = "my-food";
    history.replace("/my-home/exercise");
  };

  const home = () => {
    homeClassName = "my-home-active";
    goalClassName = "my-goal";
    exerciseClassName = "my-exercise";
    foodClassName = "my-food";
    history.replace("/my-home/diary");
  };

  const goal = () => {
    goalClassName = "my-goal-active";
    homeClassName = "my-home";
    exerciseClassName = "my-exercise";
    foodClassName = "my-food";
    history.replace("/my-home/goal");
  };

  const food = () => {
    foodClassName = "my-food-active";
    homeClassName = "my-home";
    goalClassName = "my-goal";
    exerciseClassName = "my-exercise";
    history.replace("/my-home/food");
  }


  return (
    <div className="home-page-nav-bar">
      <div onClick={home} className={homeClassName}>
        My Home
      </div>
      <div onClick={goal} className={goalClassName}>
        Goal
      </div>
      <div onClick={exercise} className={exerciseClassName}>
        Exercise
      </div>
      <div onClick={food} className={foodClassName}>
        Food
      </div>
    </div>
  );
}

export default HomeNavBar;
