import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
	const sessionUser = useSelector(state => state.session.user);

	return (
		<ul className='nav-bar-list'>
			<li>
				<NavLink id='nav-link-to-home' exact to="/">
					<p id='project-title'>
						fitfolio
					</p>
				</NavLink>
			</li>
			{isLoaded && (
				<div className='nav-login-signup'>
					<li>
						<NavLink to="/login">Login</NavLink>
					</li>
					<hr aria-orientation='vertical' style={{fontSize: "0px", opacity: "0.4"}}/>
					<li>
						<NavLink to="/signup">Sign Up</NavLink>
					</li>
				</div>
			)}
		</ul>
	);
}

export default Navigation;
