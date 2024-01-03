import React from "react";
import { useState, useEffect } from "react";
import { updateUserFoodThunk } from "../../store/userFoods";
import { useDispatch, useSelector } from "react-redux";
import { getUserFoodsThunk } from "../../store/userFoods";
import "./EditFoodPanel.css";

function EditFoodPanel({ selectedFood, foodId, setIsPanelOpen }) {
  const userFoodsObj = useSelector((state) => state.userFoods);
  const userFoods = Object.values(userFoodsObj);
  const [foodName, setFoodName] = useState(selectedFood.name.split("*")[0]);
  const [restaurant, setRestaurant] = useState(selectedFood.restaurant);
  const [calories, setCalories] = useState(selectedFood.calories);
  const [protein, setProtein] = useState(selectedFood.protein);
  const [servings, setServings] = useState(1);
  const [isFormModified, setIsFormModified] = useState(false);
  const [units, setUnits] = useState("oz");
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    name: "",
    restaurant: "",
    unit: "",
    calories: "",
    protein: "",
    servings: "",
  });

  useEffect(() => {
    dispatch(getUserFoodsThunk());
  }, [dispatch]);

  useEffect(() => {
    setFoodName(selectedFood.name.split("*")[0]);
    setRestaurant(selectedFood.restaurant);
    setCalories(selectedFood.calories);
    setProtein(selectedFood.protein);
  }, [selectedFood]);

  const isEmpty = (str) => str === "";
  const hasErrors = (errors) =>
    Object.values(errors).some((error) => error !== "");
  const commonChecks =
    [foodName, restaurant, servings, units].some(isEmpty) || hasErrors(errors);

  const disabled = commonChecks || calories === 0 || protein === 0;

  const checkForFood = (foodName) => {
    const foodExists = userFoods.some(
      (food) =>
        food.name.split("*")[0].toLowerCase() === foodName.trim().toLowerCase()
    );
    if (foodExists) {
      setErrors({ ...errors, name: "Food already exists" });
    }
  };

  const checkRestaurants = (restaurant) => {
    if (restaurant.length > 50) {
      setErrors({
        ...errors,
        restaurant: "Restaurant name must be less than 50 characters",
      });
    }
  };

  const checkUnits = (units) => {
    if (units.length > 50) {
      setErrors({
        ...errors,
        unit: "Unit name must be less than 50 characters",
      });
    }
  };

  const checkCalories = (calories) => {
    if (calories < 1) {
      setErrors({ ...errors, calories: "Calories must be greater than 0" });
    }
  };

  const checkProtein = (protein) => {
    if (protein < 1) {
      setErrors({ ...errors, protein: "Protein must be greater than 0" });
    }
  };

  const checkServings = (servings) => {
      if (servings < 1) {
        setErrors({ ...errors, servings: "Servings must be greater than 0" });
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", `${foodName}*`);
    formData.append("restaurant", restaurant);
    formData.append("calories", calories);
    formData.append("protein", protein);

    try {
      await dispatch(updateUserFoodThunk(foodId, formData));
      setIsPanelOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="side-panel">
      <div className="edit-food-panel-title-container">
        <span>Edit Food</span>
        <i
          onClick={() => setIsPanelOpen(false)}
          className="fa-solid fa-xmark close-panel"
        ></i>
      </div>
      <form
        className="edit-food-form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <label className="edit-food-panel-label">
          Food Description
          <input
            type="text"
            value={foodName}
            onBlur={(e) => checkForFood(e.target.value)}
            required
            onChange={(e) => {
              setFoodName(e.target.value);
              setIsFormModified(true);
              setErrors({ ...errors, name: "" });
            }}
          />
        </label>
        {errors.name ? (
          <div className="exercise-name-error">{errors.name}</div>
        ) : (
          <div className="exercise-name-error"></div>
        )}
        <label className="edit-food-panel-label">
          Restaurant
          <input
            type="text"
            value={restaurant}
            required
            onBlur={(e) => checkRestaurants(e.target.value)}
            onChange={(e) => {
              setRestaurant(e.target.value);
              setIsFormModified(true);
              setErrors({ ...errors, restaurant: "" });
            }}
          />
        </label>
        {errors.restaurant ? (
          <div className="exercise-name-error">{errors.restaurant}</div>
        ) : (
          <div className="exercise-name-error"></div>
        )}
        <label>
          Serving Size
          <input
            type="number"
            value={servings}
            min={1}
            required
            onChange={(e) => {
              setIsFormModified(true);
              setServings(e.target.value);
            }}
          />
          <input
            type="text"
            value={units}
            required
            onBlur={(e) => checkUnits(e.target.value)}
            onChange={(e) => {
              setIsFormModified(true);
              setUnits(e.target.value);
            }}
          />
        </label>
        {errors.unit ? (
          <div className="exercise-name-error">{errors.unit}</div>
        ) : (
          <div className="exercise-name-error"></div>
        )}
        <label className="edit-food-panel-label">
          Calories
          <input
            type="number"
            min={1}
            value={calories}
            required
            onChange={(e) => {
              setIsFormModified(true);
              setCalories(e.target.value);
            }}
          />
        </label>
        {errors.calories ? (
          <div className="exercise-name-error">{errors.calories}</div>
        ) : (
          <div className="exercise-name-error"></div>
        )}
        <label className="edit-food-panel-label">
          Protein
          <input
            type="number"
            min={1}
            value={protein}
            required
            onChange={(e) => {
              setProtein(e.target.value);
              setIsFormModified(true);
            }}
          />
        </label>
        {errors.protein ? (
          <div className="exercise-name-error">{errors.protein}</div>
        ) : (
          <div className="exercise-name-error"></div>
        )}
        <div>
          <button type="submit" disabled={disabled || !isFormModified}>
            Update Food
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditFoodPanel;
