import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // default styling for datepicker component
import { addDays, subDays } from "date-fns";
import { isTodayOrFuture } from "../../utils";
import { useSelectedDate } from "../../context/SelectedDate";

function Calendar() {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const today = new Date();
  const incrementDate = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const decrementDate = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  return (
    <div className="diary-calendar-container">
      <button className="prev-date-button" onClick={decrementDate}>
        <i className="fa-solid fa-angle-left" style={{ color: "white" }}></i>
      </button>
      <DatePicker {/* allows for easy date change, npm */}
        className="date-picker"
        showIcon
        selected={selectedDate}
        maxDate={today}
        onChange={(date) => {
          if (date <= today) {
            setSelectedDate(date);
          }
        }}
      />
      <button
        className="next-date-button"
        onClick={incrementDate}
        disabled={isTodayOrFuture(selectedDate)}
      >
        <i className="fa-solid fa-angle-right" style={{ color: "white" }} />
      </button>
    </div>
  );
}

export default Calendar;
