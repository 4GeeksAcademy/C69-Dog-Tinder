import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; // Importa el contexto
import '../../styles/Login.css';

export const Login = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { actions } = useContext(Context); // Accede a `actions` desde el contexto

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const result = await response.json();
                actions.login(result.token, result.userId); // Llama a `login` desde `actions`
                navigate('/swipe'); // Redirige después de un inicio de sesión exitoso
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
