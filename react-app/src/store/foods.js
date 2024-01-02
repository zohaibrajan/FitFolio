const ALL_FOODS = "exercises/ALL_FOODS";
const ADD_FOOD = "exercises/ADD_FOOD";
const USER_FOODS = "exercises/USER_FOODS";

const userFoods = (foods) => ({
  type: USER_FOODS,
  foods,
});

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
  console.log(res)

  if (res.ok) {
    const foods = await res.json();
    dispatch(getAllFoods(foods));
    return foods;
  }
};

export const getUserFoodsThunk = () => async (dispatch) => {
  const res = await fetch(`/api/foods/my-foods`);

  if (res.ok) {
    const foods = await res.json();
    dispatch(userFoods(foods));
    return foods;
  }
}

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
    case USER_FOODS:
      const userFoods = {};
      action.foods.foods.forEach((food) => {
        userFoods[food.id] = food;
      });
      return userFoods;
    default:
      return state;
  }
};

export default foodsReducer;
