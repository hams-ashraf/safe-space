import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ViewHistory.css";

function CalendarIcon() {
  return (
    <svg
      className="vh-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="vh-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      className="vh-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M15 10l5-3v14l-5-3V10z" />
      <rect x="2" y="6" width="13" height="12" rx="2" />
    </svg>
  );
}

function getSessionTitle(session) {
  return (
    session.sessionType ||
    session.consultationType ||
    session.title ||
    "Consultation"
  );
}

function getSessionTypeLabel(session) {
  return session.callType || session.type || session.mode || "Video Call";
}

export default function ViewHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedNote, setSelectedNote] = useState(null);
const [loadingNote, setLoadingNote] = useState(false);

useEffect(() => {
  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://doctorprofile.runasp.net/api/DoctorSessions/MySessions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      const data = await res.json();
      

      setSessions(Array.isArray(data.past) ? data.past : []);
    } catch (error) {
      
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  fetchSessions();
}, []);

const fetchNotes = async (sessionId) => {
  try {
    setLoadingNote(true);

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://doctorprofile.runasp.net/api/DoctorSessions/${sessionId}/Notes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();


   setSelectedNote(data?.notes || data?.note || data);
  } catch (err) {
    console.log(err);
    setSelectedNote("Failed to load notes");
  } finally {
    setLoadingNote(false);
  }
};
  const goToSessionDetails = (sessionId) => {
    navigate(`/doctor/session-details/${encodeURIComponent(sessionId)}`);
  };

  return (
    <main className="vh-page">
      <div className="vh-layout">
        <header className="vh-header">
          <h1 className="vh-title">History</h1>
        </header>

        <section className="vh-panel" aria-label="Past sessions list">
          {loading ? (
            <p className="vh-status">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="vh-status">No sessions yet</p>
          ) : (
            <ul className="vh-list">
              {sessions.map((session) => (
                <li key={session.sessionId} className="vh-session">
                  <div className="vh-session-body">
                    <h2 className="vh-session-title">
                      {getSessionTitle(session)}
                    </h2>
                    <p className="vh-session-subtitle">
                       With:{" "}
                      {session.sessionType === "Group"
                        ? session.patients?.map(p => p.name).join(", ")
                        : session.patients?.[0]?.name || "Unknown Patient"}
                    </p>
                    {/* <p className="vh-session-subtitle">
                      Patient {session.userCode}
                    </p> */}
                    <div className="vh-meta">
                      <span className="vh-meta-item">
                        <CalendarIcon />
                        {new Date(session.date).toLocaleDateString("en-GB")}
                      </span>
                      <span className="vh-meta-item">
                        <ClockIcon />
                        {new Date(`1970-01-01T${session.time}`).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                      <span className="vh-meta-item">
                        <VideoIcon />
                        {getSessionTypeLabel(session)}
                      </span>
                    </div>
                  </div>

                  <div className="vh-actions">
                    <button
                      type="button"
                      className="vh-btn vh-btn-notes"
                      onClick={() => fetchNotes(session.sessionId)}
                    >
                      View Notes
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {selectedNote && (
  <div className="notes-overlay">
    <div className="notes-card">
      <h3>Session Notes</h3>

      <p className="notes-content">
        {typeof selectedNote === "string"
          ? selectedNote
          : selectedNote?.notes || "No notes available"}
      </p>
      <button
        className="close-btn"
        onClick={() => setSelectedNote(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
    </main>
    
  );
}
