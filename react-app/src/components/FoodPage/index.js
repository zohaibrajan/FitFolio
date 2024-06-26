import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import MyFoodPage from "../MyFoods";
import { addFoodThunk } from "../../store/foods";
import { getUserFoodsThunk } from "../../store/userFoods";
import { createFoodLogThunk } from "../../store/foodLogs";
import { useSelectedDate } from "../../context/SelectedDate";
import ErrorHandlingComponent from "../ErrorHandlingComponent";
import { FormInput } from "../FormElements";
import {
  formattingUserInputDate,
  checkRestaurants,
  checkUnits,
  checkCalories,
  checkServings,
  checkProtein,
  checkForFood,
  isEmpty,
  hasErrors,
} from "../../utils";
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

  const commonChecks =
    [foodName, restaurant, servings, units].some(isEmpty) || hasErrors(errors);

  const disabled = commonChecks || calories === "" || protein === "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFood = new FormData();
    const foodLog = new FormData();
    newFood.append("name", canOthersUse ? foodName : `${foodName}*`);
    newFood.append("restaurant", restaurant);
    newFood.append(
      "calories",
      servings > 1 ? Math.ceil(calories / servings) : calories
    );
    newFood.append(
      "protein",
      servings > 1 ? Math.ceil(protein / servings) : protein
    );
    newFood.append("can_others_use", canOthersUse);
    newFood.append("unit_of_serving", units);
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
                onBlur={(e) =>
                  checkForFood(e.target.value, userFoods, errors, setErrors)
                }
                required
                placeholder="Food Description"
                onChange={(e) => {
                  setFoodName(e.target.value);
                  setErrors({ ...errors, name: "" });
                }}
              />
            </label>
            <ErrorHandlingComponent error={errors.name} />
            <label className="food-labels">
              Restaurant
              <span style={{ fontWeight: "400", fontSize: "12px" }}>
                If this item is home-made, please type "Home-made"
              </span>
              <input
                type="text"
                value={restaurant}
                required
                placeholder="Restaurant"
                onBlur={(e) =>
                  checkRestaurants(e.target.value, errors, setErrors)
                }
                onChange={(e) => {
                  setRestaurant(e.target.value);
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
                  onBlur={(e) =>
                    checkServings(e.target.value, errors, setErrors)
                  }
                  onChange={(e) => {
                    setErrors({ ...errors, servings: "" });
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
                    setUnits(e.target.value);
                  }}
                />
              </div>
            </label>
            <ErrorHandlingComponent error={errors.unit || errors.servings} />
            <FormInput
              label={"Calories"}
              type="number"
              value={calories}
              required
              placeholder="Calories in Serving"
              onBlur={(e) => checkCalories(e.target.value, errors, setErrors)}
              onChange={(e) => {
                setErrors({ ...errors, calories: "" });
                setCalories(e.target.value);
              }}
            />
            <ErrorHandlingComponent error={errors.calories} />
            <FormInput
              label={"Protein"}
              type="number"
              value={protein}
              placeholder="Protein in Serving"
              onBlur={(e) => checkProtein(e.target.value, errors, setErrors)}
              onChange={(e) => {
                setErrors({ ...errors, protein: "" });
                setProtein(e.target.value);
              }}
            />
            <ErrorHandlingComponent error={errors.protein} />
            <label className="can-others-use-label">
              <input
                type="checkbox"
                checked={canOthersUse}
                onChange={(e) => setCanOthersUse(e.target.checked)}
              />
              Yes, other members can use this food
            </label>
            <ErrorHandlingComponent error={canOthersUse} />
            <div className="create-food-button-container">
              <button
                className="create-food-button"
                type="submit"
                disabled={disabled}
              >
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
