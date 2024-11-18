import React, { useState, useEffect } from 'react';
import DogProfile from '../component/DogProfile';

const DogSwipePage = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setDogs(data);
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

  const handleLike = (id) => {
    console.log(`Liked dog with id: ${id}`);
    // Call API to like dog (e.g., send a POST request to /swipe/right)
  };

  const handleDiscard = (id) => {
    console.log(`Discarded dog with id: ${id}`);
    // Call API to discard dog (e.g., remove dog from UI or update state)
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dog-swipe-page">
      {dogs.length === 0 ? (
        <p>No dogs available for swiping.</p>
      ) : (
        dogs.map((dog) => (
          <DogProfile
            key={dog.id}
            dog={dog}
            onLike={handleLike} // Pass handleLike as prop
            onDiscard={handleDiscard} // Pass handleDiscard as prop
          />
        ))
      )}
    </div>
  );
};

export default DogSwipePage;
