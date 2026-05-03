

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sessions.css";
import { getMySessions, joinCall } from "../../api/sessionsApi";

function RoomCards() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningSessionId, setJoiningSessionId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getSessionId = (session) => session.sessionsId;

  const handleJoinSession = async (session) => {
    const sessionId = getSessionId(session);

    if (!sessionId) {
      setError("Session ID is missing for this session.");
      return;
    }

    setError("");
    setJoiningSessionId(sessionId);

    try {
      const callData = await joinCall({
        sessionId,
        isGroupCall: true,
        callSessionId: 0,
      });

      navigate("/meeting", {
        state: {
          session,
          callData,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join call.");
    } finally {
      setJoiningSessionId(null);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getMySessions();

        // API returns: { upcoming: [], past: [] }
        const allSessions = [
          ...(data?.upcoming || []),
          ...(data?.past || [])
        ];

        setSessions(allSessions);
      } catch (err) {
        console.log("Error loading sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div className="page-wrapper">Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <h3 className="page-title">My Sessions</h3>
      {error && <p className="text-danger">{error}</p>}

      <div className="cards-container">
        {sessions.length === 0 ? (
          <p>No sessions found</p>
        ) : (
          sessions.map((session, index) => (
            <div className="room-card" key={getSessionId(session) || index}>
              <div className="session-header">
                <div>
                  <div className="session-doctor">
                    {session.type || "Session"}
                  </div>

                  <div className="session-doctor">
                    with {session.doctorName || "Doctor"}
                  </div>
                </div>

                <div className="call-badge">
                  <i className="bi bi-camera-video"></i>
                  {session.sessionType || "Call"}
                </div>
              </div>

              <div className="session-info">
                <span>
                  <i className="bi bi-calendar"></i>
                  {session.date?.split("T")[0] || "No date"}
                </span>

                <span>
                  <i className="bi bi-clock"></i>
                  {session.time || "No time"}
                </span>
              </div>

              <div className="card-actions">
                <button
                  className="join-btn primary"
                  onClick={() => handleJoinSession(session)}
                  disabled={joiningSessionId === getSessionId(session)}
                >
                  {joiningSessionId === getSessionId(session)
                    ? "Joining..."
                    : "Join Session"}
                </button>

                <button className="reschedule-btn">
                  Reschedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RoomCards;