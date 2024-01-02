const ALL_FOODS = "exercises/ALL_FOODS";
const ADD_FOOD = "exercises/ADD_FOOD";

const getAllFoods = (foods) => ({
  type: ALL_FOODS,
  foods,
});

const addFood = (food) => ({
  type: ADD_FOOD,
  food,
});


export const addFoodThunk = (food) => async (dispatch) => {
  const res = await fetch("/api/foods/new", {
    method: "POST",
    body: food,
  });

  if (res.ok) {
    const newFood = await res.json();
    dispatch(addFood(newFood));
    return newFood;
  }
}


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
    case ADD_FOOD:
      return { ...state, [action.food.id]: action.food };
    default:
      return state;
  }
};

export default foodsReducer;
