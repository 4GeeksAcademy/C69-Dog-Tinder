import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = (props) => {
	const { login, signUp } = props;

	const menuItems = [
		{ name: "Home", href: "#" },
		{ name: "Profiles", href: "#" },
		{ name: "Services", href: "#" },
		{ name: "About", href: "#" },
	];

	const myMenuFunction = () => {
		// Define your menu toggle logic here
	};

	return (
		<div className="wrapper">
			<nav className="nav">
				<div className="nav-logo">
					<p>Pet Tinder</p>
				</div>
				<div className="nav-menu">
					<ul>
						{menuItems.map((item, index) => (
							<li key={index}>
								<a href={item.href} className="link active">
									{item.name}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className="nav-button">
					<button className="btn white-btn" id="loginbtn" onClick={login}>Sign In</button>
					<button className="btn white-btn" id="registerbtn" onClick={signUp}>Sign Up</button>
				</div>
				<div className="nav-menu-btn">
					<i className="bx bx-menu" onClick={myMenuFunction}></i>
				</div>
			</nav>

			<div className="form-box">
				<div className="login-container" id="login">
					<div className="top">
						<span>Don't have an account? <a href="#" onClick={signUp}>Sign Up</a></span>
						<header>Login</header>
					</div>
					<div className="input-box">
						<input type="text" className="input-field" placeholder="Username or Email" />
						<i className="bx bx-envelope"></i>
					</div>
					<div className="input-box">
						<input type="password" className="input-field" placeholder="Password" />
						<i className="bx bx-lock-alt"></i>
					</div>
					<div className="input-box">
						<input type="submit" className="submit" value="Sign In" />
					</div>
					<div className="two-col">
						<div className="one">
							<input type="checkbox" id="Login-check" />
							<label htmlFor="Login-check">Remember Me</label>
						</div>
						<div className="two">
							<label><a href="#">Forgot password?</a></label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
