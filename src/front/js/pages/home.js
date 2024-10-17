import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../styles/home.css';

export const Home = () => {
    const navigate = useNavigate() // To navigate programmatically

    return (
        <div className="home-container">
            <h1>Welcome to Pet Tinder!</h1>
            <p>Find your pet’s perfect playdate!</p>
            <div className="button-container">
                <button className="btn btn-primary" onClick={() => navigate('/Login')}>
                    Log in
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/signup')}>
                    Sign Up
                </button>
            </div>
        </div>
    );
};