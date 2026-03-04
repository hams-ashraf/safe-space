import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
const isLoggedIn = localStorage.getItem("user"); 

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
    window.location.reload(); // عشان يعمل re-render
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
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
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => handleProtectedRoute("/doctors")}
                style={{ cursor: "pointer" }}
              >
                Doctors
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => handleProtectedRoute("/sessions")}
                style={{ cursor: "pointer" }}
              >
                My Sessions
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => handleProtectedRoute("/chat")}
                style={{ cursor: "pointer" }}
              >
                Chat
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => handleProtectedRoute("/ai-chat")}
                style={{ cursor: "pointer" }}
              >
                AI Chat
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => handleProtectedRoute("/symptoms")}
                style={{ cursor: "pointer" }}
              >
                Symptoms Detection
              </span>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                onClick={() => handleProtectedRoute("/profile")}
                style={{ cursor: "pointer" }}
              >
                My Profile
              </span>
            </li>

          </ul>

          {/* Login / Logout */}
          {!isLoggedIn ? (
            <button
              className="btn btn-success"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-danger"
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