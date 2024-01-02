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


function FoodPage() {
    const userFoodsObj = useSelector((state) => state.foods);
    const userFoods = Object.values(userFoodsObj);
    const [foodName, setFoodName] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [canOthersUse, setCanOthersUse] = useState(false);
    const [servings, setServings] = useState(0);
    const [units, setUnits] = useState("oz");
    const dispatch = useDispatch();
    const history = useHistory();
    const date = useSelectedDate();
    const [errors, setErrors] = useState({ name: "", restaurant: "", unit: "" })

    useEffect(() => {
        dispatch(getUserFoodsThunk())
    }, [dispatch])

    const isEmpty = (str) => str === ""
    const hasErrors = (errors) => Object.values(errors).some((error) => error !== "")
    const commonChecks = [foodName, restaurant, servings, units].some(isEmpty) || hasErrors(errors)

    const disabled = commonChecks || calories === 0 || protein === 0



    const checkForFood = (foodName) => {
        const foodExists = userFoods.some((food) => food.name.toLowerCase() === foodName.trim().toLowerCase())
        if (foodExists) {
            setErrors({ ...errors, name: "Food already exists" })
        }
    }

    const checkRestaurants = (restaurant) => {
        if (restaurant.length > 50) {
            setErrors({ ...errors, restaurant: "Restaurant name must be less than 50 characters" })
        }
    }

    const checkUnits = (units) => {
        if (units.length > 50) {
            setErrors({ ...errors, unit: "Unit name must be less than 50 characters" })
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const newFood = new FormData()
        const foodLog = new FormData()
        newFood.append("name", canOthersUse ? foodName : `${foodName}*`)
        newFood.append("restaurant", restaurant)
        newFood.append("calories", calories)
        newFood.append("protein", protein)
        newFood.append("can_others_use", canOthersUse)
        foodLog.append("name", canOthersUse ? foodName : `${foodName}*`);
        foodLog.append("servings", servings)
        foodLog.append("date", formattingUserInputDate(date.selectedDate))

        try {
            await dispatch(addFoodThunk(newFood))
            await dispatch(createFoodLogThunk(foodLog))
            history.replace("/my-home/diary")
        } catch (e) {
            console.error(e)
        }
    }

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
            <label className="cardio-labels">
              Food Description - Please provide a complete description. For
              example, “Yogurt - Strawberry“ is better than “Yogurt.“
              <input
                type="text"
                value={foodName}
                onBlur={(e) => checkForFood(e.target.value)}
                required
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
            <label className="cardio-labels">
              Restaurant - If this food is home-made, please leave type
              "Home-made"
              <input
                type="text"
                value={restaurant}
                required
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
            <label>
              Serving Size
              <input
                type="number"
                value={servings}
                min={1}
                required
                onChange={(e) => setServings(e.target.value)}
              />
              <input
                type="text"
                value={units}
                required
                onBlur={(e) => checkUnits(e.target.value)}
                onChange={(e) => setUnits(e.target.value)}
              />
            </label>
            {errors.unit ? (
              <div className="exercise-name-error">{errors.unit}</div>
            ) : (
              <div className="exercise-name-error"></div>
            )}
            <label className="cardio-labels">
              Calories
              <input
                type="number"
                min={1}
                value={calories}
                required
                onChange={(e) => setCalories(e.target.value)}
              />
            </label>
            <label className="cardio-labels">
              Protein
              <input
                type="number"
                min={1}
                value={protein}
                required
                onChange={(e) => setProtein(e.target.value)}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={canOthersUse}
                onChange={(e) => setCanOthersUse(e.target.checked)}
              />
              Yes, other members can use this food
            </label>
            <div>
              <button type="submit" disabled={disabled}>Create Food</button>
            </div>
          </form>
          <div>
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
