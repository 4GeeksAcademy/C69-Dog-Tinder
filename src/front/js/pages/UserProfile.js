import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import '../../styles/UserProfile.css';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [isEditing, setIsEditing] = useState(false); // Controls edit
    const [editProfile, setEditProfile] = useState(null); 
    const [error, setError] = useState(null); // Maneja errores
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user's dog profile only if it's not already available
        if (!store.dogProfile) {
            actions.fetchMyDogProfile()
                .then(() => {
                    if (store.dogProfile) {
                        setEditProfile({ ...store.dogProfile });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to load your dog's profile. Please try again later.");
                });
        } else {
            setEditProfile({ ...store.dogProfile });
        }
    }, [actions, store.dogProfile]);

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditProfile({ ...store.dogProfile }); // Copy data when editing starts
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            // Simple validation before submitting the profile
            if (!editProfile.dog_name || !editProfile.age || !editProfile.breed) {
                setError("Please fill in all the required fields.");
                return;
            }

            await actions.updateDogProfile(editProfile); // Send updated data to the backend
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save changes. Please try again.');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!editProfile) {
        return <p>Loading your dog's profile...</p>;
    }

    return (
        <div className="user-profile-container">
            <div className="user-info">
                <h1>Welcome, {store.userProfile?.email || 'User'}</h1>
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
                            value={editProfile?.dog_name || ''}
                            onChange={(e) => setEditProfile({ ...editProfile, dog_name: e.target.value })}
                        />
                    ) : (
                        <p>{store.dogProfile.dog_name}</p>
                    )}

                    <label>Age:</label>
                    {isEditing ? (
                        <input
                            type="number"
                            value={editProfile?.age || ''}
                            onChange={(e) => setEditProfile({ ...editProfile, age: e.target.value })}
                        />
                    ) : (
                        <p>{store.dogProfile.age} years</p>
                    )}

                    <label>Breed:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editProfile?.breed || ''}
                            onChange={(e) => setEditProfile({ ...editProfile, breed: e.target.value })}
                        />
                    ) : (
                        <p>{store.dogProfile.breed}</p>
                    )}

                    <label>Bio:</label>
                    {isEditing ? (
                        <textarea
                            value={editProfile?.bio || ''}
                            onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                        />
                    ) : (
                        <p>{store.dogProfile.bio}</p>
                    )}

                    <label>Photos:</label>
                    {isEditing ? (
                        <textarea
                            value={editProfile?.photos?.join(', ') || ''}
                            onChange={(e) =>
                                setEditProfile({
                                    ...editProfile,
                                    photos: e.target.value.split(',').map((url) => url.trim()),
                                })
                            }
                        />
                    ) : (
                        <div className="dog-photos">
                            {store.dogProfile.photos.map((photo, index) => (
                                <img key={index} src={photo} alt={`${store.dogProfile.dog_name} photo`} />
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
