const getState = ({ getStore, getActions, setStore }) => {
    const token=localStorage.getItem("token")
    return {
        store: {
            profiles: [],
            JWT_Token: '', 
            messages: [],
            matches: [],
            loading: true, 
            userProfile: null,
            userSettings: null
            
        },

        actions: {
            // Function to log in and store the token and user profile in the state
            login: (token, userId) => {
                setStore({ JWT_Token: token, userProfile: { id: userId } });
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
            },

            // Function to log out
            logout: () => {
                setStore({ JWT_Token: '', userProfile: null });
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
            },

            // Function to create user profile (register user and create dog profile)
            createUserProfile(userData, dogData) {
                setStore({ loading: true });

                fetch('/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to register');
                    return response.json();
                })
                .then(result => {
                    setStore({ JWT_Token: result.token });
                    return fetch('/api/users/dog-profile', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${result.token}`
                        },
                        body: JSON.stringify(dogData)
                    });
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to create dog profile');
                    return response.json();
                })
                .then(data => {
                    console.log('Dog profile created successfully');
                    setStore({ loading: false });
                })
                .catch(error => {
                    console.error('Error creating user and dog profile:', error);
                    setStore({ loading: false });
                });
            },


            //To get profiles of other dogs for swiping
            fetchAvailableDogs: async () => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/dogs/available`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${store.JWT_Token}`,
                        },
                    });
            
                    if (!response.ok) throw new Error('Failed to fetch available dogs');
            
                    const data = await response.json();
                    setStore({ profiles: data }); // Guarda los perfiles de perros disponibles
                    console.log('Available dogs fetched successfully:', data);
                } catch (error) {
                    console.error('Error fetching available dogs:', error);
                }
            },           

          
             // Function to fetch the dog's profile
fetchMyDogProfile: async () => {
    const store = getStore(); // Access global state
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/dog-profile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${store.JWT_Token}`, // Use the correct token
            },
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Server error response:', errorDetails);
            throw new Error(`Failed to fetch your dog's profile: ${errorDetails.message}`);
        }

        const data = await response.json();
        setStore({ dogProfile: data }); // Store the dog's profile in global state
        console.log('Dog profile fetched successfully:', data);
    } catch (error) {
        console.error('Error fetching your dog profile:', error);
    }
},

// Function to update dog's profile
updateDogProfile: async (updatedProfile) => {
    const store = getStore();

    // Validate before sending
    if (!updatedProfile.dog_name || !updatedProfile.age || !updatedProfile.breed) {
        console.error('Validation Error: Missing required fields');
        return;
    }

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/users/dog-profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${store.JWT_Token}`, // Use the correct token
            },
            body: JSON.stringify(updatedProfile),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Server error response:', errorDetails);
            throw new Error(`Failed to update dog profile: ${errorDetails.message}`);
        }

        const data = await response.json();
        setStore({ dogProfile: data });
        console.log('Dog profile updated successfully:', data);
    } catch (error) {
        console.error('Error updating dog profile:', error);
    }
},

            
            
            //Function to update info 
            updateDogProfile: async (updatedProfile) => {
                const store = getStore();
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/users/dog-profile`, {
                        method: 'PUT', 
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${store.JWT_Token}`,
                        },
                        body: JSON.stringify(updatedProfile),
                    });
            
                    if (!response.ok) throw new Error('Failed to update dog profile');
            
                    const data = await response.json();
                    setStore({ dogProfile: data }); 
                    console.log('Dog profile updated successfully:', data);
                } catch (error) {
                    console.error('Error updating dog profile:', error);
                }
            },
            

            
            // Function to like a dog profile
            likeProfile(dogId) {
                const store = getStore();
                fetch('/swipe/right', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.JWT_Token}`
                    },
                    body: JSON.stringify({
                        userId: store.userProfile.id,
                        targetUserId: dogId
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to like profile');
                    return response.json();
                })
                .then(data => {
                    console.log('Profile liked:', data.message);
                })
                .catch(error => console.error('Error liking profile:', error));
            },

            // Function to discard a dog profile
            discardProfile(dogId) {
                console.log(`Discarded dog with ID: ${dogId}`);
                // Optionally, update the store to remove the discarded profile
            },

            // Function to remove a match
            removeMatch(dogId) {
                const store = getStore();
                fetch(`/api/users/${store.userProfile.id}/unmatch/${dogId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${store.JWT_Token}` }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to remove match');
                    return response.json();
                })
                .then(() => {
                    const updatedMatches = store.matches.filter(matchId => matchId !== dogId);  
                    setStore({ matches: updatedMatches });
                    console.log(`Match removed: ${dogId}`);
                })
                .catch(error => console.error('Error removing match:', error));
            },

            // Function to view a full dog profile
            viewProfile(dogId) {
                console.log(`Viewing full profile of dog with ID: ${dogId}`);
                // Add navigation or modal logic to show the full profile
            },

            // Function to fetch messages between two users (for chat functionality)
            fetchMessages(userId, partnerUserId) {
                const store = getStore();
                return fetch(`/api/messages/${userId}/${partnerUserId}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${store.JWT_Token}` }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch messages');
                    return response.json();
                })
                .then(data => {
                    setStore({ messages: data }); 
                    return data; 
                })
                .catch(error => console.error('Error fetching messages:', error));
            },

            // Function to send a message
            sendMessages(userId, partnerUserId, messageContent) {
                const store = getStore();
                fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.JWT_Token}` 
                    },
                    body: JSON.stringify({
                        fromUserId: userId,
                        toUserId: partnerUserId,
                        content: messageContent
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to send message');
                    return response.json();
                })
                .then(data => {
                    getActions().fetchMessages(userId, partnerUserId); // Fetch updated messages
                })
                .catch(error => console.error('Error sending message:', error));
            },

            // Function to fetch matches for the current user
            fetchMatches(userId) {
                const store = getStore();
                fetch(`/api/users/${userId}/matched`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${store.JWT_Token}` }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch matches');
                    return response.json();
                })
                .then(data => {
                    setStore({ matches: data.matches }); 
                })
                .catch(error => console.error('Error fetching matches:', error));
            },

            // Function to fetch the current user's profile
            fetchCurrentUserProfile(userId) {
                const store = getStore();
                fetch(`/api/users/${userId}/profile`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${store.JWT_Token}` }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch profile');
                    return response.json();
                })
                .then(data => {
                    setStore({ userProfile: data }); 
                })
                .catch(error => console.error('Error fetching profile:', error));
            },

            // Function to update the current user's profile
            updateUserProfile(userId, updatedProfileData) {
                const store = getStore();
                fetch(`/api/users/${userId}/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.JWT_Token}`
                    },
                    body: JSON.stringify(updatedProfileData)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to update profile');
                    return response.json();
                })
                .then(data => {
                    setStore({ userProfile: data });
                })
                .catch(error => console.error('Error updating profile:', error));
            },

            // Function to fetch user settings
            fetchUserSettings(userId) {
                const store = getStore();
                fetch(`/api/users/${userId}/settings`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${store.JWT_Token}` }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch settings');
                    return response.json();
                })
                .then(data => {
                    const years = Math.floor(data.age / 12);
                    const months = data.age % 12;
                    setStore({
                        userSettings: {
                            ...data,
                            ageYears: years,
                            ageMonths: months
                        }
                    });
                })
                .catch(error => console.error('Error fetching settings:', error));
            },

            // Function to update user settings
            updateUserSettings(userId, updatedSettingsData) {
                const store = getStore();
                const totalMonths = (parseInt(updatedSettingsData.ageYears) * 12) + parseInt(updatedSettingsData.ageMonths || 0);

                const settingsPayload = {
                    ...updatedSettingsData,
                    age: totalMonths
                };

                fetch(`/api/users/${userId}/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.JWT_Token}`
                    },
                    body: JSON.stringify(settingsPayload)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to update settings');
                    return response.json();
                })
                .then(data => {
                    setStore({ userSettings: data });
                })
                .catch(error => console.error('Error updating settings:', error));
            }
        }
    };
};

export default getState;
