import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usersData } from "../Shared/adminDummyData";
import { getAllUsers } from "../../api/dashboard";
import "./UserDetails.css";

const defaultImage =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#e9f3ef"/><circle cx="90" cy="70" r="28" fill="#bdd6cf"/><ellipse cx="90" cy="138" rx="48" ry="34" fill="#bdd6cf"/></svg>`
  );

export default function UserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const data = await getAllUsers();

       
        let foundUser = data?.find((u) => String(u.id) === id);

      
        if (!foundUser) {
          foundUser = usersData.find((u) => String(u.id) === id);
        }

        setUser(foundUser || null);

      } catch (error) {
        console.log("User API not ready:", error);

        // fallback
        const fallbackUser = usersData.find((u) => String(u.id) === id);
        setUser(fallbackUser || null);

      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="user-details-card">
        <p>Loading user...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details-card">
        <p>User not found.</p>
        <Link className="admin-btn admin-btn-secondary" to="/admin/users">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="user-details-card">
      <div className="user-details-head">
        <h3>User Details</h3>
        <Link className="admin-btn admin-btn-secondary" to="/admin/users">
          Back
        </Link>
      </div>

      <div className="user-details-grid">
        <img
          src={user.image || defaultImage}
          alt={user.name}
          className="user-details-image"
        />

        <div className="user-details-info">
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Display Name:</strong> {user.displayName}</p>
          {/* <p><strong>UserCode:</strong> {user.userCode}</p> */}
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Location:</strong> {user.location}</p>
          {/* <p><strong>Password:</strong> {user.passwordHash}</p> */}
        </div>
      </div>
    </div>
  );
}