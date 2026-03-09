
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { registerUser } from "../../api/authApi";
// import "./Signup.css";

// export default function Signup() {

// const [formData,setFormData] = useState({
// fullName:"",
// displayName:"",
// email:"",
// age:"",
// password:"",
// confirmPassword:"",
// birthDate:"",
// gender:""
// });

// const handleChange=(e)=>{
// setFormData({
// ...formData,
// [e.target.name]:e.target.value
// });
// };

// const handleSignup = async (e) => {
// e.preventDefault();

// try{
// await registerUser(formData);
// alert("Account created successfully");
// }catch(err){
// console.log(err);
// alert("Signup failed");
// }
// };

// return (
// <div className="signup-page">
// <div className="wrapper signup-wrapper">
// <div className="title">Create New Account</div>

// <form className="signup" onSubmit={handleSignup}>

// <div className="field">
// <input name="fullName" type="text" placeholder="FullName" onChange={handleChange} required />
// </div>

// <div className="field">
// <input name="displayName" type="text" placeholder="DisplayName" onChange={handleChange} required />
// </div>

// <div className="field">
// <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
// </div>

// <div className="field">
// <input name="age" type="number" placeholder="Age" onChange={handleChange} required />
// </div>

// <div className="field">
// <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
// </div>

// <div className="field">
// <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />
// </div>

// <div className="field">
// <input name="birthDate" type="date" onChange={handleChange} required />
// </div>

// <div className="field">
// <div className="gender-options">

// <label>
// <input type="radio" name="gender" value="Male" onChange={handleChange} required/>
// Male
// </label>

// <label>
// <input type="radio" name="gender" value="Female" onChange={handleChange}/>
// Female
// </label>

// </div>
// </div>

// <div className="field btn">
// <input type="submit" value="Sign up" />
// </div>

// <div className="signup-link">
// Already a member? <Link to="/">Login</Link>
// </div>

// </form>
// </div>
// </div>
// );
// }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const newErrors = { ...errors };

    // FullName required
    if (name === "fullName" && !value.trim()) newErrors.fullName = "Full Name is required";
    else if (name === "fullName") newErrors.fullName = "";

    // Email required & valid
    if (name === "email") {
      if (!value.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = "Invalid email format";
      else newErrors.email = "";
    }

    // Password pattern
    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (!/(?=.*[a-z])/.test(value)) newErrors.password = "Must include lowercase letter";
      else if (!/(?=.*[A-Z])/.test(value)) newErrors.password = "Must include uppercase letter";
      else if (!/(?=.*\d)/.test(value)) newErrors.password = "Must include number";
      else if (!/(?=.*[\W_])/.test(value)) newErrors.password = "Must include special character";
      else if (value.length < 8) newErrors.password = "At least 8 characters";
      else newErrors.password = "";
    }

    // Age 1-120
    if (name === "age") {
      const ageVal = Number(value);
      if (!value) newErrors.age = "Age is required";
      else if (isNaN(ageVal) || ageVal < 1 || ageVal > 120) newErrors.age = "Age must be 1-120";
      else newErrors.age = "";
    }

    // Gender required
    if (name === "gender" && !["Male", "Female"].includes(value)) newErrors.gender = "Gender is required";
    else if (name === "gender") newErrors.gender = "";

    setErrors(newErrors);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((err) => err !== "");
    const hasEmpty = Object.values(formData).some((v) => !v);
    if (hasErrors || hasEmpty) return; // Ù…Ø§ ÙŠØ±Ø³Ù„Ø´ Ø¥Ø°Ø§ ÙÙŠ Ø®Ø·Ø£

    try {
      await registerUser(formData);
      alert("Account created successfully!");
      navigate("/"); // redirect to login
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
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