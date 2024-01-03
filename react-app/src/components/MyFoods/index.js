import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import FoodLogModal from "../FoodLogModal";
import EditFoodPanel from "../EditFoodPanel";
import { getUserFoodsThunk, deleteUserFoodThunk } from "../../store/userFoods";
import "./MyFoods.css";


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
      <div className="food-container">
        <div className="all-food-cards">
          <div className="my-foods-title-container">
            <span>My Foods</span>
          </div>
          <div className="my-food-text">
            <p>
              Welcome to the food section! Here you can view all of your Foods
            </p>
          </div>
          <table className="my-food-table">
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
                        <button
                          onClick={(e) => handleDelete(e, food.id)}
                          style={{
                            padding: "0",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          title="Delete"
                        >
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
                          style={{
                            padding: "0",
                            border: "none",
                            backgroundColor: "transparent",
                            cursor: "pointer",
                          }}
                          title="Edit"
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
              <div className="food-card-no-foods">
                <h4>No Foods, add one from above </h4>
              </div>
            )}
          </table>
          <div className="pagination-my-foods-button-container">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="previous-my-foods-button"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="next-my-foods-button"
              disabled={
                currentPage === Math.ceil(userFoods.length / foodsPerPage) ||
                userFoods.length === 0
              }
            >
              Next
            </button>
          </div>
        </div>
        <div className="edit-foods-panel-parent">
          {isPanelOpen && (
            <EditFoodPanel
              selectedFood={selectedFood}
              foodId={selectedFood.id}
              setIsPanelOpen={setIsPanelOpen}
            />
          )}
        </div>
      </div>
    );


}

export default MyFoodPage;
