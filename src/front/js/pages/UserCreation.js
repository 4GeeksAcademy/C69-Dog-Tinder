import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserCreation.css';

export function UserCreation({ rememberMe }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [dogData, setDogData] = useState({
        dog_name: '',
        age: '',
        breed: '',
        bio: '',
        photos: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1);  // Step 1 for user registration, Step 2 for dog profile creation
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        step === 1 
          ? setFormData({ ...formData, [name]: value })
          : setDogData({ ...dogData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); 
        setError(null);

        if (step === 1) {
            // Validate password and confirm password match
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match.");
                setIsLoading(false);
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
            
                if (response.ok) {
                    const result = await response.json();
                    console.log(result); // Verifica el resultado aquí
                    localStorage.setItem('token', result.token);
                    setStep(2); // Pasa al paso de creación del perfil del perro
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
        } else {
            // Create dog profile
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a dog profile.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/users/register`,  {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dogData)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(result.message); // Handle success
                    navigate('/swipe'); // Redirect to swipe page after successful profile creation
                } else {
                    const errorMsg = await response.json();
                    setError(errorMsg.message || 'Dog profile creation failed');
                }
            } catch (error) {
                setError('An error occurred while processing your request.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="register-container">
            <h2>{step === 1 ? 'Join now!' : 'Create Your Dog Profile'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="two-forms">
                {step === 1 ? (
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
                ) : (
                    <>
                        <div className="input-box">
                            <input
                                type="text"
                                name="dog_name"
                                placeholder="Dog's Name"
                                value={dogData.dog_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="number"
                                name="age"
                                placeholder="Dog's Age"
                                value={dogData.age}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="text"
                                name="breed"
                                placeholder="Dog's Breed"
                                value={dogData.breed}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-box">
                            <textarea
                                name="bio"
                                placeholder="Short Bio"
                                value={dogData.bio}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
                <div className="input-box">
                    <input 
                        type="submit" 
                        className="submit" 
                        value={isLoading ? "Processing..." : (step === 1 ? "Sign Up" : "Create Dog Profile")} 
                        disabled={isLoading} 
                    />
                </div>
            </form>
        </div>
    );
}

export default UserCreation;