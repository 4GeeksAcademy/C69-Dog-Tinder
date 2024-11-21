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
    }, [actions, store.dogProfile]);

    const handleEditToggle = () => {
        if (!isEditing) {
            setEditProfile({ ...store.dogProfile }); // Copiar datos al activar edición
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            await actions.updateDogProfile(editProfile); // Enviar datos actualizados al backend
            setIsEditing(false); // Salir del modo de edición
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save changes. Please try again.');
        }
    };

    // Asegúrate de que el estado `editProfile` está listo antes de renderizar
    if (error) {
        return <p>{error}</p>;
    }

    if (!store.dogProfile) {
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
