

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyChats } from "../../api/chatApi";
import "./Chat.css";

export default function CurrentChats() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChats() {
      try {
        const pId = localStorage.getItem("patientId");

        if (!pId) {
          setError("User data not found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await getMyChats(pId);
        
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 24);

        const filteredChats = res.data.map(chat => {
          const msgDate = new Date(chat.sendAt || chat.time); 
          
          if (msgDate < cutoff && !chat.isSaved) {
            return {
              ...chat,
              lastMessage: "No messages in the last 24h", 
              time: "" 
            };
          }
          return chat;
        });

        setChats(filteredChats);
      } catch (err) {
        console.error("Error fetching chats:", err);
        setError("Failed to load conversations.");
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  return (
    <div className="cc-page-container">
      <div className="container">
        <h4 className="cc-main-title">Chats</h4>

        <div className="cc-header-action">
          <button 
            className="cc-add-btn-top" 
            title="Start New Chat"
            onClick={() => navigate("/start-new-chat")} 
          >
            +
          </button>
        </div>

        <div className="cc-list-wrapper">
          {loading ? (
            <p className="text-center mt-4">Loading your conversations...</p>
          ) : error ? (
            <p className="text-center mt-4 text-danger">{error}</p>
          ) : chats.length === 0 ? (
            <div className="text-center mt-5">
              <p className="text-muted">No chats found. Start a new conversation!</p>
            </div>
          ) : (
            chats.map((chat) => (
              
              <div 
                key={chat.id} 
                className="cc-whatsapp-card" 
                onClick={() => navigate(`/start-chat/${chat.id}?docId=${chat.doctorId}`)}
              >
                <div className="cc-avatar-side">
                  <div className="cc-initials-circle">
                    {chat.doctorInitial || (chat.doctorName ? chat.doctorName.replace(/^(Dr\.|Dr|Mr\.|Mr|Ms\.|Ms|Mrs\.|Mrs)\s+/i, "").charAt(0).toUpperCase() : "D")}
                  </div>
                </div>

                <div className="cc-info-side">
                  <div className="cc-info-header">
                    <h6 className="cc-doctor-name">{chat.doctorName || `Doctor ${chat.doctorId}`}</h6>
                    <span className="cc-chat-time">{chat.time}</span>
                  </div>
                  <p className="cc-last-msg">
                    {chat.lastMessage || "No messages yet. Click to start chatting!"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}