import React, { useEffect } from "react";
import OpenModalButton from "../OpenModalButton";
import CardioLogModal from "../CardioLogModel";
import WeightLogModal from "../WeightLogModal";
import FoodLogModal from "../FoodLogModal";
import { getAllCardioLogsThunk } from "../../store/cardioLogs";
import { useDispatch } from "react-redux";



function Diary() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllCardioLogsThunk())
  }, [dispatch])


  return (
    <>
      <OpenModalButton
        modalComponent={<CardioLogModal />}
        buttonText={"Add Cardio Exercise"}
      />
      <OpenModalButton
        modalComponent={<WeightLogModal />}
        buttonText={"Add Weight Exercise"}
      />
      <OpenModalButton
        modalComponent={<FoodLogModal />}
        buttonText={"Add Food"}
      />
    </>
  );
}

export default Diary;
