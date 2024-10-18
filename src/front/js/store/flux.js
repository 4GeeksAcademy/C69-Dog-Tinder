const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            profiles: [],
            JWT_Token: '', 
            messages: [],
            matches: [],
            loading: true, 
            userProfile: null,
            userSettings: null,

        },
        actions: {
            // Fetch Dog Profiles for the current user
            fetchUserProfile(userId) {
                const store = getStore();
                fetch(`/api/users/${userId}/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${store.JWT_Token}`
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch profile');
                    return response.json();
                })
                .then(data => {
                    setStore({ profiles: data.profiles, loading: false }); // Store fetched profiles
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                    setStore({ loading: false }); // Stop loading on error
                });
            },

            // Like a dog profile
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

            // Discard a dog profile
            discardProfile(dogId) {
                console.log(`Discarded dog with ID: ${dogId}`);
                // Optionally, you could update the store to remove the discarded profile
            },

            //Remove a match
            removeMatch(dogId) {
                const store = getStore();
                fetch(`/api/users/${store.userProfile.id}/unmatch/${dogId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${store.JWT_Token}`
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to remove match');
                    return response.json();
                })
                .then(() => {
                    const updatedMatches = store.matches.filter(matchId => matchId !== dogId);  // Remove the dog from the matches list
                    setStore({ matches: updatedMatches });
                    console.log(`Match removed: ${dogId}`);
                })
                .catch(error => console.error('Error removing match:', error));
            },

            // View a full dog profile (e.g., navigate to another page)
            viewProfile(dogId) {
                console.log(`Viewing full profile of dog with ID: ${dogId}`);
                // Add navigation or modal logic to show the full profile
            },

            // Fetch Messages between two users (for chat functionality)
            fetchMessages(userId, partnerUserId) {
                const store = getStore();
                return fetch(`/api/messages/${userId}/${partnerUserId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${store.JWT_Token}` 
                    }
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

            // Send a message to a playdate
            sendMessages(userId, partnerUserId, messageInput) {
                const messageContent = messageInput.value.trim();
                if (messageContent) {
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
                        if (response.ok) {
                            const actions = getActions();
                            actions.fetchMessages(userId, partnerUserId); // Fetch updated messages after sending
                        } else {
                            alert('Failed to send message.');
                        }
                    })
                    .catch(error => console.error('Error sending message:', error));
                }
            },

            // Fetch Matches for the current user
            fetchMatches(userId) {
                const store = getStore();
                fetch(`/api/users/${userId}/matched`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${store.JWT_Token}`
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(data => {
                    setStore({ matches: data.matches }); // Store the matches in state
                })
                .catch(error => console.error('Error fetching matches:', error));
            },

            // Fetch the current user's profile
            fetchCurrentUserProfile(userId) {
                const store = getStore();
                fetch(`/api/users/${userId}/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${store.JWT_Token}`
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch profile');
                    return response.json();
                })
                .then(data => {
                    setStore({ userProfile: data }); // Store the current user's profile
                })
                .catch(error => console.error('Error fetching profile:', error));
            },

            // Update the current user's profile
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
                    setStore({ userProfile: data }); // Update the user's profile in state
                })
                .catch(error => console.error('Error updating profile:', error));
            },
            fetchUserSettings(userId) {
                const store = getStore();
                fetch(`/api/users/${userId}/settings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${store.JWT_Token}`
                    }
                })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch profile');
                    return response.json();
                })
                .then(data => {
                    // Convert age in months to years and months
                    const years = Math.floor(data.age / 12);  // Get years
                    const months = data.age % 12;  // Get remaining months

                    setStore({ userSettings: {
                            ...data,
                            ageYears: years,    // Add separate age in years
                            ageMonths: months   // Add separate age in months
                        } 
                    }); 
                })
                .catch(error => console.error('Error fetching settings:', error));
            },

            updateUserSettings(userId, updatedSettingsData) {
                const store = getStore();
                   // Convert years and months to total months
                   const totalMonths = (parseInt(updatedSettingsData.ageYears) * 12) + parseInt(updatedSettingsData.ageMonths || 0);

                   const settingsPayload = {
                       ...updatedSettingsData,
                       age: totalMonths  // Send total months to the backend
                   };

                fetch(`/api/users/${userId}/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.JWT_Token}`
                    },
                    body: JSON.stringify(updatedSettingsData)
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
