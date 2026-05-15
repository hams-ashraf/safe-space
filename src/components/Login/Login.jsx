import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({}); 
  const [serverError, setServerError] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const newErrors = { ...errors };

    if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      newErrors.email = "Invalid email format";
    else newErrors.email = "";//

    if (name === "password" && value === "")
      newErrors.password = "Password is required";
    else newErrors.password = "";

    setErrors(newErrors);
    setServerError("");
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await loginUser(formData)
    const token = res.data?.token;
    const user = res.data?.user;
    const role = res.data?.role;

    if (token) localStorage.setItem("token", token);
    if (role) localStorage.setItem("userRole", role);
    if (role === "Admin") {
  navigate("/admin/dashboard", { replace: true });
} 
else if (role === "Doctor") {
  navigate("/", { replace: true }); 
} 
else {
  navigate("/", { replace: true });
}

  } catch (err) {
    console.log(err.response?.data);
    setServerError(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-title">Login</div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="login-field">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          {serverError && <p className="error server-error">{serverError}</p>}

          <div className="login-field ">
            <input className="login-btn " type="submit" value="Login" />
          </div>

          <div className="login-signup-link">
            Not a member? <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
