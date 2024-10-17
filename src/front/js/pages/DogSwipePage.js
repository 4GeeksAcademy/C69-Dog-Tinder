import React, { useState, useEffect } from 'react';
import DogProfile from '../component/DogProfile'; // Import your DogProfile component

const DogSwipePage = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available dogs when the component is mounted
  useEffect(() => {
    const fetchAvailableDogs = async () => {
      try {
        const response = await fetch('https://shiny-doodle-976pjp6r9q7r3x9jw-3001.app.github.dev/dogs/available', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Assume token is stored in localStorage
          }
        });

        if (response.ok) {
          const data = await response.json();
          setDogs(data.available_dogs); // Set the available dogs
        } else {
          setError('Failed to load dogs');
        }
      } catch (error) {
        setError('Error fetching dogs');
      } finally {
        setLoading(false); // Set loading to false once the request is done
      }
    };

    fetchAvailableDogs(); // Call the function to fetch dogs when the component mounts
  }, []); // Empty dependency array ensures this runs only once when the component mounts

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
            onLike={(id) => console.log(`Liked dog with id: ${id}`)}
            onDiscard={(id) => console.log(`Discarded dog with id: ${id}`)}
            onViewProfile={(id) => console.log(`View profile of dog with id: ${id}`)}
          />
        ))
      )}
    </div>
  );
};

export default DogSwipePage;
