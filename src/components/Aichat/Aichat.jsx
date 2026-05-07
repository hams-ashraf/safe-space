import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as signalR from "@microsoft/signalr";
import "./Aichat.css";
import waneesImg from "../../assets/wanees.png.jfif";

export default function Aichat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      sender: "Wanees", 
      text: "Hello! I am Wanees, your AI assistant at Safe Space. How can I help you today?",
      sendAt: new Date().toISOString()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [isTyping, setIsTyping] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "What is Safe Space?",
    "How do I book a session?",
    "I feel anxious today",
    "I need someone to talk to",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const hubUrl = "http://doctorprofile.runasp.net/ChatbotHub";
    let activeConnection = null;

    const startConnection = async () => {
      try {
        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: () => localStorage.getItem("token") || "",
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
          })
          .withAutomaticReconnect()
          .build();

        newConnection.on("ReceiveMessage", (user, text) => {
          console.log(`[SignalR] Received from ${user}: ${text}`);
          
          if (user === "Chatbot" || user === "Wanees") {
            setIsTyping(false);
          }

          const senderName = (user === "Chatbot" || user === "Wanees") ? "Wanees" : user;
          
          setMessages((prev) => {
            // Echo check: if the server echos back the user's message, we show it.
            // If it's a new message from Wanees, we show it.
            return [...prev, { 
              sender: senderName, 
              text, 
              sendAt: new Date().toISOString() 
            }];
          });
        });

        await newConnection.start();
        console.log(`[SignalR] Connected to ${hubUrl}`);
        activeConnection = newConnection;
        setConnection(newConnection);
        setConnectionStatus("Connected");
      } catch (err) {
        console.error("[SignalR] Connection error:", err);
        setConnectionStatus("Connection failed");
      }
    };

    startConnection();

    return () => {
      if (activeConnection) {
        activeConnection.stop().catch(e => console.error("[SignalR] Stop error:", e));
      }
    };
  }, []);

  const handleSend = async (text) => {
    const isQuickQuestion = typeof text === "string";
    const messageText = isQuickQuestion ? text : userInput;

    if (!messageText.trim()) return;

    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      alert("Still connecting to Wanees... please wait.");
      return;
    }

    if (!isQuickQuestion) {
      setUserInput("");
    }

    try {
      console.log(`[SignalR] Invoking SendMessage with: ${messageText}`);
      setIsTyping(true); // Show typing indicator while waiting for backend
      await connection.invoke("SendMessage", messageText);
    } catch (err) {
      console.error("[SignalR] Send error:", err);
      setIsTyping(false);
      setMessages((prev) => [...prev, { 
        sender: "System", 
        text: "Error sending message. Please refresh.", 
        sendAt: new Date().toISOString() 
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="aichat-page container">
      <div className="chat-box shadow d-flex flex-column">
        
        {/* Header */}
        <div className="chat-header p-3 d-flex align-items-center border-bottom bg-white sticky-top">
          <button className="back-btn-simple" onClick={() => navigate(-1)}>
            <span>‹</span>
          </button>
          <div className="d-flex align-items-center ms-2">
            <img 
              src={waneesImg} 
              className="rounded-circle border" 
              style={{ width: '55px', height: '55px', objectFit: 'cover', cursor: 'pointer' }}
              alt="Wanees" 
              onClick={() => setShowImageModal(true)}
              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"; }}
            />
            <div className="ms-3">
              <h5 className="mb-0 doctor-name" style={{ fontSize: '1.25rem' }}>Wanees</h5>
              <small className="text-success" style={{ fontSize: '0.8rem' }}>
                {connectionStatus === "Connected" ? "Online" : connectionStatus}
              </small>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area flex-grow-1">
          {messages.map((msg, index) => {
            const isMe = msg.sender !== "Wanees" && msg.sender !== "System";
            return (
              <div key={index} className={`d-flex mb-1 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`msg-bubble shadow-sm ${isMe ? "msg-patient" : "msg-doctor"}`}>
                  <div className="msg-text">{msg.text}</div>
                  <div className="d-flex align-items-center justify-content-end mt-1" style={{ fontSize: '10px', opacity: 0.7 }}>
                    <span>{formatTime(msg.sendAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="d-flex mb-1 justify-content-start">
              <div className="msg-bubble msg-doctor shadow-sm" style={{ fontStyle: 'italic', opacity: 0.8 }}>
                Wanees is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="quick-questions">
          {quickQuestions.map((q, i) => (
            <button 
              key={i} 
              className="quick-question-btn"
              onClick={() => handleSend(q)}
              disabled={connectionStatus !== "Connected"}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="input-container border-top">
          <input
            type="text"
            className="form-control border-0 bg-light shadow-none"
            placeholder="Write a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={connectionStatus !== "Connected"}
          />
          <button 
            className="btn-send ms-2 shadow-sm" 
            onClick={() => handleSend()}
            disabled={!userInput.trim() || connectionStatus !== "Connected"}
          >
            <span style={{ fontSize: '20px' }}>➤</span>
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setShowImageModal(false)}>×</button>
            <img src={waneesImg} alt="Wanees Large" className="image-modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}
