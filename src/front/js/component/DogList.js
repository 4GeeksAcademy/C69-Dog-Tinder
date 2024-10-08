import React, { useEffect, useContext } from 'react';
import DogProfile from './DogProfile';
import { Context } from '../store/appContext'; // Import context from Flux

const DogList = ({ userId }) => {
  const { store, actions } = useContext(Context); // Access store and actions from context

  useEffect(() => {
    actions.fetchUserProfile(userId); // Fetch the user's profiles (or dog profiles)
  }, [userId, actions]);

  if (store.loading) {
    return <p>Loading...</p>; // Loading state
  }

  return (
    <div className="dog-list">
      {store.profiles.map((dog) => (
        <DogProfile
          key={dog.id}
          dog={dog}
          onLike={actions.likeProfile}  // Call like action from Flux
          onDiscard={actions.discardProfile}  // Call discard action from Flux
          onViewProfile={actions.viewProfile}  // Call view profile action from Flux
        />
      ))}
    </div>
  );
};

export default DogList;
