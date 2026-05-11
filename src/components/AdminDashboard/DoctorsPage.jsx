import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { getAllDoctors } from "../../api/dashboard";
import "../AdminDashboard/AdminDashboard.css";
import "./DoctorsPage.css";
import { deleteDoctor } from "../../api/dashboard";

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
const [doctors, setDoctors] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const data = await getAllDoctors();
      setDoctors(data || []);

    } catch (error) {
      console.log("Error loading doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  fetchDoctors();
}, []);

  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter(
      (d) => d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q)
    );
  }, [doctors, query]);

  async function removeDoctor(id) {
  try {
    await deleteDoctor(id);

    setDoctors((prev) => prev.filter((d) => d.id !== id));

    alert("Doctor deleted successfully");
  } catch (error) {
    console.log(error);
    alert("Delete failed");
  }
}

  return (
    <div className="doctors-page">
      <div className="admin-table-card">
        <div className="admin-table-card-header">
          <h3>Doctors</h3>
          {/* <input
            className="doctors-search"
            placeholder="Search doctors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          /> */}
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
  <tr>
    <td colSpan="3">Loading doctors...</td>
  </tr>
) : filteredDoctors.length > 0 ? (
  filteredDoctors.map((d) => (
    <tr key={d.id}>
      <td>{d.fullName}</td>
      <td>{d.email}</td>

      <td className="admin-actions">
        <Link className="admin-btn admin-btn-primary" to={`/admin/doctor/${d.id}`}>
          View
        </Link>

        <Link className="admin-btn admin-btn-secondary" to={`/admin/edit-doctor/${d.id}`}>
          Edit
        </Link>

        <button className="admin-btn admin-btn-danger" onClick={() => removeDoctor(d.id)}>
                    Delete
                  </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="3">No doctors yet</td>
  </tr>
)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

