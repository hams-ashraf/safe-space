

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sessions.css";
import { getMySessions, joinCall, getDoctorSessions, canJoinSession } from "../../api/sessionsApi";

function RoomCards() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningSessionId, setJoiningSessionId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const getSessionId = (session) => session.sessionsId;
  const getSessionId = (session) => session.sessionId || session.sessionsId || session.id;


  const parseDateTime = (dateStr, timeStr) => {
    try {
      const datePart = dateStr.split("T")[0];
      let [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");
      
      if (hours === "12") hours = "00";
      if (modifier === "PM") hours = parseInt(hours, 10) + 12;
      
      return new Date(`${datePart}T${hours.toString().padStart(2, '0')}:${minutes}:00`);
    } catch (e) {
      return new Date(dateStr);
    }
  };

  const handleJoinSession = async (session) => {
    if (!canJoinSession(session)) {
      setError("The session hasn't started yet. You can join up to 15 minutes before the scheduled time..");
      return;
    }
    const sessionId = getSessionId(session);
    setError("");
    setJoiningSessionId(sessionId);
    try {
      const callData = await joinCall({ sessionId, isGroupCall: true, callSessionId: 0 });
      navigate("/meeting", { state: { session, callData } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join call.");
    } finally {
      setJoiningSessionId(null);
    }
  };

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        let data;
        if (userRole === "Doctor") {
          data = await getDoctorSessions();
          const raw = Array.isArray(data) ? data : (data?.upcoming || []);
          setUpcoming(raw.filter(s => s.status !== "Completed" && !s.isEnded));
        } 
        else {
          data = await getMySessions();
          const all = [...(data?.upcoming || []), ...(data?.past || [])];
          
          const refinedUpcoming = [];
          const refinedPast = [];
          const now = new Date();

          all.forEach(session => {
            const sessionStart = parseDateTime(session.date, session.time);
            const diffInMinutes = (now - sessionStart) / (1000 * 60);

            const isEndedByDoc = session.status === "Completed" || session.isEnded === true;
            const isExpired = diffInMinutes > 15;

            if (isEndedByDoc || isExpired) {
              refinedPast.push(session);
            } else {
              refinedUpcoming.push(session);
            }
          });

          const unique = (arr) => Array.from(new Map(arr.map(s => [getSessionId(s), s])).values());
          
          setUpcoming(unique(refinedUpcoming));
          setPast(unique(refinedPast));
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [userRole]);

  if (loading) return <div className="page-wrapper">Loading...</div>;

  return (
    <div className="page-wrapper">
      <h3 className="page-title">Upcoming Sessions</h3>
      {error && (
        <div className="alert alert-danger text-center" style={{ maxWidth: "500px", margin: "0 auto 20px" }}>
          {error} <button className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="cards-container">
        {upcoming.length === 0 ? <p className="no-data">No upcoming sessions found</p> : 
          upcoming.map((session, index) => (
            <div className="room-card" key={getSessionId(session) || index}>
              <div className="session-header">
                <div>
                  <div className="session-type-name">{session.sessionType || "Group"}</div>
                  <div className="session-doctor">
                    {userRole === "Patient" ? `with ${session.doctorName}` : `with ${session.patientName}`}
                  </div>
                </div>
                <div className="call-badge"><i className="bi bi-camera-video"></i> {session.sessionType || "Group"}</div>
              </div>
              <div className="session-info">
                <span><i className="bi bi-calendar"></i> {session.date?.split("T")[0]}</span>
                <span><i className="bi bi-clock"></i> {session.time}</span>
              </div>
              <div className="card-actions">
                <button className="join-btn primary" onClick={() => handleJoinSession(session)} disabled={joiningSessionId === getSessionId(session)}>
                  {joiningSessionId === getSessionId(session) ? "Joining..." : "Join Session"}
                </button>
                <button className="reschedule-btn">Reschedule</button>
              </div>
            </div>
          ))
        }
      </div>

      {userRole === "Patient" && (
        <>
          <h3 className="page-title mt-5">Past Sessions</h3>
          <div className="past-sessions-list">
            {past.length === 0 ? <p className="no-data">No past sessions found</p> : 
              past.map((session, index) => (
                <div className="past-row-card" key={`past-${index}`}>
                  <div className="past-info-side">
                    <div className="past-title">{session.sessionType || "Session"}</div>
                    <div className="past-doctor">with {session.doctorName}</div>
                    <div className="past-meta">
                      <span>{session.date?.split("T")[0]}</span> | <span>{session.time}</span>
                    </div>
                  </div>
                  <div className="past-actions-side"><button className="book-again-btn">Book Again</button></div>
                </div>
              ))
            }
          </div>
        </>
      )}
    </div>
  );
}

export default RoomCards;