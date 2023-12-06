import React from "react";
import "./HomeNavBar.css"
import { useHistory } from "react-router-dom";


function HomeNavBar({ path }) {
    const history = useHistory()
    let homeClassName = "my-home"
    let goalClassName = "my-goal"

    if (path === "home") {
        homeClassName = "my-home-active"
        goalClassName = "my-goal"
    } else {
        goalClassName = "my-goal-active";
        homeClassName = "my-home";
    }

    const home = () => {
        homeClassName = "my-home-active";
        goalClassName = "my-goal";
        history.replace("/my-home/diary")
    }

    const goal = () => {
        goalClassName = "my-goal-active";
        homeClassName = "my-home";
        history.replace("/my-home/goal")
    }
    return (
        <div className="home-page-nav-bar">
            <div onClick={home} className={homeClassName}>My Home</div>
            <div onClick={goal} className={goalClassName}>Goal</div>
        </div>
    )
}

export default HomeNavBar
