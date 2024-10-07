import React, { useState, useEffect } from 'react';
import DogProfile from './DogProfile';

const Playdates = ({ userId }) => {
  const [playdates, setPlaydates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaydates = async () => {
      try {
        const response = await fetch(`/users/${userId}/matched`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        setPlaydates(data.matches);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching playdates:', error);
      }
    };

    fetchPlaydates();
  }, [userId]);

  if (loading) {
    return <p>Loading playdates...</p>;
  }

  return (
    <div className="playdates-list">
      {playdates.map((dog) => (
        <DogProfile
          key={dog.id}
          dog={dog}
          onLike={() => {}}
          onDiscard={() => {}}
          onViewProfile={() => {}}
        />
      ))}
    </div>
  );
};

export default Playdates;
