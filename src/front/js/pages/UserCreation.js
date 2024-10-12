import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Replacing useHistory with useNavigate
import '../../styles/UserCreation.css'; // Ensure you have this CSS file for styling

export function UserCreation({ rememberMe }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading state
        setError(null); // Reset previous error

        const requestData = {
            username: `${formData.firstName} ${formData.lastName}`, // Combine first and last name
            email: formData.email,
            password: formData.password
        };

        try {
            const response = await fetch('https://shiny-doodle-976pjp6r9q7r3x9jw-3001.app.github.dev/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Handle success
                navigate('/login'); // Redirect to login after successful registration
            } else {
                const errorMsg = await response.json();
                setError(errorMsg.message || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred while processing your request.');
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <div className="register-container">
            <h2> Join now! </h2>
            {error && <p className="error-message">{error}</p>} {/* Display error messages */}
            <form onSubmit={handleSubmit} className="two-forms">
                <div className="input-box">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                        type="submit" 
                        className="submit" 
                        value={isLoading ? "Signing Up..." : "Sign Up"} 
                        disabled={isLoading} 
                    />
                </div>
                <div className="two-col">
                    <div>
                        <label htmlFor="register-check">
                            <input type="checkbox" id="register-check" onChange={rememberMe} /> Remember Me 
                        </label>
                    </div>                   
                </div>
            </form>
            <div className="top">
                <p>Already have an account? <a href="#" onClick={() => navigate('/login')}>Login</a></p>
            </div>
        </div>
    );
}
