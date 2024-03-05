const checkRestaurants = (restaurant) => {
  if (restaurant.length > 50 || restaurant.length < 4) {
    setErrors({
      ...errors,
      restaurant: "Restaurant name invalid",
    });
  }
};

const checkUnits = (units) => {
  if (units.length > 15 || units.length < 2) {
    setErrors({
      ...errors,
      unit: "Unit name invalid",
    });
  }
};

export { checkRestaurants, checkUnits };
