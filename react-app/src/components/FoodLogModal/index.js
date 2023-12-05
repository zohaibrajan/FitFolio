import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFoodsThunk } from "../../store/foods";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { createFoodLogThunk } from "../../store/foodLogs";
import "./FoodLog.css";

function FoodLogModal() {
  const dispatch = useDispatch();
  const foodsObj = useSelector((state) => state.foods);
  const { closeModal } = useModal();
  const today = new Date();
  const history = useHistory();
  const formattedDate = today.toISOString().slice(0, 10);
  const foods = Object.values(foodsObj);
  const [foodId, setFoodId] = useState(1);
  const [servings, setServings] = useState(0);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [proteinConsumed, setProteinConsumed] = useState(0);
  const [date, setDate] = useState(formattedDate);

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

    if (correctFormatForDate !== formattedDate) {
      await fetch("/api/users/food-logs", {
        method: "POST",
        body: formData,
      });
      closeModal()
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
        <span>Calories Consumed: {caloriesConsumed}</span>
        <span>Protein Consumed: {proteinConsumed}</span>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FoodLogModal;
