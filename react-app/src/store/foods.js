const ALL_FOODS = "exercises/ALL_FOODS";

const getAllFoods = (foods) => ({
  type: ALL_FOODS,
  foods,
});

export const getAllFoodsThunk = () => async (dispatch) => {
  const res = await fetch("/api/foods");

  if (res.ok) {
    const foods = await res.json();
    dispatch(getAllFoods(foods));
    return foods;
  }
};

const foodsReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_FOODS:
      const allFoods = {};
      action.foods.foods.forEach((foods) => {
        allFoods[foods.id] = foods;
      });
      return allFoods;
    default:
      return state;
  }
};

export default foodsReducer;
