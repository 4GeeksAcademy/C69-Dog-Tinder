import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import '../../styles/SettingsPage.css'; // Import the updated styles
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const { store, actions } = useContext(Context);
    const [ageYears, setAgeYears] = useState('');
    const [ageMonths, setAgeMonths] = useState('');
    const [breed, setBreed] = useState('');
    const [distance, setDistance] = useState('');
    const [temperment, setTemperment] = useState('');
    const [lookingFor, setLookingFor] = useState('');
    const navigate = useNavigate();

    const userId = store.userProfile?.userId;

    useEffect(() => {
        if (userId) {
            actions.fetchUserSettings(userId);
        }
    }, [userId]);

    useEffect(() => {
        if (store.userSettings) {
            // Assume the age is returned in total months from the backend
            const totalMonths = store.userSettings.age;
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;

            setAgeYears(years);  // Set years and months separately
            setAgeMonths(months);
            setBreed(store.userSettings.breed || '');
            setDistance(store.userSettings.distance || '');
            setTemperment(store.userSettings.temperment || '');
            setLookingFor(store.userSettings.looking_for || '');
        }
    }, [store.userSettings]);

    const handleSaveSettings = (e) => {
        e.preventDefault();

        // Convert years and months into total months before sending to the backend
        const ageInMonths = parseInt(ageYears) * 12 + parseInt(ageMonths || 0);

        const updatedSettings = {
            age: ageInMonths,  // Send total months to the backend
            breed,
            distance,
            temperment,
            looking_for: lookingFor
        };

        actions.updateUserSettings(userId, updatedSettings);
        navigate(-1);  // Navigate back after saving
    };

    return (
        <div className="settings-container">
            <div className="settings-box">
                <div className="settings-header">
                    <span className="settings-title">Discovery Settings</span>
                    <button className="done-button" onClick={handleSaveSettings}>Done</button>
                </div>

                <form className="settings-form" onSubmit={handleSaveSettings}>
                    <div className="form-group">
                        <label htmlFor="ageYears">Age Preference (Years)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="ageYears"
                            value={ageYears}
                            onChange={(e) => setAgeYears(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ageMonths">Age Preference (Months)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="ageMonths"
                            value={ageMonths}
                            onChange={(e) => setAgeMonths(e.target.value)}
                            min="0"
                            max="11"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="breed">Breed Preference</label>
                        <input
                            type="text"
                            className="form-control"
                            id="breed"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="distance">Maximum Distance (miles)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="distance"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="temperment">Temperament</label>
                        <input
                            type="text"
                            className="form-control"
                            id="temperment"
                            value={temperment}
                            onChange={(e) => setTemperment(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lookingFor">Looking For</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lookingFor"
                            value={lookingFor}
                            onChange={(e) => setLookingFor(e.target.value)}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
