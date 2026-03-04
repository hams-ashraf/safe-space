import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
   const navigate = useNavigate();

    const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ name: "User" }));

    navigate("/");
    window.location.reload();
  };

  return (
    <div className="login-page">
    <div className="wrapper login-wrapper">
      <div className="title">Login</div>
    <form className="login" onSubmit={handleLogin}>
      <div>
      <div className="field">
        <input type="text" placeholder="Username" required />
      </div>

        <div className="field">
          <input type="password" placeholder="Password" required />
        </div>
     </div>
      <div className="field btn">
        <div className="btn-layer"></div>
        <input type="submit" value="Login" />
      </div>

      <div className="signup-link">
        Not a member? <Link to="/signup">Sign up</Link>
      </div>
    </form>
    </div>
    </div>
  );
}
//  import React from "react";
// import "./Login.css";

// export default function Login() {
//   const handleLogin = (e) => {
//     e.preventDefault();
//     alert("Login submitted!");
//   };

//   return (
//     <form className="login" onSubmit={handleLogin}>
      
//       <div className="field">
//         <input type="text" placeholder="Username" required />
//       </div>
    
//       <div className="field">
//         <input type="password" placeholder="Password" required />
//       </div>
//       <div className="field btn">
//         <div className="btn-layer"></div>
//         <input type="submit" value="Login" />
//       </div>
//     </form>
//   );
// }