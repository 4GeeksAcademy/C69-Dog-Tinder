const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            profiles: [],
            JWT_Token: '', 
            messages: [],
            matches: [],
            userProfile: null,
            userSettings: null,
        },
        actions: {
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
                            actions.fetchMessages(userId, partnerUserId); // Fetch messages after sending
                        } else {
                            alert('Failed to send message.');
                        }
                    })
                    .catch(error => console.error('Error sending message:', error));
                }
            },

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
                    setStore({ matches: data.matches }); 
                })
                .catch(error => console.error('Error fetching matches:', error));
            },

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
                    setStore({ userProfile: data }); 
                })
                .catch(error => console.error('Error fetching profile:', error));
            },

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
                    setStore({ userSettings: data }); 
                })
                .catch(error => console.error('Error fetching settings:', error));
            },

            updateUserSettings(userId, updatedSettingsData) {
                const store = getStore();
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
    }
};

export default getState;

