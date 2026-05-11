import React, { useEffect, useState } from "react";
import { getDoctors } from "../../api/doctorsApi";
import { useNavigate, Link } from "react-router-dom";
import {
  getMySessions,
  getDoctorSessions,
  joinCall,
  canJoinSession,
} from "../../api/sessionsApi";
import { isDoctorUser } from "../../api/roleApi";
import "./Home.css";

export default function Home() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const isDoctor = isDoctorUser();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [joiningSessionId, setJoiningSessionId] = useState(null);
  const [joinError, setJoinError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await getDoctors();
        setTherapists(res.data);
      } catch (err) {
        setError(err.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (isDoctor) {
      async function fetchSessions() {
        setLoadingSessions(true);
        try {
          const res = await getDoctorSessions();
          let upcoming = [];
          if (Array.isArray(res)) {
            upcoming = res;
          } else if (res && Array.isArray(res.upcoming)) {
            upcoming = res.upcoming;
          } else if (res && typeof res === "object") {
            upcoming = res.data || res.upcoming || [];
          }

          const now = new Date();
          const todayDay = now.getDate();
          const todayMonth = now.getMonth() + 1;
          const todayYear = now.getFullYear();

          const endedSessions = JSON.parse(localStorage.getItem("ended_sessions") || "[]");

          upcoming = upcoming.filter(s => {
            const sid = s.sessionId || s.sessionsId || s.id;
            if (sid && endedSessions.some(es => String(es) === String(sid))) {
              return false; 
            }

            const status = String(s.status || s.Status || "").toLowerCase();
            if (status === "completed" || status === "ended" || status === "done") {
              return false;
            }

            const dateRaw = s.date || s.Date;
            if (dateRaw) {
              const parts = dateRaw.split('T')[0].split(/[-/]/);
              if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const p1 = parseInt(parts[1], 10);
                const p2 = parseInt(parts[2], 10);

                const isSameYear = year === todayYear;
                const matchesToday = (p1 === todayMonth && p2 === todayDay) || (p1 === todayDay && p2 === todayMonth);
                
                if (!isSameYear || !matchesToday) {
                  return false;
                }
              }
            }
            return true;
          });

          setUpcomingSessions(upcoming);
        } catch (err) {
          console.error("Error loading sessions:", err);
        } finally {
          setLoadingSessions(false);
        }
      }
      fetchSessions();
    }
  }, [isDoctor]);

  // Top 3 rated doctors
  const topRatedDoctors = [...therapists]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleJoinSession = async (session) => {
    setJoinError("");
    if (!canJoinSession(session)) {
      setJoinError("The session hasn't started yet. You can join up to 15 minutes before the scheduled time.");
      return;
    }
    const sessionId = session.sessionId || session.sessionsId || session.id;
    if (!sessionId) return;
    
    setJoiningSessionId(sessionId);
    try {
      const callData = await joinCall({
        sessionId,
        isGroupCall: session.sessionType !== "OneToOne",
        callSessionId: 0,
      });

      navigate("/meeting", {
        state: {
          session,
          callData,
        },
      });
    } catch (err) {
      console.error("Join call error detail:", err.response || err);
      let errorMsg = "Failed to join call.";
      if (err.response?.data) {
        errorMsg = typeof err.response.data === 'string' ? err.response.data : (err.response.data.message || errorMsg);
      }
      setJoinError(`Backend Error: ${errorMsg}`);
    } finally {
      setJoiningSessionId(null);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-center py-5">
        <div className="container py-5">
          <h1 className="display-3 fw-bold mb-3">
            Your Safe Space for Mental Health Support
          </h1>
          <p className="lead fs-4 mb-4">
            Connect anonymously with licensed therapists through private voice
            sessions, join supportive group therapy{!isDoctor && ", or chat instantly with our AI assistant"}.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {!isDoctor && (
              <>
                <button className="custom-button" onClick={() => navigate("/doctors")}>
                  <i className="fa-solid fa-user-doctor"></i> Find a Therapist
                </button>
                <button className="custom-button" onClick={() => navigate("/ai-chat")} >
                  <i className="fa-solid fa-robot"></i> Chat with Wanees
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Doctor Upcoming Sessions Section */}
      {isDoctor && (
        <section className="py-5 mb-5 bg-white">
          <div className="container">
            <h2 className="text-center fw-bold mb-4" style={{ color: "#41655d" }}>
              Today's Sessions
            </h2>
            {joinError && (
              <div className="alert alert-danger alert-dismissible fade show text-center" role="alert" style={{ fontSize: "14px", maxWidth: "500px", margin: "0 auto 20px" }}>
                {joinError}
                <button type="button" className="btn-close" onClick={() => setJoinError("")} aria-label="Close"></button>
              </div>
            )}
            {loadingSessions ? (
              <p className="text-center">Loading your sessions...</p>
            ) : upcomingSessions.length === 0 ? (
              <p className="text-center text-muted">You have no sessions scheduled for today.</p>
            ) : (
              <div className="card section-bg shadow-sm border-0 rounded-4 p-4">
                {upcomingSessions.map((session, index) => (
                  <div className="card bg-white shadow-sm border-0 rounded-3 mb-3 mx-auto" key={session.sessionId || index} style={{ borderLeft: "4px solid #41655d", width: "100%" }}>
                    <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4">
                      <div className="mb-3 mb-md-0">
                        <h5 className="fw-bold mb-1" style={{ color: "#41655d" }}>{session.patientName}</h5>
                        <div className="d-flex align-items-center gap-3 text-muted small mt-2">
                          <span>
                            <i className="fa-regular fa-clock me-1"></i> {session.time}
                          </span>
                          <span>
                            <i className="fa-solid fa-video me-1"></i> {session.sessionType === "OneToOne" ? "One to One" : "Group Therapy"}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          className="btn text-white px-4 py-2 rounded-3 fw-bold"
                          style={{ backgroundColor: "#41655d" }}
                          onClick={() => handleJoinSession(session)}
                          disabled={joiningSessionId === (session.sessionId || session.sessionsId)}
                        >
                          {joiningSessionId === (session.sessionId || session.sessionsId) ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Joining...
                            </>
                          ) : (
                            "Join Session"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Top Rated Therapists Section */}
      <section id="top-rated" className="section-bg py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{ color: "#41655d" }}> Top Rated Therapists</h2>

    {loading && <p className="text-center">Loading doctors...</p>}
    {error && <p className="text-danger text-center">{error}</p>}

    <div className="row g-4">
      {topRatedDoctors.map((t) => (
  <div className="col-md-4" key={t.id}>
    <div
      className="card shadow-sm text-center top-rated-card h-100 d-flex flex-column"
      onClick={() => navigate(`/doctor/${t.id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        src={`http://doctorprofile.runasp.net${t.imageUrl}`}
        className="card-img-top"
        alt={t.fullName}
      />

      <div className="card-body d-flex flex-column flex-grow-1">
        <h5 className="card-title">{t.fullName}</h5>
        <p className="card-text">{t.specialization}</p>

        <div className="text-warning">
          {Array.from({ length: Math.floor(t.rating) }).map((_, i) => (
            <i key={i} className="fa-solid fa-star"></i>
          ))}
          {Array.from({ length: 5 - Math.floor(t.rating) }).map((_, i) => (
            <i key={i} className="fa-regular fa-star"></i>
          ))}
        </div>

        <p className="card-text mb-0 mt-3 flex-grow-1 d-flex align-items-center justify-content-center text-center">
          Years of Experience: {t.yearOfExperience}
        </p>    
      </div>
    </div>
  </div>
))}
    </div>
  </div>
</section>
{/* Section 3: Anonymous Feedback */}
<section className="feedback-section py-5">
  <div className="container">
    <h2 className="text-center fw-bold mb-5">Anonymous Feedback 💬</h2>
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card shadow-sm h-100 p-4 text-center">
          <div className="text-warning mb-3 fs-5">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <p className="text-muted fst-italic">
            “I finally felt safe talking about things I never shared before.
            The anonymous feature made all the difference.”
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm h-100 p-4 text-center">
          <div className="text-warning mb-3 fs-5">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-regular fa-star"></i>
          </div>
          <p className="text-muted fst-italic">
            “This platform helped me during one of the hardest times in my life.
            Knowing my identity was protected gave me peace.”
          </p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm h-100 p-4 text-center">
          <div className="text-warning mb-3 fs-5">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
          <p className="text-muted fst-italic">
            “A truly safe space. I felt heard, respected, and supported
            without fear of judgment.”
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      
    </>
  )
}
