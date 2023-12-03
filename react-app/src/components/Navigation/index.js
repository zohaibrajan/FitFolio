import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
    <ul className="nav-bar-list">
      <li>
        <NavLink id="nav-link-to-home" exact to="/">
          <p id="project-title">fitfolio</p>
        </NavLink>
      </li>
      {isLoaded && (
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
      )}
    </ul>
  );
}

export default Navigation;
