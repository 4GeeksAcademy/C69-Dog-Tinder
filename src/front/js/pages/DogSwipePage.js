import React, { useState, useEffect } from 'react';
import DogProfile from '../component/DogProfile';
import { useNavigate } from 'react-router-dom';

const DogSwipePage = () => {
  const [dogs, setDogs] = useState([]);  // List of all available dogs
  const [currentDogIndex, setCurrentDogIndex] = useState(0);  // Index of the current dog being displayed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [userDog, setUserDog] = useState(null);
  const token = localStorage.getItem("token")
  const navigate = useNavigate();

  if (token==null){navigate("/login")}
  useEffect(() => {
    const fetchUserSettingsAndDogProfile = async () => {
      try {
        // Fetch the user's settings
        const settingsResponse = await fetch(`${process.env.BACKEND_URL}/api/users/settings`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!settingsResponse.ok) {
          throw new Error('Failed to fetch user settings');
        }
        const settingsData = await settingsResponse.json();
        setUserSettings(settingsData);

        // Fetch the user's dog profile
        const dogProfileResponse = await fetch(`${process.env.BACKEND_URL}/api/users/dog-profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!dogProfileResponse.ok) {
          throw new Error('Failed to fetch dog profile');
        }
        const dogProfileData = await dogProfileResponse.json();
        setUserDog(dogProfileData);
      } catch (error) {
        setError('Error fetching user settings or dog profile');
        setLoading(false);
      }
    };

    fetchUserSettingsAndDogProfile();
  }, []);

  useEffect(() => {
    const fetchAvailableDogs = async () => {
      try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/dogs/available`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dogs');
        }
        const dogsData = await response.json();

        // Filter dogs based on user settings and distance
        const filteredDogs = await filterDogs(dogsData);
        setDogs(filteredDogs);
      } catch (error) {
        setError('Error fetching available dogs');
      } finally {
        setLoading(false);
      }
    };

    if (userDog && userSettings) {
      fetchAvailableDogs();
    }
  }, [userDog, userSettings]);

  // Function to fetch geolocation and calculate distance
  const getGeoLocation = async (city, state) => {
    const apiKey = process.env.REACT_APP_GEOLOCATION_API_KEY;
    if (!apiKey) {
      console.error("API key is missing");
      return null;
    }
    const query = `${city}, ${state}`;
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        return { lat, lng };
      }
      throw new Error('Geolocation not found');
    } catch (error) {
      console.error('Error fetching geolocation:', error);
      return null;
    }
  };

  // Haversine formula to calculate distance
  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 3956; // Earth radius in miles
    const lat1Rad = Math.radians(lat1);
    const lon1Rad = Math.radians(lon1);
    const lat2Rad = Math.radians(lat2);
    const lon2Rad = Math.radians(lon2);

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));

    return R * c; // Distance in miles
  };

  // Convert degrees to radians
  Math.radians = function (degrees) {
    return degrees * (Math.PI / 180);
  };

  // Filter dogs based on user settings and location
  const filterDogs = async (dogsData) => {
    const { city, state } = userDog;
    
    // Get user's location first
    const userLocation = await getGeoLocation(city, state);
    if (!userLocation) return [];

    const { lat: userLat, lng: userLon } = userLocation;

    const filteredDogsPromises = dogsData.map(async (dog) => {
      const dogLocation = await getGeoLocation(dog.city, dog.state);
      if (!dogLocation) return false;

      const { lat: dogLat, lng: dogLon } = dogLocation;

      // Calculate the distance between the user and the dog
      const distance = haversine(userLat, userLon, dogLat, dogLon);

      // Return dog if it fits user settings and distance
      return (
        dog.age >= userSettings.min_age &&
        dog.age <= userSettings.max_age &&
        distance <= userSettings.max_distance
      );
    });

    // Wait for all promises to resolve before setting the state
    const filteredDogs = await Promise.all(filteredDogsPromises);
    return dogsData.filter((_, index) => filteredDogs[index]);
  };

  const handleLike = async (id) => {
    console.log(`Liked dog with id: ${id}`);

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
      setCurrentDogIndex((prevIndex) => prevIndex + 1);
    } else {
      console.error('Failed to like dog');
    }
  };

  const handleDiscard = () => {
    console.log('Discarded current dog');
    setCurrentDogIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (dogs.length === 0 || currentDogIndex >= dogs.length) {
    return <p>No dogs available for swiping that meet your settings criteria.</p>;
  }

  const currentDog = dogs[currentDogIndex];
  
  return (
    <div className="dog-swipe-page">
      <DogProfile
        key={currentDog.id}
        dog={currentDog}
        onLike={() => handleLike(currentDog.id)}  
        onDiscard={handleDiscard}  
      />
    </div>
  );
};

export default DogSwipePage;
