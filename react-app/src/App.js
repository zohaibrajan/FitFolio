import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomeNavBar from "./components/HomeNavBar";
import Diary from "./components/Diary";
import Goal from "./components/Goal";
import ExercisePage from "./components/ExercisePage";
import PageNotFound from "./components/PageNotFound";
import FoodPage from "./components/FoodPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <ProtectedRoute exact path="/my-home/diary">
            <HomeNavBar path={"home"}/>
            <Diary />
          </ProtectedRoute>
          <ProtectedRoute exact path="/my-home/goal">
            <HomeNavBar path={"goal"}/>
            <Goal />
          </ProtectedRoute>
          <ProtectedRoute exact path="/my-home/exercise">
            <HomeNavBar path={"exercise"}/>
            <ExercisePage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/my-home/food">
            <HomeNavBar path={"food"}/>
            <FoodPage />
          </ProtectedRoute>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route>
            <PageNotFound />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
