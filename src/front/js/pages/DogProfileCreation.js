import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DogProfileCreation = () => {
    const [formData, setFormData] = useState({
        dogName: '',
        breed: '',
        age: '',
        bio: '',
        photos: '' // You can handle multiple photos or a single one for now
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
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://shiny-doodle-976pjp6r9q7r3x9jw-3001.app.github.dev/users/<userId>/dog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/swipe'); // Redirect to swipe page after successfully creating the dog profile
            } else {
                const errorMsg = await response.json();
                setError(errorMsg.message || 'Failed to create dog profile');
            }
        } catch (error) {
            setError('An error occurred while processing your request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dog-profile-container">
            <h2>Create Your Dog's Profile</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        name="dogName"
                        placeholder="Dog's Name"
                        value={formData.dogName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        name="breed"
                        placeholder="Breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        name="bio"
                        placeholder="A little about your dog"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        name="photos"
                        placeholder="Photos URL" // You can handle file upload later
                        value={formData.photos}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-box">
                    <input
                        type="submit"
                        className="submit"
                        value={isLoading ? 'Saving...' : 'Create Profile'}
                        disabled={isLoading}
                    />
                </div>
            </form>
        </div>
    );
};

export default DogProfileCreation;
