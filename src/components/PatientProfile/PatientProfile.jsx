
import React, { useEffect, useState } from "react";
import { getMyProfile } from "../../api/patientApi";
import defaultImg from "../../assets/myprofile.avif";
import "./PatientProfile.css";

export default function PatientProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

              {(user.sessions || []).length === 0 ? (
                <p className="text-gray mt-3">No sessions yet</p>
              ) : (
                user.sessions.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 d-flex justify-content-between align-items-center border rounded-4 mt-3"
                  >
                    <div>
                      <h5 className="fw-bolder">{s.title || "Session"}</h5>
                      <small className="text-gray">
                        with {s.doctorName || "Doctor"}
                      </small>

                      <div className="mt-2">
                        <small className="text-gray">
                          {s.date || "Date not set"}
                        </small>
                      </div>
                    </div>

                    <button className="btn small-btn">
                      Join Session
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
              <input
               className="form-check-input switch"
              type="checkbox"
             role="switch"
             />
          </div>
       </div>
    </div>

  </div>
  </div>
     </section>
    </>
  );
}