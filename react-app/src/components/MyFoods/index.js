import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import FoodLogModal from "../FoodLogModal";
import { getUserFoodsThunk } from "../../store/userFoods";


function MyFoodPage() {
    const userFoodObj = useSelector((state) => state.foods);
    const userFoods = Object.values(userFoodObj);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState({});
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserFoodsThunk())
    }, [dispatch])

    const handleDelete = (e, foodId) => {
        e.preventDefault();
        // dispatch(deleteUserFoodThunk(foodId))
    }

    return (
      <div>
        <div>
          <div>
            <span>My Foods</span>
          </div>
          <div>
            <p>
              Welcome to the food section! Here you can view all of your Foods
            </p>
          </div>
          <table>
            <tr>
              <th>Food Description</th>
              <th></th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>

            {userFoods.length > 0 ? (
              userFoods.map((food) => (
                <tr>
                  <td>{food.name}</td>
                  <td>
                    <OpenModalButton
                      modalComponent={
                        <FoodLogModal
                          foodName={food.name}
                          foodIdProp={food.id}
                        />
                    }
                    buttonText={"Add to Diary"}
                    />
                  </td>
                  {!food.canOthersUse ? (
                    <>
                      <td>
                        <button onClick={(e) => handleDelete(e, food.id)}>
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedFood(food);
                            setIsPanelOpen(true);
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                        <td></td>
                        <td></td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td>No Foods</td>
              </tr>
            )}
          </table>
        </div>
      </div>
    );


}

export default MyFoodPage;
