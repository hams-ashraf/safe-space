//Updated
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    const newErrors = { ...errors };

    if (name === "fullName") {
      if (!value.trim()) newErrors.fullName = "Full Name is required";
      else newErrors.fullName = "";
    }

    if (name === "displayName") {
      if (!value.trim()) newErrors.displayName = "Display Name is required";
      else newErrors.displayName = "";
    }

    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        newErrors.email = "Invalid email format";
      else newErrors.email = "";
    }

    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (!/(?=.*[a-z])/.test(value))
        newErrors.password = "Must include lowercase letter";
      else if (!/(?=.*[A-Z])/.test(value))
        newErrors.password = "Must include uppercase letter";
      else if (!/(?=.*\d)/.test(value))
        newErrors.password = "Must include number";
      else if (!/(?=.*[\W_])/.test(value))
        newErrors.password = "Must include special character";
      else if (value.length < 8)
        newErrors.password = "At least 8 characters";
      else newErrors.password = "";

      if (
        updatedData.confirmPassword &&
        updatedData.confirmPassword !== value
      ) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        newErrors.confirmPassword = "";
      }
    }

    if (name === "confirmPassword") {
      if (!value) newErrors.confirmPassword = "Confirm password is required";
      else if (value !== updatedData.password)
        newErrors.confirmPassword = "Passwords do not match";
      else newErrors.confirmPassword = "";
    }

    if (name === "age") {
      const ageVal = Number(value);
      if (!value) newErrors.age = "Age is required";
      else if (isNaN(ageVal) || ageVal < 1 || ageVal > 120)
        newErrors.age = "Age must be between 1 and 120";
      else newErrors.age = "";
    }

    if (name === "gender") {
      if (!["Male", "Female"].includes(value))
        newErrors.gender = "Gender is required";
      else newErrors.gender = "";
    }

    setErrors(newErrors);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((err) => err);
    const hasEmpty = Object.values(formData).some((v) => !v);

    if (hasErrors || hasEmpty) {
      alert("Please fix the errors first");
      return;
    }

    try {
      await registerUser(formData);
      alert("Account created successfully!");
      navigate("/");
    } 
     catch (err) {
  console.log("API ERROR:", err.response);

  const data = err.response?.data;

  // لو فيه validation errors من الباك
  if (data?.errors) {
    const emailError = data.errors.Email || data.errors.email;

    if (emailError) {
      setErrors((prev) => ({
        ...prev,
        email: "Email already exists",
      }));
      return;
    }
  }



  alert("Email already exists");
}
  };

  return (
    <div className="signup-page">
      <div className="wrapper signup-wrapper">
        <div className="title">Create New Account</div>

        <form className="signup" onSubmit={handleSignup}>

          <div className="field">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && <p className="error">{errors.fullName}</p>}
          </div>

          <div className="field">
            <input
              name="displayName"
              type="text"
              placeholder="Display Name"
              value={formData.displayName}
              onChange={handleChange}
            />
            {errors.displayName && <p className="error">{errors.displayName}</p>}
          </div>

          <div className="field">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="field">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="field">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="field">
            <input
              name="age"
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>

          <div className="field">
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                  checked={formData.gender === "Male"}
                />
                Male
              </label>

              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                  checked={formData.gender === "Female"}
                />
                Female
              </label>
            </div>
            {errors.gender && <p className="error">{errors.gender}</p>}
          </div>

          <div className="field btn">
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

