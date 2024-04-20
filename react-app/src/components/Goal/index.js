import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsersGoalThunk } from "../../store/goal";
import OpenModalButton from "../OpenModalButton";
import UpdatingGoalModal from "../UpdatingGoalModal";
import "./Goal.css";

function Goal() {
  const dispatch = useDispatch();
  const goal = useSelector((state) => state.goal);

  useEffect(() => {
    dispatch(getUsersGoalThunk());
  }, [dispatch]);

  return (
    <div className="goal-container">
      <div className="goal-content">
        <div className="goal-container-title">
          <span>Your Fitness Goal</span>
        </div>
        <div className="goal-info">
          <h2>{goal.goal}</h2>
          <span>
            Current Calories Needed:{" "}
            <span className="goal-nums">{goal.caloriesPerDay} kcal</span>
          </span>
          <span>
            Starting Weight:{" "}
            <span className="goal-nums">{goal.startingWeight} lbs</span>
          </span>
          <span>
            Target Weight:{" "}
            <span className="goal-nums">{goal.targetWeight} lbs</span>
          </span>
        </div>
        <div className="update-goal-button-container">
          <OpenModalButton
            modalComponent={<UpdatingGoalModal />}
            buttonText={"Update Goal"}
          />
        </div>
      </div>
    </div>
  );
}

export default Goal;
