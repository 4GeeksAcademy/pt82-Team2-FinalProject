import { Link } from "react-router-dom";
import "./Navbar.css";
import useGlobalReducer from "../hooks/useGlobalReducer";
import React, { useState, useEffect } from "react";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const [showConfirm, setShowConfirm] = useState(false);
	const [userProfilePicture, setUserProfilePicture] = useState(null);

	useEffect(() => {
		const updateProfilePicture = () => {
			const userData = localStorage.getItem('userData') || localStorage.getItem('userProfile');
			if (userData) {
				try {
					const parsedData = JSON.parse(userData);
					setUserProfilePicture(parsedData.profilePicture);
				} catch {
					setUserProfilePicture(null);
				}
			} else {
				setUserProfilePicture(null);
			}
		};

		updateProfilePicture();

		window.addEventListener('storage', updateProfilePicture);
		window.addEventListener('userDataUpdate', updateProfilePicture);

		return () => {
			window.removeEventListener('storage', updateProfilePicture);
			window.removeEventListener('userDataUpdate', updateProfilePicture);
		};
	}, [store.isLoggedIn]);

	const handleLogout = () => {
		setShowConfirm(true);
	};

	const confirmLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userData');
		dispatch({ type: "LOGOUT" });
		setShowConfirm(false);
	};

	const cancelLogout = () => {
		setShowConfirm(false);
	};

	return (
		<nav className="navbar">
			<Link to="/" className="logo">E-Venture</Link>
			<div className="nav-actions">
				<Link to="/dashboard" className="events-btn">
					Dashboard
				</Link>
				<Link to="/discover" className="events-btn">
					Discover
				</Link>
				{store.isLoggedIn ? (
					<>
						<Link to="/createevent" className="signup" style={{ fontWeight: 700, padding: "0.3rem 0.8rem" }}>
							+ Create Event
						</Link>
						<Link to="/profile" className="login profile-link">
							{userProfilePicture ? (
								<img src={userProfilePicture} alt="Profile" className="navbar-profile-pic" />
							) : (
								<span className="navbar-profile-icon" aria-label="User Profile Icon">👤</span>
							)}
							Profile
						</Link>
						<button className="logout" onClick={handleLogout}>Logout</button>
						{showConfirm && (
							<div className="logout-confirm-popup" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
								<div className="logout-confirm-content">
									<p id="logout-confirm-title">Are you sure you want to log out?</p>
									<button className="logout-confirm" onClick={confirmLogout}>Yes</button>
									<button className="logout-cancel" onClick={cancelLogout}>No</button>
								</div>
							</div>
						)}
					</>
				) : (
					<>
						<Link to="/login" className="login">Login</Link>
						<Link to="/signup" className="signup">Sign Up</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
