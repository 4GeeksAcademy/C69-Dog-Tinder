import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DogProfilePage = () => {
  const [dogProfile, setDogProfile] = useState(null);
  const [error, setError] = useState(null);
  const { dogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogProfile = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/dogs/${dogId}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Dog not found');
          }
          throw new Error('An error occurred while fetching the dog profile');
        }
        const data = await response.json();
        setDogProfile(data);
      } catch (error) {
        setError(error.message || 'An unexpected error occurred');
      }
    };

    fetchDogProfile();
  }, [dogId]);

  if (error) return <div>{error}</div>;

  if (!dogProfile) return <div className="loader"></div>;  // Loading spinner

  return (
    <div className="dog-profile-page">
      <h1>{dogProfile.dog_name}'s Profile</h1>
      <div className="dog-info">
        <h3>Breed: {dogProfile.breed}</h3>
        <h4>Age: {dogProfile.age} years</h4>
        <p><strong>Bio:</strong> {dogProfile.bio}</p>
        <p><strong>Location:</strong> {dogProfile.city}, {dogProfile.state}</p>

        <h4>Photos:</h4>
        <div className="dog-photos">
          {dogProfile.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`${dogProfile.dog_name} photo`} />
          ))}
        </div>
      </div>
      <button onClick={() => navigate('/dogs')}>Back to Dog List</button>
    </div>
  );
};

export default DogProfilePage;
