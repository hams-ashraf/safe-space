
import React from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const handleSignup = (e) => {
    e.preventDefault();
    alert("Signup submitted!");
  };

  return (
  <div className="signup-page">
    <div className="wrapper signup-wrapper">
      <div className="title">Create New Account</div>
     <form className="signup" onSubmit={handleSignup}>
      <div className="field">
        <input type="text" placeholder="FullName" required />
      </div>

      <div className="field">
        <input type="text" placeholder="DisplayName" required />
      </div>

      <div className="field">
        <input type="email" placeholder="Email Address" required />
      </div>

      <div className="field">
        <input type="number" placeholder="Age" required />
      </div>

      <div className="field">
        <input type="password" placeholder="Password" required />
      </div>
      <div className="field">
        <input type="password" placeholder="Confirm Password" required />
      </div>
      <div className="field">
        <input type="date" required />
      </div>
      <div className="field">
        <div className="gender-options">
          <label>
            <input type="radio" name="gender" value="male" required />
            Male
          </label>

          <label>
            <input type="radio" name="gender" value="female" required />
            Female
          </label>
        </div> 
      </div>

      <div className="field btn">
        <div className="btn-layer"></div>
        <input type="submit" value="Sign up" />
      </div>

      <div className="signup-link">
        Already a member? <Link to="/">Login</Link>
      </div>
    </form>
    </div>
  </div>
  );
}