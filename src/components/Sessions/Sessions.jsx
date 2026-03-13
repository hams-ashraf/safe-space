
import React from "react";
import "./Sessions.css";

function RoomCards() {
  return (
    <div className="page-wrapper">
      <h3 className="page-title">My Sessions</h3>

      <div className="cards-container">
        {/* Card 1 */}
        <div className="room-card">
          <div className="session-header">
            <div>
              <div className="session-doctor">1-1 session</div>
              <div className="session-doctor">with Dr. Sarah Johnson</div>
            </div>

            <div className="call-badge">
              <i className="bi bi-camera-video"></i>
              Video Call
            </div>
          </div>

          <div className="session-info">
            <span>
              <i className="bi bi-calendar"></i>
              Mar 2, 2026
            </span>
            <span>
              <i className="bi bi-clock"></i>
              5:00 PM
            </span>
          </div>

          <div className="card-actions">
            <button className="join-btn primary">Join Session</button>
            <button className="reschedule-btn">Reschedule</button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="room-card">
          <div className="session-header">
            <div>
            <div className="session-doctor">Group session</div>

              <div className="session-doctor">with Dr. Michael Chen</div>
            </div>

            <div className="call-badge">
              <i className="bi bi-telephone"></i>
              Phone Call
            </div>
          </div>

          <div className="session-info">
            <span>
              <i className="bi bi-calendar"></i>
              Mar 5, 2026
            </span>
            <span>
              <i className="bi bi-clock"></i>
              9:00 AM
            </span>
          </div>

          <div className="card-actions">
            <button className="join-btn primary">Join Session</button>
            <button className="reschedule-btn">Reschedule</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCards;