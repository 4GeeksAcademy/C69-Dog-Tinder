import React from 'react';

const DogProfile = ({ profile, currentUserId }) => {
    const handleLike = async () => {
        const response = await fetch('/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currentUserId,  
                target_user_id: profile.user_id,  
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("You liked this dog!");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="card" style={{ width: '18rem' }}>
            <img src={profile.photos} className="card-img-top" alt={profile.breed} />
            <div className="card-body">
                <h5 className="card-title">{profile.username}</h5>
                <p className="card-text"><strong>Bio:</strong> {profile.bio}</p>
                <p className="card-text"><strong>Age:</strong> {profile.age}</p>
                <p className="card-text"><strong>Breed:</strong> {profile.breed}</p>
                <p className="card-text"><strong>Location:</strong> {profile.city}, {profile.state}</p>
                <p className="card-text"><strong>Temperament:</strong> {profile.temperment}</p>
                <p className="card-text"><strong>Looking for:</strong> {profile.looking_for}</p>
                <button className="btn btn-primary" onClick={handleLike}>Like</button>
            </div>
        </div>
    );
}

export default DogProfile;

