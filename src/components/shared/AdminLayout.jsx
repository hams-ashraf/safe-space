import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminTopbar from "./AdminTopbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout-shell">
      <Sidebar />
      <div className="admin-layout-main">
        <AdminTopbar title="Admin Dashboard" />
        <div className="admin-layout-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

