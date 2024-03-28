const checkRestaurants = (restaurant, errors, setErrors) => {
  if (restaurant.length > 50 || restaurant.length < 4) {
    setErrors({
      ...errors,
      restaurant: "Restaurant name invalid",
    });
  }
};

const checkUnits = (units, errors, setErrors) => {
  if (units.length > 15 || units.length < 2) {
    setErrors({
      ...errors,
      unit: "Unit name invalid",
    });
  }
};

const checkCalories = (calories, errors, setErrors) => {
  if (calories < 1) {
    setErrors({ ...errors, calories: "Calories must be greater than 0" });
  }
};

const checkProtein = (protein, errors, setErrors) => {
  if (protein < 1) {
    setErrors({ ...errors, protein: "Protein must be greater than 0" });
  }
};

const checkServings = (servings, errors, setErrors) => {
  if (servings < 1) {
    setErrors({ ...errors, servings: "Servings must be greater than 0" });
  }
};

const checkForFood = (foodName, userFoods, errors, setErrors) => {
  const foodExists = userFoods.some(
    (food) =>
      food.name.split("*")[0].toLowerCase() === foodName.trim().toLowerCase()
  );
  if (foodExists) {
    setErrors({ ...errors, name: "Food already exists" });
  }

  if (foodName.length > 50 || foodName.length < 4) {
    setErrors({
      ...errors,
      name: "Food name invalid",
    });
  }
};

export {
  checkRestaurants,
  checkUnits,
  checkCalories,
  checkProtein,
  checkServings,
  checkForFood
};
