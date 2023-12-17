import React from "react";
import "./HomeNavBar.css";
import { useHistory } from "react-router-dom";

function HomeNavBar({ path }) {
  const history = useHistory();
  let homeClassName = "my-home";
  let goalClassName = "my-goal";
  let exerciseClassName = "my-exercise";

  homeClassName = path === "home" ? "my-home-active" : "my-home";
  goalClassName = path === "goal" ? "my-goal-active" : "my-goal";
  exerciseClassName =
    path !== "home" && path !== "goal" ? "my-exercise-active" : "my-exercise";

  const exercise = () => {
    exerciseClassName = "my-exercise-active";
    homeClassName = "my-home";
    goalClassName = "my-goal";
    history.replace("/my-home/exercise");
  };

  const home = () => {
    homeClassName = "my-home-active";
    goalClassName = "my-goal";
    exerciseClassName = "my-exercise";
    history.replace("/my-home/diary");
  };

  const goal = () => {
    goalClassName = "my-goal-active";
    homeClassName = "my-home";
    exerciseClassName = "my-exercise";
    history.replace("/my-home/goal");
  };
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
    </div>
  );
}

export default HomeNavBar;
