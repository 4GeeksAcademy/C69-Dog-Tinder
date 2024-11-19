import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserCreation.css';

export function UserCreation({ rememberMe }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
       setFormData({ ...formData, [name]: value })
         
    };

    const handleSubmit = async (event) => {
        event.preventDefault();



            // Validate password and confirm password match
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            // Register user
            const requestData = {
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirmPassword
            };

            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
            
                if (response.status == 201) {
                    const result = await response.json();
                    console.log(result); // Verifica el resultado aquí
                    localStorage.setItem('token', result.token);
                    navigate("/dog-profile-creation")
                } else {
                    const errorMsg = await response.json();
                    console.log(errorMsg); // Verifica el mensaje de error aquí
                    setError(errorMsg.message || 'Registration failed');
                }
            } catch (error) {
                console.error('Network error:', error); // Muestra errores de red
                setError('An error occurred while processing your request.');            
            } finally {
                setIsLoading(false);
            }
       
    };

    return (
        <div className="register-container">
            <h2>Join now!</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="two-forms">
                
                
                    <>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
             
                <div className="input-box">
                    <input 
                        type="submit" 
                        className="submit" 
                        value="Sign Up" 
                        disabled={isLoading} 
                    />
                </div>
            </form>
        </div>
    );
}

export default UserCreation;