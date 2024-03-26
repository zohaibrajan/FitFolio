import CardioLogs from "./CardioLogs"
import WeightLogs from "./WeightLogs"
import FoodLogs from "./FoodLogs"


function AllLogs() {
    return (
      <div className="all-diary-logs">
        <div
          className="diary-details-title"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Todays Diary</span>
          <span style={{ fontSize: "12px", fontWeight: "600" }}>
            Exercises and Foods marked with a * are your custom.
          </span>
        </div>
        <div className="users-log-container">
          <CardioLogs />
          <WeightLogs />
          <FoodLogs />
        </div>
      </div>
    );
}

export default AllLogs;

