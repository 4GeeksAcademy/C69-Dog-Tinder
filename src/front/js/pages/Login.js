import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';


export const Login = ({ login }) => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const navigate = useNavigate(); // Use navigate for routing

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('https://shiny-doodle-976pjp6r9q7r3x9jw-3001.app.github.dev/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Login successful:', result);
                login(result.token, result.userId); // Call login function passed as prop
                navigate('/profiles'); // Redirect to profiles after successful login
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Welcome Back!</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input type="submit" className="submit" value="Login" />
                </div>
            </form>
            <div className="two-col">
                <div>
                    <input type="checkbox" id="login-check" />
                    <label htmlFor="login-check">Remember Me</label>
                </div>
                <div>
                    <a href="#">Forgot password?</a>
                </div>
            </div>
            <div className="top">
                <p>Don't have an account? <a href="#" onClick={() => navigate('/signup')}>Sign Up</a></p>
            </div>
        </div>
    );
};
