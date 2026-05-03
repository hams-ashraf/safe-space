
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
    else newErrors.email = "";

    if (name === "password" && value === "")
      newErrors.password = "Password is required";
    else newErrors.password = "";

    setErrors(newErrors);
    setServerError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err !== "")) return;

    try {
      const res = await loginUser(formData);
      
      // localStorage.setItem("token", res.data.accessToken);
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }


      // if (res.data.user?.id) {
      //   localStorage.setItem("patientId", res.data.user.id);
      // }
      
      if (res.data.user?.id) {
      const userId = res.data.user.id;
      const role = res.data.role;

      localStorage.setItem("userRole", role);

      if (role === "Doctor") {
        localStorage.setItem("doctorId", userId); // لو دكتور يتخزن هنا
        localStorage.removeItem("patientId");    // نمسح القديم عشان اللخبطة
      } else {
        localStorage.setItem("patientId", userId); // لو مريض يتخزن هنا
        localStorage.removeItem("doctorId");
      }
    }


      //علشان يخزن هو دكتور ولا patient
      if (res.data?.role) {
        localStorage.setItem("userRole", res.data.role);
      }
      
      navigate("/", { replace: true });
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