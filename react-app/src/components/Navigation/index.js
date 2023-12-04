import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/session";
import "./Navigation.css";
import { useHistory } from "react-router-dom";

function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);

  const logoutUser = async (e) => {
    e.preventDefault();
    await dispatch(logout());
    history.replace("/");
    return;
  };

  return (
    <ul className="nav-bar-list">
      {sessionUser ? (
        <li>
          <NavLink id="nav-link-to-home" exact to="/my-home/diary">
            <p id="project-title">fitfolio</p>
          </NavLink>
        </li>
      ) : (
        <li>
          <NavLink id="nav-link-to-home" exact to="/">
            <p id="project-title">fitfolio</p>
          </NavLink>
        </li>
      )}
      {isLoaded && !sessionUser ? (
        <div className="nav-login-signup">
          <li>
            <NavLink className="login-signup-link" to="/login">
              Login
            </NavLink>
          </li>
          <hr
            aria-orientation="vertical"
            style={{ fontSize: "0px", opacity: "0.4" }}
          />
          <li>
            <NavLink className="login-signup-link" to="/signup">
              Sign Up
            </NavLink>
          </li>
        </div>
      ) : (
        <div className="logged-in-nav-bar">
          <span style={{ color: "black", fontWeight: "400" }}>Hello!</span>
          <hr
            aria-orientation="vertical"
            style={{ fontSize: "0px", opacity: "0.4" }}
          />
          <span id="logout-user" onClick={(e) => logoutUser(e)}>
            Log Out
          </span>
          <hr
            aria-orientation="vertical"
            style={{ fontSize: "0px", opacity: "0.4" }}
          />
          <span>Follow Us:</span>
          <a
            target="_blank"
            href="https://github.com/zohaibrajan"
            rel="noreferrer"
          >
            <i
              className="fa-brands fa-square-github"
              style={{ color: "#000000", fontSize: "18px", cursor: "pointer" }}
            ></i>
          </a>
          <a
            target="_blank"
            href="https://www.linkedin.com/in/zohaib-rajan-718198216/"
            rel="noreferrer"
          >
            <i
              className="fa-brands fa-linkedin"
              style={{ color: "#0077b5", fontSize: "18px", cursor: "pointer" }}
            ></i>
          </a>
        </div>
      )}
    </ul>
  );
}

export default Navigation;
