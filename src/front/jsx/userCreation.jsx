import React from "react";

export function UserCreation(props) {
    const { login, signUp, rememberMe } = props;

    return (
        <div className="register-container" id="register">
            <div className="top">
                <span>Have an account? <a href="#" onClick={login}>login</a></span>
                <header>Sign Up</header>
            </div>
            <div className="two-forms">
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="First name" />
                    <i className="bx bx-user"></i>
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="Last name" />
                    <i className="bx bx-user"></i>
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="Email" />
                    <i className="bx bx-envelope"></i>
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" />
                    <i className="bx bx-lock-alt"></i>
                </div>
                <div className="input-box">
                    <input type="submit" className="submit" value="Register" />
                    <i className="bx bx-lock-alt"></i>
                </div>
                <div className="two-col">
                    <div className="one">
                        <label htmlFor="register-check">
                            <input type="checkbox" id="register-check" /> Remember Me
                        </label>
                    </div>
                    <div className="two">
                        <label><a href="#">Terms & Conditions</a></label>
                    </div>
                </div>
            </div>
        </div>
    );
}