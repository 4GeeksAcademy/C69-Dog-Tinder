import React from 'react';
import { Link } from 'react-router-dom';
import { FaDog, FaHeart, FaComment, FaCog, FaUser } from 'react-icons/fa';
import '../../styles/Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar navbar-light fixed-bottom app-navbar">
      <div className="container-fluid justify-content-around">
        <Link to="/swipe" className="nav-item">
          <FaDog className="navbar-icon" />
          <span>Profiles</span>
        </Link>
        <Link to="/playdates/:id" className="nav-item">
          <FaHeart className="navbar-icon" />
          <span>Playdates</span>
        </Link>
        <Link to="/chatPage" className="nav-item">
          <FaComment className="navbar-icon" />
          <span>Chats</span>
        </Link>
        <Link to="/my-profile" className="nav-item">
          <FaUser className="navbar-icon" />
          <span>My Profile</span>
        </Link>
        <Link to="/settings" className="nav-item">
          <FaCog className="navbar-icon" />
          <span>Settings</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
