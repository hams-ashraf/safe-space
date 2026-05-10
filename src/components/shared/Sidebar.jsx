import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="admin-sidebar-panel">
      <h3 className="admin-sidebar-logo">Admin Panel</h3>

      <nav className="admin-sidebar-nav">
        <NavLink to="/admin/dashboard" className="admin-sidebar-link">
          AdminDashboard
        </NavLink>
        <NavLink to="/admin/users" className="admin-sidebar-link">
          Users
        </NavLink>
        <NavLink to="/admin/doctors" className="admin-sidebar-link">
          Doctors
        </NavLink>
        <NavLink to="/admin/add-doctor" className="admin-sidebar-link">
          Add Doctor
        </NavLink>
      </nav>
    </aside>
  );
}

