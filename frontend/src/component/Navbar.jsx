import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useAuthentication } from "../auth";

function Navbar() {
  const { isAuthorized, logout } = useAuthentication();
  const username = localStorage.getItem("username"); // You should store this at login

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo-link">
          <h2 className="navbar-title">Algorush</h2>
        </Link>
        {isAuthorized && (
          <ul className="navbar-menu-left">
            <li>
              <Link to="/">Dashboard</Link>
            </li>
          </ul>
        )}
      </div>

      <ul className="navbar-menu-right">
        {isAuthorized ? (
          <>
            <li className="dashboard-icon">
              {username?.[0]?.toUpperCase() || "U"}
            </li>
            <li>
              <button onClick={handleLogout} className="button-link">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="button-link-login">
                Log In
              </Link>
            </li>
            <li>
              <Link to="/register" className="button-link">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
