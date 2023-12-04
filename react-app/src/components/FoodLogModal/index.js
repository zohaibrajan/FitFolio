import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllFoodsThunk } from "../../store/foods";

function FoodLogModal() {
  const dispatch = useDispatch();
  const foodsObj = useSelector((state) => state.foods);
  const foods = Object.values(foodsObj);
  const [food, setFood] = useState("");

  useEffect(() => {
    dispatch(getAllFoodsThunk());
  }, [dispatch]);

  return (
    <label className="food-log-creation">
      Foods
      <select
        type="text"
        value={food}
        onChange={(e) => setFood(e.target.value)}
        placeholder="Food"
      >
        {foods.map((food) => (
          <option key={food.id} value={`${food.name}, ${food.id}`}>
            {food.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default FoodLogModal;
