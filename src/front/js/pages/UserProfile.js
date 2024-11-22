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
    
    const token = localStorage.getItem("token");
console.log(token, "token number");
if (token == null) {
    navigate("/login");
}

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

<div className="main-header">
    {store.dogProfile.photos.length > 0 && (
        <img
            className="main-photo"
            src={store.dogProfile.photos[0]}
            alt={`${store.dogProfile.dog_name} main photo`}
        />
    )}
    {isEditing ? (
        <input
            type="text"
            value={editProfile?.dog_name || ''}
            className="dog-name-input"
            onChange={(e) => setEditProfile({ ...editProfile, dog_name: e.target.value })}
        />
    ) : (
        <h1 className="dog-name">{store.dogProfile.dog_name}</h1>
    )}
    <div className="button-container">
        {isEditing && (
            <button className="save-button" onClick={handleSave}>
                Save Changes
            </button>
        )}
        <button className="edit-button" onClick={handleEditToggle}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
    </div>
</div>

<div className="dog-info">
    <div className="info-row">
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
    </div>
    <div className="info-row">
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
    </div>
    <div className="info-row">
        <label>Bio:</label>
        {isEditing ? (
            <textarea
                value={editProfile?.bio || ''}
                onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
            />
        ) : (
            <p>{store.dogProfile.bio}</p>
        )}
    </div>
</div>

<div className={`dog-photos ${isEditing ? "editing" : ""}`}>
    <h3>My Photos</h3>
    {isEditing ? (
        <>
            <textarea
                value={editProfile?.photos.slice(1).join(', ') || ''}
                onChange={(e) =>
                    setEditProfile({
                        ...editProfile,
                        photos: [store.dogProfile.photos[0], ...e.target.value.split(',').map((url) => url.trim())],
                    })
                }
                placeholder="Enter photo URLs separated by commas"
            />
            <p className="help-text">Add URLs separated by commas. The first photo is your main photo.</p>
        </>
    ) : (
        store.dogProfile.photos.slice(1).map((photo, index) => (
            <img key={index} src={photo} alt={`Photo ${index + 1}`} />
        ))
    )}
</div>
</div>
);
};

export default UserProfile;