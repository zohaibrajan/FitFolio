const USER_FOODS = "userFoods/USER_FOODS";

const userFoods = (foods) => ({
  type: USER_FOODS,
  foods,
});

export const getUserFoodsThunk = () => async (dispatch) => {
  const res = await fetch(`/api/foods/my-foods`);

  if (res.ok) {
    const foods = await res.json();
    dispatch(userFoods(foods));
    return foods;
  }
};


const userFoodsReducer = (state = {}, action) => {
  switch (action.type) {
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


export default userFoodsReducer;
