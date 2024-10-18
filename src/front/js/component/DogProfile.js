import React from 'react';
import TinderCard from 'react-tinder-card';
import PropTypes from 'prop-types';

const DogProfile = ({ dog, onLike, onDiscard, onViewProfile }) => {
  
  const swiped = async (direction) => {
    if (direction === 'right') {
      // Call the onLike function passed as a prop
      await handleLike(dog.id);
    } else if (direction === 'left') {
      // Call the onDiscard function passed as a prop
      onDiscard(dog.id);
    }
  };

  // Function to call the API when a dog is liked
  const handleLike = async (dogId) => {
    try {
      const response = await fetch('https://shiny-doodle-976pjp6r9q7r3x9jw-3001.app.github.dev/swipe/right', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you're storing the token in localStorage
        },
        body: JSON.stringify({ targetDogId: dogId }) // Now using targetDogId for dog profile
      });
  
      if (response.ok) {
        console.log('Dog liked successfully!');
      } else {
        console.error('Error liking the dog');
      }
    } catch (error) {
      console.error('Failed to like the dog:', error);
    }
  };
  

  return (
    <div className="dog-profile-card">
      <TinderCard
        className="swipe"
        onSwipe={swiped}
        preventSwipe={['up', 'down']}
      >
        <div
          className="card"
          style={{ backgroundImage: `url(${dog.photos[0]})`, backgroundSize: 'cover' }}
        >
          <div className="dog-info">
            <h3>{dog.username}</h3>
            <p>Age: {dog.age}</p>
            <p>Location: {dog.city}, {dog.state}</p>
          </div>

          {/* Buttons for Like, Discard, and View Profile */}
          <div className="action-buttons">
            <button className="discard-btn" onClick={() => onDiscard(dog.id)}>❌</button>
            <button className="view-btn" onClick={() => onViewProfile(dog.id)}>👁️</button>
            <button className="like-btn" onClick={() => handleLike(dog.id)}>❤️</button>
          </div>
        </div>
      </TinderCard>
    </div>
  );
};

DogProfile.propTypes = {
  dog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    age: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired,
  onViewProfile: PropTypes.func.isRequired
};

export default DogProfile;
