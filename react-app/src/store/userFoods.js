const USER_FOODS = "userFoods/USER_FOODS";
const DELETE_FOOD = "userFoods/DELETE_FOOD";
const ALL_USER_FOODS = "userFoods/ALL_USER_FOODS";
const UPDATE_USER_FOOD = "userFoods/UPDATE_USER_FOOD";


const updateUserFood = (food) => ({
    type: UPDATE_USER_FOOD,
    food,
});


const allUserFoods = (foods) => ({
    type: ALL_USER_FOODS,
    foods,
});


const userFoods = (foods) => ({
  type: USER_FOODS,
  foods,
});

const deleteFood = (foodId) => ({
  type: DELETE_FOOD,
  foodId,
});

export const getAllUserFoodsThunk = () => async (dispatch) => {
    const res = await fetch(`/api/foods/my-foods-all`);

    if (res.ok) {
        const foods = await res.json();
        dispatch(allUserFoods(foods));
        return foods;
    }
}

export const getUserFoodsThunk = () => async (dispatch) => {
  const res = await fetch(`/api/foods/my-foods`);

  if (res.ok) {
    const foods = await res.json();
    dispatch(userFoods(foods));
    return foods;
  }
};

export const updateUserFoodThunk = (foodId, food) => async (dispatch) => {
    const res = await fetch(`/api/foods/${foodId}`, {
        method: "PUT",
        body: food,
    });

    if (res.ok) {
        const updatedFood = await res.json();
        dispatch(updateUserFood(updatedFood));
        return updatedFood;
    }
}

export const deleteUserFoodThunk = (foodId) => async (dispatch) => {
    const res = await fetch(`/api/foods/${foodId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        dispatch(deleteFood(foodId));
    }
}


const userFoodsReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_USER_FOODS:
      const allUserFoods = {};
      action.foods.foods.forEach((food) => {
        allUserFoods[food.id] = food;
      });
      return allUserFoods;
    case USER_FOODS:
      const userFoods = {};
      action.foods.foods.forEach((food) => {
        userFoods[food.id] = food;
      });
      return userFoods;
    case DELETE_FOOD:
        const newState = { ...state };
        delete newState[action.foodId];
        return newState;
    case UPDATE_USER_FOOD:
        return { ...state, [action.food.food.id]: action.food.food };
    default:
      return state;
  }
};


export default userFoodsReducer;
