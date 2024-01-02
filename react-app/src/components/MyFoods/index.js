import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import FoodLogModal from "../FoodLogModal";
import { getUserFoodsThunk, deleteUserFoodThunk } from "../../store/userFoods";


function MyFoodPage() {
    const userFoodObj = useSelector((state) => state.userFoods);
    const userFoods = Object.values(userFoodObj);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const foodsPerPage = 10;
    const endIndex = currentPage * foodsPerPage;
    const startIndex = endIndex - foodsPerPage;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserFoodsThunk())
    }, [dispatch])


    const handleDelete = (e, foodId) => {
        e.preventDefault();
        dispatch(deleteUserFoodThunk(foodId))
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
              userFoods.slice(startIndex, endIndex).map((food) => (
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
                          <i
                            className="fa-solid fa-circle-minus"
                            style={{ color: "#ff0000" }}
                          ></i>
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedFood(food);
                            setIsPanelOpen(true);
                          }}
                        >
                          <i className="fa-solid fa-pen-to-square" />
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
              <div className="exercise-card-no-exercises">
                <h4>No Foods, add one from above </h4>
              </div>
            )}
          </table>
          <div className="pagination-my-exercise-button-container">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="previous-my-exercise-button"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="next-my-exercise-button"
              disabled={
                currentPage === Math.ceil(userFoods.length / foodsPerPage) ||
                userFoods.length === 0
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );


}

export default MyFoodPage;
