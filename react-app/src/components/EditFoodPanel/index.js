import React from "react";
import { useState, useEffect } from "react";
import { updateUserFoodThunk } from "../../store/userFoods";
import { useDispatch, useSelector } from "react-redux";
import { getUserFoodsThunk } from "../../store/userFoods";
import ErrorHandlingComponent from "../ErrorHandlingComponent"; // ErrorHandlingComponent is a component that displays an error message
import {
  checkRestaurants,
  checkServings,
  checkCalories,
  checkProtein,
  checkUnits,
  checkForFood,
  isEmpty,
  hasErrors,
} from "../../utils";
import "./EditFoodPanel.css";

function EditFoodPanel({ selectedFood, foodId, setIsPanelOpen }) {
  const userFoodsObj = useSelector((state) => state.userFoods);
  const userFoods = Object.values(userFoodsObj);
  const [foodName, setFoodName] = useState(selectedFood.name.split("*")[0]);
  const [restaurant, setRestaurant] = useState(selectedFood.restaurant);
  const [calories, setCalories] = useState(selectedFood.calories);
  const [protein, setProtein] = useState(selectedFood.protein);
  const [units, setUnits] = useState(selectedFood.unitOfServing);
  const [servings, setServings] = useState(1);
  const [isFormModified, setIsFormModified] = useState(false); // keeps button disabled until form is modified
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

  useEffect(() => { // when user changes what food item they want to edit, the form will be populated with the selected food item's data
    setFoodName(selectedFood.name.split("*")[0]);
    setRestaurant(selectedFood.restaurant);
    setCalories(selectedFood.calories);
    setProtein(selectedFood.protein);
    setUnits(selectedFood.unitOfServing);
  }, [selectedFood]);

  const commonChecks =
    [foodName, restaurant, servings, units].some(isEmpty) || hasErrors(errors);

  const disabled = commonChecks || calories === 0 || protein === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", `${foodName}*`);
    formData.append("restaurant", restaurant);
    formData.append(
      "calories",
      servings > 1 ? Math.ceil(calories / servings) : calories
    );
    formData.append(
      "protein",
      servings > 1 ? Math.ceil(protein / servings) : protein
    );
    formData.append("unit_of_serving", units);

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
            onBlur={(e) => checkForFood(e.target.value, userFoods, errors, setErrors)}
            required
            onChange={(e) => {
              setFoodName(e.target.value);
              setIsFormModified(true);
              setErrors({ ...errors, name: "" });
            }}
          />
        </label>
        <ErrorHandlingComponent error={errors.name} />
        <label className="edit-food-panel-label">
          Restaurant
          <input
            type="text"
            value={restaurant}
            required
            onBlur={(e) => checkRestaurants(e.target.value, errors, setErrors)}
            onChange={(e) => {
              setRestaurant(e.target.value);
              setIsFormModified(true);
              setErrors({ ...errors, restaurant: "" });
            }}
          />
        </label>
        <ErrorHandlingComponent error={errors.restaurant} />
        <label className="serving-size-label">
          Serving Size
          <div className="serving-size-inputs">
            <input
              type="number"
              value={servings}
              id="servings"
              min={1}
              required
              placeholder="Servings eg. 1"
              onBlur={(e) => checkServings(e.target.value, errors, setErrors)}
              onChange={(e) => {
                setErrors({ ...errors, servings: "" });
                setIsFormModified(true);
                setServings(e.target.value);
              }}
            />
            <input
              type="text"
              value={units}
              id="units"
              placeholder="Units eg. cup"
              required
              onBlur={(e) => checkUnits(e.target.value, errors, setErrors)}
              onChange={(e) => {
                setErrors({ ...errors, unit: "" });
                setIsFormModified(true);
                setUnits(e.target.value);
              }}
            />
          </div>
        </label>
        <ErrorHandlingComponent error={errors.unit || errors.servings} />
        <label className="edit-food-panel-label">
          Calories
          <input
            type="number"
            min={1}
            value={calories}
            required
            onBlur={(e) => checkCalories(e.target.value, errors, setErrors)}
            onChange={(e) => {
              setErrors({ ...errors, calories: "" });
              setIsFormModified(true);
              setCalories(e.target.value);
            }}
          />
        </label>
        <ErrorHandlingComponent error={errors.calories} />
        <label className="edit-food-panel-label">
          Protein
          <input
            type="number"
            min={1}
            value={protein}
            required
            onBlur={(e) => checkProtein(e.target.value, errors, setErrors)}
            onChange={(e) => {
              setErrors({ ...errors, protein: "" });
              setProtein(e.target.value);
              setIsFormModified(true);
            }}
          />
        </label>
        <ErrorHandlingComponent error={errors.protein} />
        <div className="edit-food-panel-submit-button-container">
          <button
            type="submit"
            disabled={disabled || !isFormModified}
            className="edit-food-panel-submit-button"
          >
            Update Food
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditFoodPanel;
