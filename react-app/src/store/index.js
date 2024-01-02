import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import cardioExerciseReducer from './cardioExercises';
import weightExerciseReducer from './weightExercises';
import foodsReducer from './foods';
import cardioLogReducer from './cardioLogs';
import weightLogReducer from './weightLogs';
import foodLogReducer from './foodLogs';
import goalReducer from './goal';
import userExercisesReducer from './userOwnedExercises';
import userExercisesFilteredReducer from './userOwnedExercisesFiltered';
import userFoodsReducer from './userFoods';

const rootReducer = combineReducers({
  session,
  cardioExercises: cardioExerciseReducer,
  weightExercises: weightExerciseReducer,
  foods: foodsReducer,
  goal: goalReducer,
  cardioLogs: cardioLogReducer,
  weightLogs: weightLogReducer,
  foodLogs: foodLogReducer,
  userExercises: userExercisesReducer,
  userExercisesFiltered: userExercisesFilteredReducer,
  userFoods: userFoodsReducer
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
