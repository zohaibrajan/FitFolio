import React from "react";
import { useState, useEffect } from "react";
import MyFoodPage from "../MyFoods";


function FoodPage() {
    const [foodName, setFoodName] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [canOthersUse, setCanOthersUse] = useState(false);

  return (
    <div>
      <div>
        <div>
          <span>Create a new Food</span>
        </div>
        <div>
          <form>
            <label>
              Food Description
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
              />
            </label>
            <p>
              Please provide a complete description. For example, “Yogurt -
              Strawberry“ is better than “Yogurt.“
            </p>
            <label>
              Restaurant
              <input
                type="text"
                value={restaurant}
                onChange={(e) => setRestaurant(e.target.value)}
              />
            </label>
            <p>
                If this food is home-made, please leave type "Home-made"
            </p>
            <label>
              Calories
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </label>
            <label>
              Protein
              <input
                type="number"
                value={protein}
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
              <button type="submit">Create Food</button>
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
