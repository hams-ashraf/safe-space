// ─── PatientProfile.jsx ──────────────────────────────────────────────
import React from "react";
import patientImg from '../assets/images.jfif'; // حطي الصورة في src/assets/
import "./PatientProfile.css";

export default function PatientProfile() {
  return (
    <>
      <section className="py-4 w-90">
        <h1 className="fw-bolder">My Profile</h1>
        <p className="text-gray fs-5">Manage your personal information and track your progress</p>

        <div className="row w-100 justify-content-between align-items-start mt-4">
          {/* Sidebar */}
          <div className="col-4">
            <div className="pt-4 pb-4 rounded-4 shadow bg-white">
              <div className="justify-content-center d-flex rounded-circle overflow-hidden w-50 h-50 m-auto">
                <img src={patientImg} alt="Patient" className="w-100" />
              </div>
              <h4 className="fw-bolder justify-content-center d-flex mt-4">Alex Thompson</h4>
              <p className="text-gray justify-content-center d-flex">Member since Jan 2026</p>

              <div className="ms-4 mt-4 mb-4">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="fa-regular fa-envelope text-gray"></i>
                  <small className="text-gray mb-0">alex.thompson@email.com</small>
                </div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="fa-solid fa-phone text-gray"></i>
                  <small className="text-gray mb-0">+1 (555) 123-4567</small>
                </div>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <i className="fa-solid fa-location-dot text-gray"></i>
                  <small className="text-gray mb-0">San Francisco, CA</small>
                </div>
              </div>

              <div className="justify-content-center d-flex">
                <button className="btn big-btn">Edit Profile</button>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-4 shadow bg-white mb-5">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-lightgreen rounded-4 d-flex justify-content-center align-items-center">
                  <i className="fa-solid fa-arrow-trend-up text-green"></i>
                </div>
                <h5 className="fw-bolder mb-0">My Progress</h5>
              </div>
              <div className="d-flex justify-content-between ps-2 pe-2 align-items-center mt-3">
                <p className="text-gray">Total Sessions</p>
                <p className="fw-bolder fs-5">24</p>
              </div>
              <div className="d-flex justify-content-between ps-2 pe-2 align-items-center">
                <p className="text-gray">Active Streak</p>
                <p className="fw-bolder text-green fs-5">8 weeks</p>
              </div>
              <div className="d-flex justify-content-between ps-2 pe-2 align-items-center">
                <p className="text-gray mb-0">Wellness Score</p>
                <p className="fw-bolder text-green fs-5 mb-0">78%</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-8">
            <div className="bg-white rounded-4 shadow p-4">
              <h3 className="fw-bolder">Upcoming Sessions</h3>

              {[1,2].map((i) => (
                <div key={i} className="p-3 d-flex justify-content-between align-items-center border rounded-4 zoom mt-3">
                  <div>
                    <h5 className="fw-bolder">Anxiety Management</h5>
                    <small className="text-gray">with Dr. Sarah Johnson</small>
                    <div className="d-flex align-items-center gap-3 mt-2">
                      <small><i className="fa-regular fa-calendar text-gray m-0"></i></small>
                      <small className="text-gray">Feb 25, 2026 2:00 PM</small>
                    </div>
                  </div>
                  <div className="align-self-center">
                    <button className="btn small-btn pt-2 pb-2 ps-3 pe-3">Join Session</button>
                  </div>
                </div>
              ))}

            </div>

            <div className="bg-white rounded-4 shadow p-4 mt-4">
              <h3 className="fw-bolder">Preferences</h3>
              {[1,2].map((i) => (
                <div key={i} className="d-flex justify-content-between bg align-items-center justify-content-center rounded-4 p-4 mt-3">
                  <p className="fw-bold mb-0">Email Notifications</p>
                  <div className="form-check form-switch">
                    <input className="form-check-input switch" type="checkbox" role="switch" defaultChecked />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}