import React, { useState } from "react";
import { useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import FoodLogModal from "../FoodLogModal";


function MyFoodPage( { userFoods } ) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState({});
    const dispatch = useDispatch();

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
                          foodDescription={food.name}
                          foodId={food.id}
                        />
                      }
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
