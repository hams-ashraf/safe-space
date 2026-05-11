import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usersData } from "../Shared/adminDummyData";
import { getAllUsers } from "../../api/dashboard"; 
import "../AdminDashboard/AdminDashboard.css";
import "./UsersPage.css";
import { deleteUser } from "../../api/dashboard";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableRows = useMemo(() => users, [users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await getAllUsers();

        
        if (data && data.length > 0) {
          setUsers(data);
        } else {
          setUsers(usersData); 
        }

      } catch (error) {
        console.log("Users API not ready:", error);

        
        setUsers(usersData);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

 async function removeUser(id) {
  try {
    await deleteUser(id);

    setUsers((prev) => prev.filter((u) => u.id !== id));

    console.log("Deleted successfully");
  } catch (error) {
    console.log("DELETE ERROR:", error.response?.data || error.message);
  }
}

  return (
    <div className="users-page">
      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <h3>Users</h3>
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
            {loading ? (
              <tr>
                <td colSpan="4">Loading users...</td>
              </tr>
            ) : tableRows.length > 0 ? (
              tableRows.map((u) => (
                <tr key={u.id}>
                  <td>{u.displayName}</td>
                  <td>{u.email}</td>
                  <td>{u.fullName}</td>

                  <td className="admin-actions">
                    <Link className="admin-btn admin-btn-primary" to={`/admin/user/${u.id}`}>
                      View
                    </Link>

                    <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => removeDoctor(d.id)}
                    >
                    Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No users yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}