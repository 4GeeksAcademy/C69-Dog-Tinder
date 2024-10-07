import React, { useState, useEffect } from 'react';
import DogProfile from './DogProfile';

const DogList = ({ userId }) => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDogProfiles = async () => {
      try {
        const response = await fetch(`/users/${userId}/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setDogs(data.profiles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dog profiles:', error);
      }
    };

    fetchDogProfiles();
  }, [userId]);

  const handleLike = async (dogId) => {
    try {
      const response = await fetch('/swipe/right', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: userId,
          targetUserId: dogId
        })
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error liking the dog:', error);
    }
  };

  const handleDiscard = (dogId) => {
    console.log(`Discarded dog with ID: ${dogId}`);
  };

  const handleViewProfile = (dogId) => {
    // Logic to show the full profile, e.g., navigate to a profile detail page
    console.log(`Viewing full profile of dog ID: ${dogId}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dog-list">
      {dogs.map((dog) => (
        <DogProfile
          key={dog.id}
          dog={dog}
          onLike={handleLike}
          onDiscard={handleDiscard}
          onViewProfile={handleViewProfile}
        />
      ))}
    </div>
  );
};

export default DogList;
