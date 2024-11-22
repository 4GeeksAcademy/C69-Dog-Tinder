import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/DogProfileCreation.css';

export function DogProfileCreation() {
    const [formData, setFormData] = useState({
        dog_name: '',
        age: '',
        breed: '',
        bio: '',
        photos: '',
        city: '',  // Added city field
        state: ''  // Added state field
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Validate form fields
    const validateForm = () => {
        const { dog_name, age, breed, bio, photos, city, state } = formData;
        if (!dog_name || !age || !breed || !bio || !photos || !city || !state) {
            setError('All fields are required.');
            return false;
        }

        // Check if age is a valid number
        if (isNaN(age)) {
            setError('Age must be a valid number.');
            return false;
        }

        // Additional validation for photos (optional, based on your use case)
        const photoUrls = photos.split(',');
        for (let url of photoUrls) {
            if (!isValidUrl(url.trim())) {
                setError('One or more photo URLs are invalid.');
                return false;
            }
        }

        return true;
    };

    // Utility function to check if a string is a valid URL
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return; // Stop submission if validation fails

        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('token'); // Assuming token is stored after registration

        const requestData = {
            dog_name: formData.dog_name,
            age: JSON.parse(formData.age),
            breed: formData.breed,
            bio: formData.bio,
            photos: formData.photos.split(',').map((url) => url.trim()), // Clean URLs
            city: formData.city,  // Add city to requestData
            state: formData.state  // Add state to requestData
        };

        const response = await fetch(`${process.env.BACKEND_URL}/api/users/dog-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });

        console.log(requestData, token);

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            navigate('/swipe'); 
        } else {
            const errorMsg = await response.json();
            setError(errorMsg.message || 'Dog profile creation failed');
        }
        setIsLoading(false);
    };

    return (
        <div className="profile-container">
            <h2>Create your Dog's Profile</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                {/* Form fields for dog details */}
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
                        type="text"
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
                    <textarea
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                        required
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

                {/* New fields for city and state */}
                <div className="input-box">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-box">
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
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
