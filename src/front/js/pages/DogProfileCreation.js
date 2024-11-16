import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DogProfileCreation() {
    const [formData, setFormData] = useState({
        dog_name: '',
        age: '',
        breed: '',
        bio: '',
        photos: ''
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

        const token = localStorage.getItem('token'); // Assuming token is stored after registration

        const requestData = {
            dog_name: formData.dog_name,
            age: formData.age,
            breed: formData.breed,
            bio: formData.bio,
            photos: formData.photos.split(',')  // Assuming comma-separated photo URLs
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/users/dog-profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dogData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                navigate('/'); // Redirect to home or swipe page
            } else {
                const errorMsg = await response.json();
                setError(errorMsg.message || 'Dog profile creation failed');
            }
        } catch (error) {
            setError('An error occurred while processing your request.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <h2>Create your Dog's Profile</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="text"
                        name="dog_name"
                        placeholder="Dog Name"
                        value={formData.dog_name}
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
                        name="breed"
                        placeholder="Breed"
                        value={formData.breed}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        name="photos"
                        placeholder="Photos (comma-separated URLs)"
                        value={formData.photos}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-box">
                    <input
                        type="submit"
                        className="submit"
                        value={isLoading ? "Creating..." : "Create Profile"}
                        disabled={isLoading}
                    />
                </div>
            </form>
        </div>
    );
}


export default DogProfileCreation;
