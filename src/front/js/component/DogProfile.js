import React from 'react';
import TinderCard from 'react-tinder-card';
import PropTypes from 'prop-types';

const DogProfile = ({ dog, onLike, onDiscard }) => {
  
  const swiped = (direction) => {
    if (direction === 'right') {
      onLike(dog.id);
    } else if (direction === 'left') {
      onDiscard(dog.id);
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
            <h3>{dog.dog_name}</h3>
            <p>Age: {dog.age}</p>
            <p>Breed: {dog.breed}</p>
          </div>

          <div className="action-buttons">
            <button onClick={() => onDiscard(dog.id)}>❌</button>
            <button onClick={() => onLike(dog.id)}>❤️</button>
          </div>
        </div>
      </TinderCard>
    </div>
  );
};

DogProfile.propTypes = {
  dog: PropTypes.shape({
      id: PropTypes.number.isRequired,
      dog_name: PropTypes.string.isRequired,
      age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Aceptar string o number
      breed: PropTypes.string.isRequired,
      photos: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onDiscard: PropTypes.func.isRequired
};

export default DogProfile;
