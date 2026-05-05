import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../../api/patientApi";
import { getMySessions, joinCall, canJoinSession } from "../../api/sessionsApi";
import defaultImg from "../../assets/myprofile.avif";
import "./PatientProfile.css";

export default function PatientProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState("");
  const [joiningSessionId, setJoiningSessionId] = useState(null);
  const navigate = useNavigate();

  const getSessionId = (session) => session?.sessionsId;

  const getSessionStartTs = (session) => {
    const date = session?.date ? String(session.date).split("T")[0] : "";
    const time = session?.time ? String(session.time) : "00:00";
    const iso = date ? `${date}T${time}` : "";
    const t = iso ? Date.parse(iso) : NaN;
    return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t;
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getMyProfile();
        setUser(res.data);
      } catch (err) {
        console.log("PROFILE ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setSessionsError("");
        const data = await getMySessions();
        setUpcomingSessions(data?.upcoming || []);
      } catch (err) {
        setSessionsError(err?.response?.data?.message || "Failed to load upcoming sessions.");
        setUpcomingSessions([]);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const sortedUpcoming = useMemo(() => {
    return [...upcomingSessions].sort((a, b) => getSessionStartTs(a) - getSessionStartTs(b));
  }, [upcomingSessions]);

  const handleJoinSession = async (session) => {
    if (!canJoinSession(session)) {
      setSessionsError("The session hasn't started yet. You can join up to 15 minutes before the scheduled time.");
      return;
    }
    const sessionId = getSessionId(session);
    if (!sessionId) {
      setSessionsError("Session ID is missing for this session.");
      return;
    }

    setSessionsError("");
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
      setSessionsError(err?.response?.data?.message || "Failed to join call.");
    } finally {
      setJoiningSessionId(null);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!user) return <p className="text-center mt-5">No data found</p>;

  return (
    <>
      <section className="py-4 w-90">
        <h1 className="fw-bolder">My Profile</h1>
        <p className="text-gray fs-5">
          Manage your personal information and track your progress
        </p>

        <div className="row w-100 justify-content-between align-items-start mt-4">
          {/* Sidebar */}
          <div className="col-12 col-lg-4">
            <div className="pt-4 pb-4 rounded-4 shadow bg-white">
              {/* Image */}
              <div className="justify-content-center d-flex rounded-circle overflow-hidden w-50 h-50 m-auto">
                <img
                  src={defaultImg}
                  alt="Patient"
                  className="w-100"
                />
              </div>

              {/* Name */}
              <h4 className="fw-bolder justify-content-center d-flex mt-4">
                {user.fullName || "No Name"}
              </h4>

              {/* Member since */}
              <p className="text-gray justify-content-center d-flex">
                Member since {user.createdAt?.slice(0, 7) || "2026"}
              </p>

              {/* Info */}
              <div className="ms-4 mt-4 mb-4">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="fa-regular fa-envelope text-gray"></i>
                  <small className="text-gray mb-0">{user.email}</small>
                </div>

                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="fa-solid fa-phone text-gray"></i>
                  <small className="text-gray mb-0">
                    {user.phoneNumber || "N/A"}
                  </small>
                </div>

                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="fa-solid fa-location-dot text-gray"></i>
                  <small className="text-gray mb-0">
                    {user.address || "Not set"}
                  </small>
                </div>
              </div>

              <div className="justify-content-center d-flex">
                <button className="btn big-btn">Edit Profile</button>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4 p-4 rounded-4 shadow bg-white mb-5">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-lightgreen rounded-4 d-flex justify-content-center align-items-center">
                  <i className="fa-solid fa-arrow-trend-up text-green"></i>
                </div>
                <h5 className="fw-bolder mb-0">My Progress</h5>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <p className="text-gray">Total Sessions</p>
                <p className="fw-bolder fs-5">
                  {user.totalSessions || 0}
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <p className="text-gray">Active Streak</p>
                <p className="fw-bolder text-green fs-5">
                  {user.streak || 0} weeks
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <p className="text-gray mb-0">Wellness Score</p>
                <p className="fw-bolder text-green fs-5 mb-0">
                  {user.wellnessScore || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-12 col-lg-8">
            {/* Upcoming Sessions */}
            <div className="bg-white rounded-4 shadow p-4">
              <h3 className="fw-bolder">Upcoming Sessions</h3>
              {sessionsError && (
                <div className="alert alert-danger alert-dismissible fade show mt-3 text-center" role="alert" style={{ fontSize: "14px", maxWidth: "500px", margin: "0 auto 20px" }}>
                  {sessionsError}
                  <button type="button" className="btn-close" onClick={() => setSessionsError("")} aria-label="Close"></button>
                </div>
              )}

              {sessionsLoading ? (
                <p className="text-gray mt-3 mb-0">Loading upcoming sessions...</p>
              ) : sortedUpcoming.length === 0 ? (
                <p className="text-gray mt-3 mb-0">No upcoming sessions</p>
              ) : (
                sortedUpcoming.map((s, i) => (
                  <div
                    key={getSessionId(s) || i}
                    className="p-3 d-flex justify-content-between align-items-center border rounded-4 mt-3"
                  >
                    <div>
                      <h5 className="fw-bolder mb-1">{s.type || "Session"}</h5>
                      <small className="text-gray">with {s.doctorName || "Doctor"}</small>

                      <div className="mt-2 d-flex gap-3 flex-wrap">
                        <small className="text-gray">
                          <i className="bi bi-calendar me-1"></i>
                          {s.date?.split("T")[0] || "No date"}
                        </small>
                        <small className="text-gray">
                          <i className="bi bi-clock me-1"></i>
                          {s.time || "No time"}
                        </small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn small-btn"
                      onClick={() => handleJoinSession(s)}
                      disabled={joiningSessionId === getSessionId(s)}
                    >
                      {joiningSessionId === getSessionId(s) ? "Joining..." : "Join Session"}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-4 shadow p-4 mt-4">
              <h3 className="fw-bolder">Preferences</h3>

              {/* Email Notifications */}
              <div className="d-flex justify-content-between align-items-center rounded-4 p-4 mt-3 bg">
                <p className="fw-bold mb-0">Email Notifications</p>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input switch"
                    type="checkbox"
                    role="switch"
                  />
                </div>
              </div>

              {/* SMS Reminders */}
              <div className="d-flex justify-content-between align-items-center rounded-4 p-4 mt-3 bg">
                <p className="fw-bold mb-0">SMS Reminders</p>
                <div className="form-check form-switch">
                  <input className="form-check-input switch" type="checkbox" role="switch" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}