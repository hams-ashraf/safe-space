

// // import React, { useEffect, useState } from "react";
// // import "./Sessions.css";
// // import { getMySessions } from "../../api/sessionsApi";

// // function RoomCards() {
// //   const [sessions, setSessions] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchSessions = async () => {
// //       try {
// //         const data = await getMySessions();

// //         const allSessions = [
// //           ...(data?.upcoming || []),
// //           ...(data?.past || [])
// //         ];

// //         setSessions(allSessions);
// //       } catch (err) {
// //         console.log("Error loading sessions:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchSessions();
// //   }, []);

// //   if (loading) {
// //     return <div className="page-wrapper">Loading...</div>;
// //   }

// //   return (
// //     <div className="page-wrapper">
// //       <h3 className="page-title">UpComming Sessions</h3>

// //       <div className="cards-container">
// //         {sessions.length === 0 ? (
// //           <p>No sessions found</p>
// //         ) : (
// //           sessions.map((session, index) => (
// //             <div className="room-card" key={index}>
// //               <div className="session-header">
// //                 <div>
// //                   <div className="session-doctor">
// //                     {session.type || "Session"}
// //                   </div>

// //                   <div className="session-doctor">
// //                     with {session.doctorName || "Doctor"}
// //                   </div>
// //                 </div>

// //                 <div className="call-badge">
// //                   <i className="bi bi-camera-video"></i>
// //                   {session.sessionType || "Call"}
// //                 </div>
// //               </div>

// //               <div className="session-info">
// //                 <span>
// //                   <i className="bi bi-calendar"></i>
// //                   {session.date?.split("T")[0] || "No date"}
// //                 </span>

// //                 <span>
// //                   <i className="bi bi-clock"></i>
// //                   {session.time || "No time"}
// //                 </span>
// //               </div>

// //               <div className="card-actions">
// //                 <button className="join-btn primary">
// //                   Join Session
// //                 </button>

// //                 <button className="reschedule-btn">
// //                   Reschedule
// //                 </button>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default RoomCards;


// import React, { useEffect, useState } from "react";
// import "./Sessions.css";
// import { getMySessions } from "../../api/sessionsApi";

// function RoomCards() {
//   const [upcoming, setUpcoming] = useState([]);
//   const [past, setPast] = useState([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const data = await getMySessions();
//         setUpcoming(data?.upcoming || []);
//         setPast(data?.past || []);
//       } catch (err) {
//         console.log("Error loading sessions:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSessions();
//   }, []);





//   if (loading) {
//     return <div className="page-wrapper">Loading...</div>;
//   }

//   return (
//     <div className="page-wrapper">
//       <h3 className="page-title">Upcoming Sessions</h3>
//       <div className="cards-container">
//         {upcoming.length === 0 ? (
//           <p className="no-data">No upcoming sessions found</p>
//         ) : (
//           upcoming.map((session, index) => (
//             <div className="room-card" key={`up-${index}`}>
//               <div className="session-header">
//                 <div>
//                   <div className="session-type-name">{session.sessionType || "Session"}</div>
//                   <div className="session-doctor">with {session.doctorName}</div>
//                 </div>
//                 <div className="call-badge">
//                   <i className="bi bi-camera-video"></i> {session.sessionType || "Call"}
//                 </div>
//               </div>
//               <div className="session-info">
//                 <span><i className="bi bi-calendar"></i> {session.date?.split("T")[0]}</span>
//                 <span><i className="bi bi-clock"></i> {session.time}</span>
//               </div>
//               <div className="card-actions">
//                 <button className="join-btn primary">Join Session</button>
//                 <button className="reschedule-btn">Reschedule</button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <h3 className="page-title mt-5">Past Sessions</h3>
//       <div className="past-sessions-list">
//         {past.length === 0 ? (
//           <p className="no-data">No past sessions found</p>
//         ) : (
//           past.map((session, index) => (
//             <div className="past-row-card" key={`past-${index}`}>
//               <div className="past-info-side">
//                 <div className="past-title">{session.sessionType || "Initial Consultation"}</div>
//                 <div className="past-doctor">with {session.doctorName}</div>
//                 <div className="past-meta">
//                   <span><i className="bi bi-calendar"></i> {session.date?.split("T")[0]}</span>
//                   <span><i className="bi bi-clock"></i> {session.time}</span>
//                   <span><i className="bi bi-camera-video"></i> Video Call</span>
//                 </div>
//               </div>
//               <div className="past-actions-side">
//                   <button className="book-again-btn" >
//                     Book Again
//                   </button>
//                 </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default RoomCards;

import React, { useEffect, useState } from "react";
import "./Sessions.css";
import { getMySessions, getDoctorSessions } from "../../api/sessionsApi"; // استيراد الدالتين

function RoomCards() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);

  const userRole = localStorage.getItem("userRole");


useEffect(() => {
  const fetchSessions = async () => {
    try {
      let data;
      if (userRole === "Doctor") {
        data = await getDoctorSessions();
        
        setUpcoming(Array.isArray(data) ? data : (data?.upcoming || [])); 
      } else {
        data = await getMySessions();
        setUpcoming(data?.upcoming || []);
        setPast(data?.past || []);
      }
    } catch (err) {
      console.log("Error loading sessions:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchSessions();
}, [userRole]);
  //
  if (loading) {
    return <div className="page-wrapper">Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <h3 className="page-title">
        {userRole === "Doctor" ? "My Appointments" : "Upcoming Sessions"}
      </h3>

      <div className="cards-container">
        {upcoming.length === 0 ? (
          <p className="no-data">No upcoming sessions found</p>
        ) : (
          upcoming.map((session, index) => (
            <div className="room-card" key={`up-${index}`}>
              <div className="session-header">
                <div>
                  <div className="session-type-name">{session.sessionType || "Session"}</div>
                  <div className="session-doctor">
                    {userRole === "Patient" && 
                      (
                        <div className="session-doctor">
                          with {session.doctorName || "Doctor"}
                        </div>
                      )
                    }
                  </div>
                </div>
                <div className="call-badge">
                  <i className="bi bi-camera-video"></i> {session.sessionType || "Call"}
                </div>
              </div>
              <div className="session-info">
                <span><i className="bi bi-calendar"></i> {session.date?.split("T")[0]}</span>
                <span><i className="bi bi-clock"></i> {session.time}</span>
              </div>
              <div className="card-actions">
                <button className="join-btn primary">Join Session</button>
                {userRole === "Patient" && <button className="reschedule-btn">Reschedule</button>}
              </div>
            </div>
          ))
        )}
      </div>

      {userRole === "Patient" && (
        <>
          <h3 className="page-title mt-5">Past Sessions</h3>
          <div className="past-sessions-list">
            {past.length === 0 ? (
              <p className="no-data">No past sessions found</p>
            ) : (
              past.map((session, index) => (
                <div className="past-row-card" key={`past-${index}`}>
                  <div className="past-info-side">
                    <div className="past-title">{session.sessionType || "Initial Consultation"}</div>
                    <div className="past-doctor">with {session.doctorName}</div>
                    <div className="past-meta">
                      <span><i className="bi bi-calendar"></i> {session.date?.split("T")[0]}</span>
                      <span><i className="bi bi-clock"></i> {session.time}</span>
                      <span><i className="bi bi-camera-video"></i> Video Call</span>
                    </div>
                  </div>
                  <div className="past-actions-side">
                    <button className="book-again-btn">Book Again</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default RoomCards;