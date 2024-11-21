import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";  // Import Link from react-router-dom for navigation

const Playdates = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    // Fetch the user's matches
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/current_user/matches`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching matches');
        }

        const data = await response.json();
        setMatches(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchMatches();
  }, []);

  const handleUnmatch = async (dogId) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/users/currentUser/unmatch/${dogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error unmatching the dog');
      }

      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.dog_id !== dogId)
      );
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  // Navigate to the match's profile
  const viewProfile = (dogId) => {
    window.location.href = `/dog-profile/${dogId}`; // Direct navigation to the dog's profile
  };

  // Navigate to the chat page with the dog owner (partner)
  const startChat = (dogOwnerId) => {
    window.location.href = `/chat/${dogOwnerId}`; // Direct navigation to the chat page
  };

  if (loading) return <div>Loading...</div>;  // Show loading message
  if (error) return <div className="error-message">{error}</div>;  // Show error message

  return (
    <div className="playdates-container">
      <h2>Your Matches</h2>
      {matches.length === 0 ? (
        <p>You have no matches yet.</p>
      ) : (
        <div className="match-list">
          {matches.map((match) => (
            <div key={match.dog_id} className="match-card">
              <img
                src={match.photos[0]} // Display the first photo of the dog
                alt={match.dog_name}
                className="match-image"
              />
              <div className="match-details">
                <h3>{match.dog_name}</h3>
                <p>{match.bio}</p>
                <p>Breed: {match.breed}</p>
                <div className="match-actions">
                  <button
                    className="view-profile-btn"
                    onClick={() => viewProfile(match.dog_id)}  // View profile button
                  >
                    View Profile
                  </button>
                  <button
                    className="start-chat-btn"
                    onClick={() => startChat(match.dog_id)} // Chat button
                  >
                    Chat
                  </button>
                  <button
                    className="unmatch-btn"
                    onClick={() => handleUnmatch(match.dog_id)} // Unmatch button
                  >
                    Unmatch
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playdates;
