import React from "react";
import { Link } from "react-router-dom";
import injectContext from '../store/appContext'; 

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">Dog Tinder</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/profiles">Profiles</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/playdates">Playdates</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/messages">Messages</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/settings">Settings</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default injectContext(Navbar);
