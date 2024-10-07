import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      {/* Navbar Toggler for Sidebar */}
      <nav className="navbar navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            ☰
          </button>
          <Link className="navbar-brand ms-3" to="/">Dog Tinder</Link>
        </div>
      </nav>

      {/* Off-Canvas Sidebar */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="nav-item">
              <Link className="nav-link" to="/profiles">Profiles</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/playdates">Playdates</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">Chats</Link>  {/* Corrected path */}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/settings">Settings</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
