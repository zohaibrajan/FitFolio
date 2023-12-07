import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFoodsThunk } from "../../store/foods";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createFoodLogThunk, updateCardioLogThunk, deleteAFoodLog } from "../../store/foodLogs";
import "./FoodLog.css";

function FoodLogModal({ formType = "create", log = {} }) {
  const dispatch = useDispatch();
  const foodsObj = useSelector((state) => state.foods);
  const { closeModal } = useModal();
  let today = new Date().getTime();
  today = new Date(today);
  const year = today.getFullYear();
  const month =
    today.getMonth() >= 10 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
  const day = today.getDate();
  const formattedDate =
    day >= 10 ? `${year}-${month}-${day}` : `${year}-${month}-0${day}`;
  const history = useHistory();
  const foods = Object.values(foodsObj);
  const [foodId, setFoodId] = useState(formType === "update" ? log.food.id : 1);
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
    formType === "update" ? log.date : formattedDate
  );

  useEffect(() => {
    dispatch(getAllFoodsThunk());
  }, [dispatch]);

  useEffect(() => {
    const item = foodsObj[foodId];
    if (item) {
      setCaloriesConsumed(servings * item.calories);
      setProteinConsumed(servings * item.protein);
    }
  }, [foodId, servings, foodsObj]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const foodName = foodsObj[foodId].name;
    const changeToDate = new Date(date);
    const correctFormatForDate = changeToDate.toISOString().slice(0, 10);

    const formData = new FormData();
    formData.append("name", foodName);
    formData.append("servings", servings);
    formData.append("date", correctFormatForDate);

    if (formType === "create") {
      if (correctFormatForDate !== formattedDate) {
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
      if (correctFormatForDate !== formattedDate) {
        await fetch(`/api/users/food-logs/${log.id}`, {
          method: "PUT",
          body: formData,
        })
        dispatch(deleteAFoodLog(log.id))
        closeModal()
      } else {
        try {
          await dispatch(updateCardioLogThunk(log.id, formData))
          closeModal()
        } catch (e) {
          const errors = await e.json()
          console.error(errors)
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
          <select
            type="text"
            value={foodId}
            onChange={(e) => setFoodId(e.target.value)}
            placeholder="Food"
          >
            {foods.map((food) => (
              <option key={food.id} value={food.id}>
                {food.name}
              </option>
            ))}
          </select>
        </label>
        <label className="food-log-labels">
          Servings:
          <input
            className="servings-input"
            min={1}
            step={1}
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </label>
        <label className="cardio-log-labels">
          Date:
          <input
            type="date"
            pattern="\d{4}-\d{2}-\d{2}"
            value={date}
            max={formattedDate}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <span className="food-log-labels">
          Calories Consumed: {caloriesConsumed}
        </span>
        <span className="food-log-labels">
          Protein Consumed: {proteinConsumed}
        </span>
        <button className='food-log-submit-button' type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FoodLogModal;
