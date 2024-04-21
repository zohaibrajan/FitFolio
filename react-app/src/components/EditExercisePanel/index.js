import EditCardioExercise from "./EditCardioExercise";
import { FormInput } from "../FormElements";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import "./EditExercisePanel.css";

function EditExercisePanel({ selectedExercise, isCardio, setIsPanelOpen }) {
  return (
    <div className={`side-panel`}>
      <div className="edit-exercise-panel-title-container">
        <span>Edit Exercise</span>
        <i
          onClick={() => setIsPanelOpen(false)}
          className="fa-solid fa-xmark close-panel"
        ></i>
      </div>
      <div>
        <FormInput
          label={"Exercise Name"}
          type={"text"}
          value={selectedExercise.name}
          placeholder={"Exercise Name eg. Running"}
          name={"exercise-name"}
        />
        <ErrorHandlingComponent error={false} />
        {isCardio ? (
          <EditCardioExercise exerciseData={selectedExercise} />
        ) : (
          <h1>Strength</h1>
        )}
      </div>
    </div>
  );
}

export default EditExercisePanel;
