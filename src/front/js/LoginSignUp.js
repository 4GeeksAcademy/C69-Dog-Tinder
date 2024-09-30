import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

export function LoginSignUp(props) {
    const { login, signUp } = props;

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission
        // Add your login logic here if needed
    };

    return (
        <div className="wrapper">
            <nav className="nav">
                <div className="nav-logo">
                    <p>Pet Tinder</p>
                </div>
                <div className="nav-menu">
                    <ul>
                        <li><Link to="/" className="link active">Home</Link></li>
                        <li><Link to="/profiles" className="link">Profiles</Link></li>
                        <li><Link to="/services" className="link">Services</Link></li>
                        <li><Link to="/about" className="link">About</Link></li>
                    </ul>
                </div>
                <div className="nav-button">
                    <button className="btn white-btn" id="loginbtn" onClick={login}>Sign In</button>
                    <button className="btn white-btn" id="registerbtn" onClick={signUp}>Sign Up</button>
                </div>
                <div className="nav-menu-btn">
                    <i className="bx bx-menu" onClick={() => myMenuFunction()}></i>
                </div>
            </nav>

            <div className="form-box">
                <div className="login-container" id="login">
                    <div className="top">
                        <span>Don't have an account? <a href="#" onClick={signUp}>Sign Up</a></span>
                        <header>Login</header>
                    </div>
                    <form onSubmit={handleSubmit}> {/* Wrap inputs in a form */}
                        <div className="input-box">
                            <input type="text" className="input-field" placeholder="Username or Email" required />
                            <i className="bx bx-envelope"></i>
                        </div>
                        <div className="input-box">
                            <input type="password" className="input-field" placeholder="Password" required />
                            <i className="bx bx-lock-alt"></i>
                        </div>
                        <div className="input-box">
                            <input type="submit" className="submit" value="Sign In" />
                        </div>
                    </form>
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
}