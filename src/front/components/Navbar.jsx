import { Link } from "react-router-dom";
import "./Navbar.css";
import useGlobalReducer from "../hooks/useGlobalReducer";
import React, { useState } from "react";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const [showConfirm, setShowConfirm] = useState(false);

	const handleLogout = () => {
		setShowConfirm(true);
	};

	const confirmLogout = () => {
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
				{store.isLoggedIn ? (
					<>
						<Link to="/profile" className="login">Profile</Link>
						<button className="logout" onClick={handleLogout}>Logout</button>
						{showConfirm && (
							<div className="logout-confirm-popup">
								<div className="logout-confirm-content">
									<p>Are you sure you want to log out?</p>
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
