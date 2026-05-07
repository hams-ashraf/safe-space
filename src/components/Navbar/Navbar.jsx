
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { clearLoginIdentity, isDoctorUser } from "../../api/roleApi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("token");
  const isDoctor = isDoctorUser();

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const isActivePath = (path) => location.pathname === path;
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    clearLoginIdentity();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 sticky-top">
      <div className="container-fluid">

        {/* Logo */}
        <NavLink className="navbar-brand fw-bold text-success" to="/">
          Safe Space
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <span
                className={`nav-link ${isActivePath("/doctors") ? "active" : ""}`}
                onClick={() => handleProtectedRoute("/doctors")}
                style={{ cursor: "pointer" }}
              >
                Doctors
              </span>
            </li>

            <li className="nav-item">
              <span
                className={`nav-link ${isActivePath("/sessions") ? "active" : ""}`}
                onClick={() => handleProtectedRoute("/sessions")}
                style={{ cursor: "pointer" }}
              >
                My Sessions
              </span>
            </li>

            <li className="nav-item">
              <span
                className={`nav-link ${isActivePath("/chat") ? "active" : ""}`}
                onClick={() => handleProtectedRoute("/chat")}
                style={{ cursor: "pointer" }}
              >
                Chat
              </span>
            </li>
            {!isDoctor && (
              <li className="nav-item">
                <span
                  className={`nav-link ${isActivePath("/ai-chat") ? "active" : ""}`}
                  onClick={() => handleProtectedRoute("/ai-chat")}
                  style={{ cursor: "pointer" }}
                >
                  AI Chat
                </span>
              </li>
            )}

            <li className="nav-item">
              <span
                className={`nav-link ${isActivePath("/symptoms") ? "active" : ""}`}
                onClick={() => handleProtectedRoute("/symptoms")}
                style={{ cursor: "pointer" }}
              >
                Symptoms Detection
              </span>
            </li>

            <li className="nav-item">
              <span
                className={`nav-link ${isActivePath("/myprofile") ? "active" : ""}`}
                onClick={() => handleProtectedRoute("/myprofile")}
                style={{ cursor: "pointer" }}
              >
                My Profile
              </span>
            </li>

          </ul>

          {/* Login / Logout */}
          {!isLoggedIn ? (
            <button
              className="custom-login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              className="custom-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}