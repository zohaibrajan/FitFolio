import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import { FormInput } from "../FormInputs";
import { useSelectedDate } from "../../context/SelectedDate";
import {
  checkSets,
  checkReps,
  checkWeightPerRep,
  isEmpty,
  hasErrors,
  formattingUserInputDate
} from "../../utils";

function StrengthExerciseForm({ exerciseName }) {
  const dispatch = useDispatch();
  const date = useSelectedDate();
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weightPerRep, setWeightPerRep] = useState("");
  const [weightErrors, setWeightErrors] = useState({
    sets: "",
    reps: "",
    weightPerRep: "",
  });
  const commonChecks = isEmpty(exerciseName);
  const weightChecks =
    [sets, reps, weightPerRep].some(isEmpty) || hasErrors(weightErrors);
  const disabled = commonChecks || weightChecks;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const strengthExerciseForm = new FormData();
    const strengthLog = new FormData();
    strengthLog.append("sets", sets);
    strengthLog.append("repetitions", reps);
    strengthLog.append("weight_per_rep", weightPerRep);
    strengthLog.append("date", formattingUserInputDate(date.selectedDate));
    strengthLog.append("exercise_name", exerciseName);
    strengthExerciseForm.append("exercise_name", exerciseName);

    try {
      await dispatch(createWeightExerciseThunk(strengthExerciseForm));
      await dispatch(createWeightLogThunk(strengthLog));
      history.replace("/my-home/diary");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <FormInput
        label={"Sets"}
        type={"number"}
        value={sets}
        placeholder={"Sets eg. 3"}
        onBlur={(e) => checkSets(e.target.value, weightErrors, setWeightErrors)}
        onChange={(e) => {
          setSets(e.target.value);
          setWeightErrors({ ...weightErrors, sets: "" });
        }}
      />
      <ErrorHandlingComponent error={weightErrors.sets} />
      <FormInput
        label={"Repetitions"}
        type={"number"}
        value={reps}
        placeholder={"Repetitions eg. 10"}
        onBlur={(e) => checkReps(e.target.value, weightErrors, setWeightErrors)}
        onChange={(e) => {
          setReps(e.target.value);
          setWeightErrors({ ...weightErrors, reps: "" });
        }}
      />
      <ErrorHandlingComponent error={weightErrors.reps} />
      <FormInput
        label={"Weight Per Repetition"}
        type={"number"}
        value={weightPerRep}
        placeholder={"Weight Per Rep eg. 50"}
        onBlur={(e) =>
          checkWeightPerRep(e.target.value, weightErrors, setWeightErrors)
        }
        onChange={(e) => {
          setWeightPerRep(e.target.value);
          setWeightErrors({ ...weightErrors, weightPerRep: "" });
        }}
      />
      <ErrorHandlingComponent error={weightErrors.weightPerRep} />
      <div className="create-exercise-button-container">
        <button
          type="submit"
          className="create-exercise-button"
          disabled={disabled}
        >
          Add Exercise
        </button>
      </div>
    </form>
  );
}
