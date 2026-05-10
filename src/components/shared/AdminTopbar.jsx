import { useNavigate } from "react-router-dom";
import "./AdminTopbar.css";

export default function AdminTopbar({ title }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <header className="admin-topbar">
      <h2 className="admin-topbar-title">{title}</h2>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}