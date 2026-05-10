import { useMemo, useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatCard from "../Shared/StatCard";
import { getAllDoctors } from "../../api/dashboard";
import { getAllUsers } from "../../api/dashboard";
import "./AdminDashboard.css";
import { getDashboardStats} from "../../api/dashboard";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSessions, setTotalSessions] = useState(0);

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      const stats = await getDashboardStats();

      const [usersData, doctorsData] = await Promise.all([
        getAllUsers(),
        getAllDoctors(),
      ]);

      setUsers(usersData);
      setDoctors(doctorsData);
      setTotalSessions(stats.totalSessions);

    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  

  const stats = useMemo(
    () => [
      { label: "Total Users", value: users.length },
      { label: "Total Doctors", value: doctors.length },
      { label: "Total Sessions", value: totalSessions }
    ],
    [users.length, doctors.length,totalSessions]
  );

  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function removeDoctor(id) {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-stats">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <h3>Users</h3>
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate("/admin/users")}>
            View All
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Display Name</th>
              <th>Email</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.displayName}</td>
                <td>{u.email}</td>
                <td>{u.fullName}</td>

                <td className="admin-actions">
                  <Link to={`/admin/user/${u.id}`} className="admin-btn admin-btn-primary">
                    View
                  </Link>

                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => removeUser(u.id)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <h3>Doctors</h3>
          <button className="admin-btn admin-btn-secondary" onClick={() => navigate("/admin/doctors")}>
            View All
          </button>
        </div>
        {loading ? (
  <p>Loading doctors...</p>
) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d) => (
              <tr key={d.id}>
                <td>{d.fullName}</td>
                <td>{d.email}</td>
                <td>{d.specialization}</td>
                <td className="admin-actions">
                  <Link className="admin-btn admin-btn-primary" to={`/admin/doctor/${d.id}`}>
                    View
                  </Link>
                  <Link className="admin-btn admin-btn-secondary" to={`/admin/edit-doctor/${d.id}`}>
                    Edit
                  </Link>
                  <button className="admin-btn admin-btn-danger" onClick={() => removeDoctor(d.id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         )}
      </div>
    </div>
  );
}

