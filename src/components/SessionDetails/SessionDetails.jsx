import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../DoctorProfile/DoctorProfile.css";
import "./SessionDetails.css";

export default function SessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const decodedId = id ? decodeURIComponent(id) : "";

  useEffect(() => {
  async function fetchSession() {
    try {
      const res = await fetch(
        `https://doctorprofile.runasp.net/api/Sessions/${decodedId}`
      );

      const data = await res.json();
      setSession(data || null);
    } catch (err) {
      console.log(err);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }

  fetchSession();
}, [decodedId]);

if (loading) return <p>Loading...</p>;
if (!session?.userCode) return <p>No valid session data</p>;
  return (
    <div className="doctor-root py-5 d-flex justify-content-center px-3">
      <div className="doctor-bg-white rounded-4 shadow p-4 p-md-5 w-100 session-details-card">
        <div className="mb-4">
          <Link
            to="/doctor/history"
            className="small doctor-text-green text-decoration-none fw-semibold"
          >
            ← Back to history
          </Link>
        </div>
        <h2 className="fw-bolder mb-4">Session details</h2>

        <div className="doctor-bg rounded-4 p-3 mb-3">
          <div className="small doctor-text-gray mb-1">User code</div>
          <div className="fw-bold">{session.userCode}</div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="doctor-bg rounded-4 p-3 h-100">
              <div className="small doctor-text-gray mb-1">Date</div>
              <div className="fw-semibold">{session.date}</div>
            </div>
          </div>
          <div className="col-6">
            <div className="doctor-bg rounded-4 p-3 h-100">
              <div className="small doctor-text-gray mb-1">Time</div>
              <div className="fw-semibold">{session.time}</div>
            </div>
          </div>
        </div>

        <div className="border-top pt-3">
          <label className="small fw-bold doctor-text-gray d-block mb-2">
            Doctor notes
          </label>
          <div className="form-control rounded-4 doctor-text-gray small session-details-notes">
            {session.doctorNotes}
          </div>
        </div>
      </div>
    </div>
  );
}
