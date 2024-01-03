import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import MyFoodPage from "../MyFoods";
import { addFoodThunk } from "../../store/foods";
import { getUserFoodsThunk } from "../../store/userFoods";
import { useDispatch } from "react-redux";
import { createFoodLogThunk } from "../../store/foodLogs";
import { useSelectedDate } from "../../context/SelectedDate";
import { formattingUserInputDate } from "../../utils";
import "./FoodPage.css";

function FoodPage() {
  const userFoodsObj = useSelector((state) => state.userFoods);
  const userFoods = Object.values(userFoodsObj);
  const [foodName, setFoodName] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [canOthersUse, setCanOthersUse] = useState(false);
  const [servings, setServings] = useState("");
  const [units, setUnits] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const date = useSelectedDate();
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

  const isEmpty = (str) => str === "";
  const hasErrors = (errors) =>
    Object.values(errors).some((error) => error !== "");
  const commonChecks =
    [foodName, restaurant, servings, units].some(isEmpty) || hasErrors(errors);

  const disabled = commonChecks || calories === "" || protein === "";

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

  const buttonStyle = disabled
    ? "create-food-button-disabled"
    : "create-food-button";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFood = new FormData();
    const foodLog = new FormData();
    newFood.append("name", canOthersUse ? foodName : `${foodName}*`);
    newFood.append("restaurant", restaurant);
    newFood.append("calories", calories);
    newFood.append("protein", protein);
    newFood.append("can_others_use", canOthersUse);
    foodLog.append("name", canOthersUse ? foodName : `${foodName}*`);
    foodLog.append("servings", servings);
    foodLog.append("date", formattingUserInputDate(date.selectedDate));

    try {
      await dispatch(addFoodThunk(newFood));
      await dispatch(createFoodLogThunk(foodLog));
      history.replace("/my-home/diary");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="food-page-container">
      <div className="food-page-content">
        <div className="food-page-title">
          <span>Create a new Food</span>
        </div>
        <div className="create-food-container">
          <form
            onSubmit={handleSubmit}
            className="create-food-form"
            encType="multipart/form-data"
          >
            <label className="food-labels">
              Food Description{" "}
              <span style={{ fontWeight: "400", fontSize: "12px" }}>
                For example, “Oats with Strawberry's“ is better than “Oats“
              </span>
              <input
                type="text"
                value={foodName}
                onBlur={(e) => checkForFood(e.target.value)}
                required
                placeholder="Food Description"
                onChange={(e) => {
                  setFoodName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
              />
            </label>
            {errors.name ? (
              <div className="exercise-name-error">{errors.name}</div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
            <label className="food-labels">
              Restaurant
              <span style={{ fontWeight: "400", fontSize: "12px" }}>
                If this food is home-made, please type "Home-made"
              </span>
              <input
                type="text"
                value={restaurant}
                required
                placeholder="Restaurant"
                onBlur={(e) => checkRestaurants(e.target.value)}
                onChange={(e) => {
                  setRestaurant(e.target.value);
                  setErrors({ ...errors, restaurant: "" });
                }}
              />
            </label>
            {errors.restaurant ? (
              <div className="exercise-name-error">{errors.restaurant}</div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
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
                  onBlur={(e) => checkServings(e.target.value)}
                  onChange={(e) => {
                    setErrors({ ...errors, servings: "" });
                    setServings(e.target.value)}}
                />
                <input
                  type="text"
                  value={units}
                  id="units"
                  placeholder="Units eg. cup"
                  required
                  onBlur={(e) => checkUnits(e.target.value)}
                  onChange={(e) => {
                    setErrors({ ...errors, unit: "" });
                    setUnits(e.target.value)}}
                />
              </div>
            </label>
            {errors.unit || errors.servings ? (
              <div className="exercise-name-error">{errors.unit || errors.servings}</div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
            <label className="food-labels">
              Calories
              <input
                type="number"
                min={1}
                value={calories}
                required
                placeholder="Calories in Serving"
                onBlur={(e) => checkCalories(e.target.value)}
                onChange={(e) => {
                  setErrors({ ...errors, calories: "" });
                  setCalories(e.target.value)
                }}
              />
            </label>
            {errors.calories ? (
              <div className="exercise-name-error">{errors.calories}</div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
            <label className="food-labels">
              Protein
              <input
                type="number"
                min={1}
                value={protein}
                required
                placeholder="Protein in Serving"
                onBlur={(e) => checkProtein(e.target.value)}
                onChange={(e) => {
                  setErrors({ ...errors, protein: "" });
                  setProtein(e.target.value)
                }}
              />
            </label>
            {errors.protein ? (
              <div className="exercise-name-error">{errors.protein}</div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
            <label className="can-others-use-label">
              <input
                type="checkbox"
                checked={canOthersUse}
                onChange={(e) => setCanOthersUse(e.target.checked)}
              />
              Yes, other members can use this food
            </label>
            {canOthersUse ? (
              <div className="exercise-name-error">
              {" "} You will not be able to delete or edit this item once created
              </div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
            <div className="create-food-button-container">
              <button className={buttonStyle} type="submit" disabled={disabled}>
                Create Food
              </button>
            </div>
          </form>
          <div className="create-food-text">
            <h3>Creating a New Food</h3>
            <p>
              If you can't find a food in our database, you can easily add it
              yourself.
            </p>
            <p>
              After successfully creating a food, you can conveniently search
              for it an incorporate it into your diary whenever needed.
            </p>
          </div>
        </div>
      </div>
      <MyFoodPage />
    </div>
  );
}

export default FoodPage;
