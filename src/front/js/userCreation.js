import React from "react";

export function UserCreation(props) {
    const { login, signUp, rememberMe } = props;

    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your registration logic here
    };

    return (
        <div className="register-container" id="register">
            <div className="top">
                <span>Have an account? <a href="#" onClick={login}>Login</a></span>
                <header>Sign Up</header>
            </div>
            <form onSubmit={handleSubmit} className="two-forms">
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="First name" required />
                    <i className="bx bx-user" aria-hidden="true"></i>
                </div>
                <div className="input-box">
                    <input type="text" className="input-field" placeholder="Last name" required />
                    <i className="bx bx-user" aria-hidden="true"></i>
                </div>
                <div className="input-box">
                    <input type="email" className="input-field" placeholder="Email" required />
                    <i className="bx bx-envelope" aria-hidden="true"></i>
                </div>
                <div className="input-box">
                    <input type="password" className="input-field" placeholder="Password" required />
                    <i className="bx bx-lock-alt" aria-hidden="true"></i>
                </div>
                <div className="input-box">
                    <input type="submit" className="submit" value="Register" />
                </div>
                <div className="two-col">
                    <div className="one">
                        <label htmlFor="register-check">
                            <input
                                type="checkbox"
                                id="register-check"
                                onChange={rememberMe}
                            /> Remember Me
                        </label>
                    </div>
                    <div className="two">
                        <label><a href="#">Terms & Conditions</a></label>
                    </div>
                </div>
            </form>
        </div>
    );
}