import React from 'react';
import { Link } from 'react-router-dom';
import { FaDog, FaHeart, FaComment, FaCog } from 'react-icons/fa'; // Example icons
import '../../styles/Navbar.css';

const Navbar = () => {
  return (
    <>
      {/* Bottom Navbar */}
      <nav className="navbar navbar-light fixed-bottom app-navbar">
        <div className="container-fluid justify-content-around">
          <Link className="nav-item text-center" to="/profiles">
            <FaDog className="navbar-icon" />
            <span className="navbar-text">Profiles</span>
          </Link>

          <Link className="nav-item text-center" to="/playdates">
            <FaHeart className="navbar-icon" />
            <span className="navbar-text">Playdates</span>
          </Link>

          <Link className="nav-item text-center" to="/chats">
            <FaComment className="navbar-icon" />
            <span className="navbar-text">Chats</span>
          </Link>

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
