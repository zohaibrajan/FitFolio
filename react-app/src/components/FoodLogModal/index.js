import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFoodsThunk } from "../../store/foods";
import { getAllUserFoodsThunk } from "../../store/userFoods";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { gettingTodaysDate, formattingUserInputDate } from "../../utils";
import { useSelectedDate } from "../../context/SelectedDate";
import {
  createFoodLogThunk,
  updateCardioLogThunk,
  deleteAFoodLog,
} from "../../store/foodLogs";
import "./FoodLog.css";

function FoodLogModal({ formType = "create", log = {}, foodName = "", foodIdProp = 1 }) {
  const dispatch = useDispatch();
  const foodsObj = useSelector((state) => state.foods);
  const userFoodObj = useSelector((state) => state.userFoods);
  const diaryDate = formattingUserInputDate(useSelectedDate().selectedDate)
  const { closeModal } = useModal();
  const today = gettingTodaysDate();
  const history = useHistory();
  const [servingUnit, setServingUnit] = useState(
    formType === "update" ? log.food.unitOfServing : ""
  );
  const foods = Object.values(foodsObj);
  const [searchTerm, setSearchTerm] = useState(
    formType === "update" ? log.food.name : foodName
  );
  const [foodId, setFoodId] = useState(formType === "update" ? log.food.id : foodIdProp);
  const [servings, setServings] = useState(
    formType === "update" ? log.servings : 0
  );
  const [caloriesConsumed, setCaloriesConsumed] = useState(
    formType === "update" ? log.totalCaloriesConsumed : 0
  );
  const [proteinConsumed, setProteinConsumed] = useState(
    formType === "update" ? log.totalProteinConsumed : 0
  );
  const [date, setDate] = useState(
    formType === "update" ? log.date : diaryDate
  );
  const [isFoodSelected, setIsFoodSelected] = useState(
    formType === "update" || foodName.length ? true : false
  );

  useEffect(() => {
    dispatch(getAllFoodsThunk());
  }, [dispatch]);

  useEffect(() => {
    let item = foodsObj[foodId];
    if (!item) {
      dispatch(getAllUserFoodsThunk());
      item = userFoodObj[foodId];
    }
    if (item) {
      setCaloriesConsumed(servings * item.calories);
      setProteinConsumed(servings * item.protein);
      setServingUnit(item.unitOfServing)
    }
    // eslint-disable-next-line
  }, [foodId, servings, foodsObj, dispatch]);

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFoodClick = (food) => {
    setFoodId(food.id);
    setSearchTerm(food.name);
    setIsFoodSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foodName = searchTerm

    const formData = new FormData();
    formData.append("name", foodName);
    formData.append("servings", servings);
    formData.append("date", date);

    if (formType === "create") {
      if (date !== diaryDate) {
        await fetch("/api/users/food-logs", {
          method: "POST",
          body: formData,
        });
        closeModal();
      } else {
        try {
          await dispatch(createFoodLogThunk(formData));
          history.replace("/my-home/diary");
          closeModal();
        } catch (e) {
          const errors = await e.json();
          console.error(errors);
        }
      }
    } else {
      if (date !== diaryDate) {
        await fetch(`/api/users/food-logs/${log.id}`, {
          method: "PUT",
          body: formData,
        });
        dispatch(deleteAFoodLog(log.id));
        closeModal();
      } else {
        try {
          await dispatch(updateCardioLogThunk(log.id, formData));
          closeModal();
        } catch (e) {
          const errors = await e.json();
          console.error(errors);
        }
      }
    }
  };

  return (
    <div className="food-log-container">
      <form
        className="food-log-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label className="food-log-labels">
          Foods
          <input
            type="text"
            value={searchTerm}
            disabled={foodName.length}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsFoodSelected(false);
            }}
            placeholder="Search for a food"
          />
          {searchTerm && !isFoodSelected && filteredFoods.length > 0 && (
            <div className="scrollable-list">
              {filteredFoods.map((food) => (
                <button
                  className="food-options-available"
                  key={food.id}
                  onClick={() => handleFoodClick(food)}
                >
                  {food.name}
                </button>
              ))}
            </div>
          )}
        </label>
        <label className="food-log-labels">
          Servings:
          <input
            disabled={!isFoodSelected}
            className="servings-input"
            min={1}
            step={1}
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
          {isFoodSelected && (
              <span style={{fontSize: "10px"}}>{servingUnit}</span>
          ) }
        </label>
        <label className="cardio-log-labels">
          Date:
          <input
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <span className="food-log-labels">
          Calories Consumed: {caloriesConsumed}
        </span>
        <span className="food-log-labels">
          Protein Consumed: {proteinConsumed}
        </span>
        <button
          disabled={!isFoodSelected || servings < 1}
          className="food-log-submit-button"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default FoodLogModal;
