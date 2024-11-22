import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import '../../styles/SettingsPage.css';
import { useNavigate } from 'react-router-dom';

export const SettingsPage = () => {
    const { store, actions } = useContext(Context); // If you need to access any global state or actions
    const navigate = useNavigate();

    // Define state for the settings form
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [maxDistance, setMaxDistance] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")

    if (token==null){navigate("/login")}
    // Fetch current settings when component mounts
    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/users/settings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setMinAge(data.min_age || '');
                    setMaxAge(data.max_age || '');
                    setMaxDistance(data.max_distance || '');
                } else {
                    setError(data.message || 'Failed to fetch settings');
                }
            } catch (err) {
                setError('An error occurred while fetching the settings.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem('token');
        const updatedSettings = { min_age: minAge, max_age: maxAge, max_distance: maxDistance };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/users/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSettings),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.message || 'Failed to update settings');
            }
        } catch (err) {
            setError('An error occurred while updating the settings.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="settings-container">
            <h2>Settings</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Settings updated successfully!</div>}

            <form onSubmit={handleSubmit} className="settings-form">
                <div className="input-box">
                    <label htmlFor="min-age">Min Age</label>
                    <input
                        type="number"
                        id="min-age"
                        name="min_age"
                        value={minAge}
                        onChange={(e) => setMinAge(e.target.value)}
                        required
                    />
                </div>

                <div className="input-box">
                    <label htmlFor="max-age">Max Age</label>
                    <input
                        type="number"
                        id="max-age"
                        name="max_age"
                        value={maxAge}
                        onChange={(e) => setMaxAge(e.target.value)}
                        required
                    />
                </div>

                <div className="input-box">
                    <label htmlFor="max-distance">Max Distance (mi)</label>
                    <input
                        type="number"
                        id="max-distance"
                        name="max_distance"
                        value={maxDistance}
                        onChange={(e) => setMaxDistance(e.target.value)}
                        required
                    />
                </div>

                <div className="input-box">
                    <button type="submit" disabled={isLoading} className="submit-button">
                        {isLoading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>

            <div className="back-button">
                <button onClick={() => {navigate('/')
                localStorage.removeItem("token")
                localStorage.removeItem("userId")
                }}>Log Out</button>
            </div>
        </div>
    );
};

export default SettingsPage;
