import React from "react";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import FoodLogModal from "../FoodLogModal";
import { useSelectedDate } from "../../context/SelectedDate";

function LogButtons() {
  const { selectedDate } = useSelectedDate();

  return (
    <div className="log-buttons-container">
      <OpenModalButton
        modalComponent={<CardioLogModal dateFromDiary={selectedDate} />}
        buttonText={"Add Cardio Exercise"}
      />
      <OpenModalButton
        modalComponent={<WeightLogModal dateFromDiary={selectedDate} />}
        buttonText={"Add Strength Exercise"}
      />
      <OpenModalButton
        modalComponent={<FoodLogModal dateFromDiary={selectedDate} />}
        buttonText={"Add Food"}
      />
    </div>
  );
}


export default LogButtons;
