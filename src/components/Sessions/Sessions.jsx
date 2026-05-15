
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

const getSessionId = (session) => session.sessionId || session.sessionsId || session.id;
  const formatTime12h = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const parseDateTime = (dateStr, timeStr) => {
    try {
      const datePart = dateStr.split("T")[0];
      return new Date(`${datePart}T${timeStr}:00`);
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
        const now = new Date();
        const refinedUpcoming = [];
        const refinedPast = [];

        if (userRole === "Doctor") { 
          data = await getDoctorSessions(); 
        } else { 
          data = await getMySessions(); 
        }

        const allSessions = Array.isArray(data) 
          ? data 
          : [...(data?.Upcoming || data?.upcoming || []), ...(data?.Past || data?.past || [])];

        allSessions.forEach(session => {
          const dateVal = session.date || session.Date;
          const timeVal = session.time || session.Time;
          const sessionStart = parseDateTime(dateVal, timeVal);
          const diffInMinutes = (now - sessionStart) / (1000 * 60);

          const isEndedByDoc = session.status === "Completed" || session.status === "Ended" || session.isEnded === true;
          const isExpired = diffInMinutes > 60;

          if (isEndedByDoc || isExpired) { 
            refinedPast.push(session); 
          } else { 
            refinedUpcoming.push(session); 
          }
        });

        if (userRole === "Doctor") {
          const seenGroups = new Map();
          const doctorUpcoming = refinedUpcoming.filter(session => {
            const type = session.SessionType || session.sessionType;
            if (type === "Group") {
              const groupKey = `${session.Date || session.date}-${session.Time || session.time}`;
              if (seenGroups.has(groupKey)) return false;
              seenGroups.set(groupKey, true);
              return true;
            }
            return true;
          });
          setUpcoming(doctorUpcoming);
          setPast(refinedPast);
        } else {
          setUpcoming(refinedUpcoming);
          setPast(refinedPast);
        }

      } catch (err) { 
        console.error("Error fetching sessions:", err); 
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
          upcoming.map((session, index) => {
            const patientsList = session.Patients || session.patients || [];
            const sessionType = session.SessionType || session.sessionType;
            const date = session.Date || session.date;
            const time = session.Time || session.time;
            const pCount = session.PatientsCount ?? session.patientsCount ?? patientsList.length ?? 0;            

            return (
              <div className="room-card" key={`${getSessionId(session)}-${index}`}>
                <div className="session-header">
                  <div>
                    <div className="session-type-name">{sessionType || "Group"}
                     {sessionType === "Group" && userRole === "Doctor" && (
                        <span className="patients-count-badge">({pCount} Patients)</span>
                      )}
                    </div>
                    <div className="session-doctor">
                      {userRole === "Patient" 
                        ? `with ${session.doctorName || "Doctor"}` 
                        : (sessionType === "Group") 
                          ? "" 
                          : (patientsList.length > 0)
                            ? `with ${patientsList[0].Name || patientsList[0].name}` 
                            : ""
                      }
                    </div>
                  </div>
                  <div className="call-badge"><i className="bi bi-camera-video"></i> {sessionType || "Group"}</div>
                </div>
                <div className="session-info">
                  <span><i className="bi bi-calendar"></i> {date?.split("T")[0]}</span>
                  <span><i className="bi bi-clock"></i> {formatTime12h(time)}</span>
                </div>
                <div className="card-actions">
                  <button className="join-btn primary" onClick={() => handleJoinSession(session)} disabled={joiningSessionId === getSessionId(session)}>
                    {joiningSessionId === getSessionId(session) ? "Joining..." : "Join Session"}
                  </button>
                  <button className="reschedule-btn">Reschedule</button>
                </div>
              </div>
            );
          })
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
                    <div className="past-title">{session.SessionType || session.sessionType || "Session"}</div>
                    <div className="past-doctor">with {session.doctorName || "Doctor"}</div>
                    <div className="past-meta">
                      <span>{(session.Date || session.date)?.split("T")[0]}</span> | <span>{formatTime12h(session.Time || session.time)}</span>
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