import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../DoctorProfile/DoctorProfile.css";
import "./ViewHistory.css";

export default function ViewHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
 
useEffect(() => {
  const doctorId = localStorage.getItem("doctorId");

  async function fetchSessions() {
    try {
      setLoading(true);

      const res = await fetch(
        `http://doctorprofile.runasp.net/api/Sessions/DoctorHistory?doctorId=${doctorId}`
      );

      const data = await res.json();

      setSessions(data || []);
    } catch (err) {
      console.log(err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  if (doctorId) fetchSessions();
}, []);

  return (
    <div className="doctor-root py-4">
      <div className="doctor-w-90">
        <h2 className="fw-bolder mb-4">View History</h2>
        <div className="d-flex flex-column align-items-center gap-2 pb-5">
  {loading ? (
    <p className="doctor-text-gray">Loading...</p>
  ) : sessions.length === 0 ? (
    <p className="doctor-text-gray">No sessions yet</p>
  ) : (
    sessions.map((s) => (
      <button
        key={s.sessionId}
        type="button"
        className="doctor-bg-white rounded-4 shadow text-start border-0 doctor-zoom d-flex align-items-center justify-content-between gap-3 px-3 py-2 view-history-session-btn"
        onClick={() =>
          navigate(
            `/doctor/session-details/${encodeURIComponent(s.sessionId)}`
          )
        }
      >
        <div className="flex-grow-1 min-w-0">
          <div className="doctor-text-gray text-uppercase view-history-col-label">
            User code
          </div>
          <div className="fw-bold small text-truncate">
            {s.userCode}
          </div>
        </div>

        <div className="flex-grow-1 text-center min-w-0">
          <div className="doctor-text-gray text-uppercase view-history-col-label">
            Session date
          </div>
          <div className="fw-semibold small">{s.date}</div>
        </div>

        <div className="flex-grow-1 text-end min-w-0">
          <div className="doctor-text-gray text-uppercase view-history-col-label">
            Session time
          </div>
          <div className="fw-semibold small">{s.time}</div>
        </div>
      </button>
    ))
  )}
</div>
      </div>
    </div>
  );
}
