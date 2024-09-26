import React, { useContext } from "react";
import { Context } from "../store/appContext"; 
import { Link } from "react-router-dom";
import "../../styles/home.css";  

export const Home = () => {
    const { store } = useContext(Context);   

	return (
        <div className="home-container text-center mt-5">
            <header className="home-header">
                <h1>Welcome to Dog Tinder</h1>
                <p>Find the perfect playdate for your furry friend!</p>
                {/* Use Link for internal navigation */}
                <Link to="/register" className="btn btn-primary">Get Started</Link>
            </header>

            <section className="home-features mt-5">
                <div className="feature">
                    <h3>Find Nearby Playmates</h3>
                    <p>Use our search feature to find dogs near you looking for a playdate.</p>
                </div>
                <div className="feature">
                    <h3>Safe and Fun Meetups</h3>
                    <p>Organize safe and enjoyable playdates for your dog with trusted owners.</p>
                </div>
            </section>

            {/* Display message from the context if available */}
            {store.message && (
                <div className="alert alert-info mt-4">
                    {store.message}
                </div>
            )}
        </div>
    );
};
