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
						<button>Login</button>
					</li>
					<hr aria-orientation='vertical' style={{fontSize: "0px"}}/>
					<li>
						<button>Sign Up</button>
					</li>
				</div>
			)}
		</ul>
	);
}

export default Navigation;
