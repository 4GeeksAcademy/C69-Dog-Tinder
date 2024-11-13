import React from 'react';
import { Link } from 'react-router-dom';
import { FaDog, FaHeart, FaComment, FaCog, FaUser } from 'react-icons/fa'; // Icons for navbar
import '../../styles/Navbar.css'; 

const Navbar = () => {
  return (
    <>
      {/* Bottom Navbar */}
      <nav className="navbar navbar-light fixed-bottom app-navbar">
        <div className="container-fluid justify-content-around">
          
          {/* Profiles Page */}
          <Link className="nav-item text-center" to="/swipe">
            <FaDog className="navbar-icon" />
            <span className="navbar-text">Profiles</span>
          </Link>

          {/* Playdates Page */}
          <Link className="nav-item text-center" to="/playdates">
            <FaHeart className="navbar-icon" />
            <span className="navbar-text">Playdates</span>
          </Link>

          {/* Chat Page */}
          <Link className="nav-item text-center" to="/chatPage">
            <FaComment className="navbar-icon" />
            <span className="navbar-text">Chats</span>
          </Link>

          {/* My Profile */}
          <Link className="nav-item text-center" to="/my-profile">
            <FaUser className="navbar-icon" />
            <span className="navbar-text">My Profile</span>
          </Link>

          {/* Settings Page */}
          <Link className="nav-item text-center" to="/settings">
            <FaCog className="navbar-icon" />
            <span className="navbar-text">Settings</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
