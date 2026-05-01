

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors } from "../../api/doctorsApi";
import { startChatApi, getMyChats } from "../../api/chatApi"; 
import "./Doctors.css";

export default function Doctors() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const handleStartChat = async (doctor) => {
    try {
      const patientId = localStorage.getItem("patientId");
      
      if (!patientId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const myChatsRes = await getMyChats(patientId);
      const existingChat = myChatsRes.data.find(c => c.doctorId === doctor.id);

      if (existingChat) {
        navigate(`/start-chat/${existingChat.id}?docId=${doctor.id}`);
        return;
      }

      const chatPayload = {
        id: 0, 
        doctorId: doctor.id,
        patientProfileId: parseInt(patientId),
        doctorName: doctor.fullName,
        imageUrl: doctor.imageUrl || ""
      };

      const res = await startChatApi(chatPayload);
      
      if (res.data && res.data.id) {
        navigate(`/start-chat/${res.data.id}?docId=${doctor.id}`);
      }
    } catch (err) {
      console.error("Failed to start chat:", err);
      const fallbackId = err.response?.data?.id;
      if (fallbackId) {
        navigate(`/start-chat/${fallbackId}?docId=${doctor.id}`);
      } else {
        alert("Error starting chat, please try again.");
      }
    }
  };

  if (loading) return <p className="text-center mt-5">Loading doctors...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="doctors-therapist-page">
      <h2 className="doctors-page-title text-center">Find Your Therapist</h2>
      <div className="doctors-container-fluid">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {therapists.map((t, index) => (
            <div className="col" key={index}>
              <div className="doctors-therapist-card">
                <div className="doctors-img-wrapper">
                  <img src={`http://doctorprofile.runasp.net${t.imageUrl}`} alt={t.fullName} />
                  <span className="doctors-rating-badge">⭐ {t.rating}</span>
                </div>
                <div className="card-body">
                  <h5 className="fw-bold">{t.fullName}</h5>
                  <p className="small text-muted">{t.specialization}</p>
                  
                  <button
                    className="btn doctors-btn-main w-100 mb-2"
                    onClick={() => navigate(`/doctorprofile/${t.id}`)}
                  >
                    View Profile
                  </button>

                  <button
                    className="btn doctors-btn-outline-main w-100"
                    onClick={() => handleStartChat(t)} 
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}