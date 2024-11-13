import React, { useState, useEffect } from 'react';
import DogProfile from '../component/DogProfile';

const DogSwipePage = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available dogs when the component is mounted
  useEffect(() => {
    const fetchAvailableDogs = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/dogs/available`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDogs(data.available_dogs);
        } else {
          setError('Failed to load dogs');
        }
      } catch (error) {
        setError('Error fetching dogs');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDogs();
  }, []);

  // Handler functions for like, discard, and view profile actions
  const handleLike = (id) => {
    console.log(`Liked dog with id: ${id}`);
    // Add any additional logic for handling likes here, like calling an API
  };

  const handleDiscard = (id) => {
    console.log(`Discarded dog with id: ${id}`);
    // Add any additional logic for handling discards here
  };

  const handleViewProfile = (id) => {
    console.log(`Viewing profile of dog with id: ${id}`);
    // Add any additional logic to view or navigate to the profile
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error state if something went wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the available dogs using the DogProfile component
  return (
    <div className="dog-swipe-page">
      {dogs.length === 0 ? (
        <p>No dogs available for swiping.</p>
      ) : (
        dogs.map((dog) => (
          <DogProfile
            key={dog.dog_id}
            dog={dog}
            onLike={handleLike} // Pass handleLike as prop
            onDiscard={handleDiscard} // Pass handleDiscard as prop
            onViewProfile={handleViewProfile} // Pass handleViewProfile as prop
          />
        ))
      )}
    </div>
  );
};

export default DogSwipePage;
