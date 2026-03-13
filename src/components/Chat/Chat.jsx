import React, { useEffect, useState } from "react";
import { getDoctors } from "../../api/doctorsApi"; 
import "./Chat.css";

export default function Chat() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await getDoctors();
        setDoctors(res.data); 
      } catch (err) {
        setError(err.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  // Top 3 rated doctors
  const topRatedDoctors = [...doctors]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    
    <div className="chat-page container mt-4">

      <div className="top-options mb-4 d-flex gap-2">
        <button className="btn btn-custom active">Top Doctors</button>
        <button className="btn btn-custom">Start New Chat</button>
     </div>

      {loading && <p>Loading doctors...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div id="top-rated" className="row g-4 my-4">
        {topRatedDoctors.map((t, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm text-center top-rated-card h-100">
              <img
                src={`http://doctorprofile.runasp.net${t.imageUrl}`}
                className="card-img-top"
                alt={t.fullName}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{t.fullName}</h5>
                <p className="card-text">{t.specialization}</p>
                <button className="btn btn-custom mt-auto">Send Message</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-box border rounded shadow-sm d-flex flex-column" >   
        <div className="messages flex-grow-1 p-3 overflow-auto">
          <div className="message mb-2 " style={{textAlign:"left"}}>
            <div className="p-2 bg-white rounded shadow-sm d-inline-block">Hello, how can I help you?</div>
          </div>
          <div className="message mb-2" style={{textAlign:"right"}}>
            <div className="p-2 text-white rounded shadow-sm d-inline-block"  style={{ backgroundColor: "#41655d" }}>Hi, I want to start therapy.</div>
          </div>
          <div className="message mb-2" style={{textAlign:"left"}}>
            <div className="p-2 bg-white rounded shadow-sm d-inline-block">Sure! Let's schedule a session.</div>
          </div>
        </div>

        <div className="input-group p-3 border-top">
          <input type="text" className="form-control" placeholder="Type a message..." />
          <button className="btn text-white"  style={{ backgroundColor: "#41655d" }}>Send</button>
        </div>
      </div>
    </div>
  );
}
