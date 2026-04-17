

import React, { useEffect, useState } from "react";
import "./Sessions.css";
import { getMySessions } from "../../api/sessionsApi";

function RoomCards() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <div className="cards-container">
        {sessions.length === 0 ? (
          <p>No sessions found</p>
        ) : (
          sessions.map((session, index) => (
            <div className="room-card" key={index}>
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
                <button className="join-btn primary">
                  Join Session
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