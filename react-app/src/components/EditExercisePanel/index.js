import "./EditExercisePanel.css";

function EditExercisePanel({ selectedExercise, isCardio, setIsPanelOpen }) {
  console.log(selectedExercise, isCardio);

  return (
    <div className={`side-panel`}>
      <div className="edit-exercise-panel-title-container">
        <span>Edit Exercise</span>
        <i
          onClick={() => setIsPanelOpen(false)}
          className="fa-solid fa-xmark close-panel"
        ></i>
      </div>
    </div>
  );
}

export default EditExercisePanel;
