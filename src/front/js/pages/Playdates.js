import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { Context } from '../store/appContext';
import '../../styles/Playdates.css'; 

const Playdates = ({ userId }) => {
  const { store, actions } = useContext(Context);
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

  // Handling empty state when there are no playdates
  if (!loading && playdates.length === 0) {
    return <p>No playdates found. Try liking more dogs!</p>;
  }

  
  const handleRemoveMatch = (dogId) => {
    actions.removeMatch(dogId);  // Access the removeMatch action from context
    setPlaydates(playdates.filter(dog => dog.id !== dogId));  // Remove the dog from local state
  };

  return (
    <div className="playdates-list">
      {playdates.map((dog) => (
        <div key={dog.id} className="dog-profile">
          <img src={dog.photo || 'default-dog.png'} alt={`${dog.name}'s profile`} />
          <h2>{dog.name}</h2>
          <p>Age: {dog.age}</p>
          <p>Breed: {dog.breed}</p>
          <button onClick={() => handleRemoveMatch(dog.id)}>Remove Match</button>
          <button onClick={() => actions.viewProfile(dog.id)}>View Profile</button>
        </div>
      ))}
    </div>
  );
};


export default Playdates;