

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../../api/doctorsApi";
import { startChatApi, getMyChats } from "../../api/chatApi"; 
import "./StartNewChat.css";

export default function StartNewChat() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors()
      .then((res) => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setLoading(false);
      });
  }, []);

  const handleStartChat = async (doctor) => {
    try {
      const pId = localStorage.getItem("patientId");
      if (!pId) {
        alert("User session expired. Please login again.");
        return;
      }

      const myChatsRes = await getMyChats(pId);
      const existingChat = myChatsRes.data.find(c => c.doctorId === doctor.id);

      if (existingChat) {
        navigate(`/start-chat/${existingChat.id}?docId=${doctor.id}`);
        return;
      }

      const chatData = {
        id: 0, 
        doctorId: doctor.id,
        patientProfileId: parseInt(pId),
        doctorName: doctor.fullName,
        imageUrl: doctor.imageUrl || ""
      };

      const res = await startChatApi(chatData);
      
      if (res.data && res.data.id) {
        navigate(`/start-chat/${res.data.id}?docId=${doctor.id}`);
      } else {
        alert("Server did not return a valid Chat ID.");
      }
    } catch (err) {
      console.error("Start Chat Error:", err);
      const fallbackId = err.response?.data?.id;
      if (fallbackId) {
        navigate(`/start-chat/${fallbackId}?docId=${doctor.id}`);
      } else {
        alert("Could not start conversation. Please try again.");
      }
    }
  };

  return (
    <div className="sn-page-container">
      <div className="container mt-4">
        <div className="sn-header-box">
          <h4 className="sn-main-title">Select Doctor</h4>
          <button className="sn-close-btn" onClick={() => navigate(-1)}> x </button>
        </div>

        {loading ? (
          <div className="text-center mt-5" style={{ color: "#2E8B6E" }}>
            <div className="spinner-border" role="status"></div>
            <p className="mt-2">Loading doctors...</p>
          </div>
        ) : (
          <div className="sn-list-wrapper">
            {doctors.length === 0 ? (
              <p className="text-center mt-5 text-muted">No doctors available.</p>
            ) : (
              doctors.map((doc) => (
                <div 
                  key={doc.id} 
                  className="sn-doctor-card" 
                  onClick={() => handleStartChat(doc)} 
                  style={{ cursor: "pointer" }}
                >
                  <div className="sn-avatar-side">
                    {doc.imageUrl ? (
                      <img src={`https://doctorprofile.runasp.net${doc.imageUrl}`} alt={doc.fullName} className="sn-doctor-img" />
                    ) : (
                      <div className="sn-initials-circle">{doc.fullName?.charAt(0).toUpperCase()}</div>
                    )}
                  </div>
                  <div className="sn-info-side">
                    <h6 className="sn-doctor-name">{doc.fullName}</h6>
                    <p className="sn-specialization">{doc.specialization || "Mental Health Professional"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}