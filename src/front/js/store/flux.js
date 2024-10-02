const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            profiles: [],
            JWT_Token: '', 
            messages: [],
            matches: [],
            userProfile: null,
            isLoading: false
        },
        actions: {
            // Fetch messages from the API for a specific user and partner
            fetchMessages(userId, partnerUserId) {
                const store = getStore();
                fetch(`/api/messages/${userId}/${partnerUserId}`, {
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
                    // Update the store with the fetched messages
                    setStore({ messages: data });
                })
                .catch(error => console.error('Error fetching messages:', error));
            },

            // Get the messages stored in the state
            getMessage() {
                const store = getStore();
                return store.messages; // Returns the current messages in the store
            },

            // Send a message to the API
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
                            messageInput.value = ''; // Clear input field
                            const actions = getActions();
                            actions.fetchMessages(userId, partnerUserId); // Refresh messages after sending
                        } else {
                            alert('Failed to send message.');
                        }
                    })
                    .catch(error => console.error('Error sending message:', error));
                }
            },

            // Fetch user profile from the API
            fetchUserProfile(userId) {
                const store = getStore();
                setStore({ isLoading: true }); // Set loading state
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
                    setStore({ userProfile: data, isLoading: false }); // Update store with profile data
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                    setStore({ isLoading: false });
                });
            },

            // Update user profile
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
                    setStore({ userProfile: data }); // Update store with updated profile
                })
                .catch(error => console.error('Error updating profile:', error));
            },

            // Fetch user matches
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
                    setStore({ matches: data.matches }); // Update store with matches data
                })
                .catch(error => console.error('Error fetching matches:', error));
            }
        }
    };
};

export default getState;
