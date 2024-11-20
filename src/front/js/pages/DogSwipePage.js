import React, { useState, useEffect } from 'react';
import DogProfile from '../component/DogProfile';

const DogSwipePage = () => {
  const [dogs, setDogs] = useState([]);  // List of all available dogs
  const [currentDogIndex, setCurrentDogIndex] = useState(0);  // Index of the current dog being displayed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableDogs = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/dogs/available`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDogs(data);  // Set the list of dogs
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

  const handleLike = async (id) => {
    console.log(`Liked dog with id: ${id}`);

    // Send API request to like the dog
    const response = await fetch(`${process.env.BACKEND_URL}/api/swipe/right`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ targetDogId: id }),
    });

    if (response.ok) {
      console.log('Dog liked successfully');
      // Move to the next dog
      setCurrentDogIndex(prevIndex => prevIndex + 1);
    } else {
      console.error('Failed to like dog');
    }
  };

  const handleDiscard = () => {
    console.log('Discarded current dog');
    // Simply move to the next dog without doing anything
    setCurrentDogIndex(prevIndex => prevIndex + 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Check if there are any dogs to display
  if (dogs.length === 0 || currentDogIndex >= dogs.length) {
    return <p>No dogs available for swiping.</p>;
  }

  const currentDog = dogs[currentDogIndex];

  return (
    <div className="dog-swipe-page">
      <DogProfile
        key={currentDog.id}
        dog={currentDog}
        onLike={() => handleLike(currentDog.id)}  // Like current dog
        onDiscard={handleDiscard}  // Discard current dog
      />
    </div>
  );
};

export default DogSwipePage;
