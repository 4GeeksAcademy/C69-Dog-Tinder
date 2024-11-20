import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import '../../styles/UserProfile.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [userData, setUserData] = useState(null); 
    const [dogProfile, setDogProfile] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user profile has a valid ID before making the request
        const userId = store.userProfile?.id || store.userProfile?.userId; 
        if (userId) {
            setUserData(store.userProfile);
            actions.fetchDogProfile(userId);
        } else {
            console.error('User ID is undefined. Cannot fetch dog profile.');
        }
    }, [store.userProfile]);

    useEffect(() => {
        if (store.dogProfile) {
            setDogProfile(store.dogProfile);
        }
    }, [store.dogProfile]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        // Save the updated data to the backend
        const userId = store.userProfile?.id || store.userProfile?.userId;
        if (userId) {
            actions.updateDogProfile(userId, dogProfile);
            setIsEditing(false);
        } else {
            console.error('User ID is undefined. Cannot update dog profile.');
        }
    };

    if (!userData || !dogProfile) {
        return <p>Loading...</p>;
    }

    return (
        <div className="user-profile-container">
            <div className="user-info">
                <h1>Welcome, {userData.email}</h1>
                <button className="edit-button" onClick={handleEditToggle}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>
            
            <div className="dog-profile">
                <h2>Your Dog's Profile</h2>
                <div className="dog-info">
                    <label>Dog Name:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={dogProfile.dog_name}
                            onChange={(e) => setDogProfile({ ...dogProfile, dog_name: e.target.value })}
                        />
                    ) : (
                        <p>{dogProfile.dog_name}</p>
                    )}

                    <label>Age:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={dogProfile.age}
                            onChange={(e) => setDogProfile({ ...dogProfile, age: e.target.value })}
                        />
                    ) : (
                        <p>{dogProfile.age} years</p>
                    )}

                    <label>Breed:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={dogProfile.breed}
                            onChange={(e) => setDogProfile({ ...dogProfile, breed: e.target.value })}
                        />
                    ) : (
                        <p>{dogProfile.breed}</p>
                    )}

                    <label>Bio:</label>
                    {isEditing ? (
                        <textarea
                            value={dogProfile.bio}
                            onChange={(e) => setDogProfile({ ...dogProfile, bio: e.target.value })}
                        />
                    ) : (
                        <p>{dogProfile.bio}</p>
                    )}

                    <label>Photos:</label>
                    {isEditing ? (
                        <textarea
                            value={dogProfile.photos.join(', ')}
                            onChange={(e) =>
                                setDogProfile({
                                    ...dogProfile,
                                    photos: e.target.value.split(',').map((url) => url.trim()),
                                })
                            }
                        />
                    ) : (
                        <div className="dog-photos">
                            {dogProfile.photos.map((photo, index) => (
                                <img key={index} src={photo} alt={`${dogProfile.dog_name} photo`} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <button className="save-button" onClick={handleSave}>
                    Save Changes
                </button>
            )}
        </div>
    );
};

export default UserProfile;