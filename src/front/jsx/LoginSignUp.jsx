import React from "react";

export function LoginSignUp(props) {
    const { login, signUp } = props;

    return (
        <div className="wrapper">
            <nav className="nav">
                <div className="nav-logo">
                    <p>Pet Tinder</p>
                </div>
                <div className="nav-menu">
                    <ul>
                        <li><a href="#" className="link active">Home</a></li>
                        <li><a href="#" className="link active">Profiles</a></li>
                        <li><a href="#" className="link active">Services</a></li>
                        <li><a href="#" className="link active">About</a></li>
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

            {/* Form Box */}
            <div className="form-box">

                {/* Login Form */}
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
                        <i className="bx bx-lock-alt"></i>
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
}