
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyChats, getDoctorRecentChats } from "../../api/chatApi";
import "./Chat.css";

export default function Chat() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    async function fetchChats() {
      try {
        setLoading(true);
        const patientId = localStorage.getItem("patientId");
        
        const res = (userRole === "Doctor") 
          ? await getDoctorRecentChats() 
          : await getMyChats(patientId);

        let rawData = res.data || [];//لو مفيش داتا هعرض matrix فاضيه

        if (userRole !== "Doctor") {
          const cutoff = new Date();
          cutoff.setHours(cutoff.getHours() - 24);

          rawData = rawData.map(chat => {
            const msgDate = new Date(chat.sendAt || chat.time); 
            //el message old w m4 saved
            if (msgDate < cutoff && !chat.isSaved) {
              return {
                ...chat,
                lastMessage: "No messages in the last 24h", 
                time: "" 
              };
            }
            return chat;
          });
        }

        setChats(rawData);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [userRole]);

  return (
    <div className="cc-page-container">
      <div className="container">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="cc-main-title mb-0">Chats</h4>
          {userRole !== "Doctor" && (
            <button 
              className="cc-add-btn-top" 
              title="Start New Chat"
              onClick={() => navigate("/start-new-chat")}
            >
              +
            </button>
          )}
        </div>

        <div className="cc-list-wrapper">
          {loading ? (
            <p className="text-center mt-4">Loading your conversations...</p>
          ) : error ? (
            <p className="text-center mt-4 text-danger">{error}</p>
          ) : chats.length === 0 ? (
            <div className="text-center mt-5">
              <p className="text-muted">No chats found.</p>
            </div>
          ) : (
            chats.map((chat, index) => {
              const currentId = chat.chatId || chat.id; 

              return (
                <div 
                  key={currentId || index} 
                  className="cc-whatsapp-card" 
                  onClick={() => {
                    if (!currentId) return;
                    if (userRole === "Doctor") {
                      navigate(`/start-chat/${currentId}`); 
                    } else {
                      navigate(`/start-chat/${currentId}?docId=${chat.doctorId}`);
                    }
                  }}
                >
                  <div className="cc-avatar-side">
                    <div className="cc-initials-circle">
                      {userRole === "Doctor" 
                        ? (chat.patientInitial || (chat.patientName?.charAt(0).toUpperCase() || "P"))
                        : (chat.doctorInitial || (chat.doctorName?.replace(/^(Dr\.|Dr|Mr\.|Mr|Ms\.|Ms|Mrs\.|Mrs)\s+/i, "").charAt(0).toUpperCase() || "D"))
                      }
                    </div>
                  </div>

                  <div className="cc-info-side">
                    <div className="cc-info-header">
                      <h6 className="cc-doctor-name">
                        {userRole === "Doctor" ? (chat.patientName || "Anonymous Patient") : (chat.doctorName || `Doctor ${chat.doctorId}`)}
                      </h6>
                      <span className="cc-chat-time">{chat.time}</span>
                    </div>
                    <p className="cc-last-msg">{chat.lastMessage || "No messages yet."}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}