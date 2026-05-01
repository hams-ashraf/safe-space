
import React, { useEffect, useState, useRef } from "react";
import "./CurrentChats.css"; 
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getChatMessages } from "../../api/currentchatApi";
import { getDoctorById } from "../../api/doctorsApi"; 
import * as signalR from "@microsoft/signalr";
import axios from "axios";

export default function Chat() {
  const { doctorId: urlChatId } = useParams(); 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const realDocId = queryParams.get("docId"); 

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [doctor, setDoctor] = useState(null); 
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);

  const patientId = localStorage.getItem("patientId");

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    return new Date(dateStr);
  };

  async function fetchMessages() {
    if (!urlChatId) return;
    try {
      const msgsRes = await getChatMessages(urlChatId);
      const serverMessages = msgsRes.data || [];

      setMessages((prevMessages) => {
        const serverIds = serverMessages.map(m => m.id);

        const updatedExisting = prevMessages.map(pMsg => {
          const sMsg = serverMessages.find(m => m.id === pMsg.id);
          if (sMsg) return sMsg; 
          if (pMsg.isSaved) return pMsg; 
          return null; 
        }).filter(msg => msg !== null);

        const existingIds = updatedExisting.map(m => m.id);
        const reallyNewMessages = serverMessages.filter(sMsg => !existingIds.includes(sMsg.id));

        const finalMessages = [...updatedExisting, ...reallyNewMessages];

        return finalMessages.sort((a, b) => {
          return parseDate(a.sendAt || a.time).getTime() - parseDate(b.sendAt || b.time).getTime();
        });
      });
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://doctorprofile.runasp.net/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
    return () => { if (newConnection) newConnection.stop(); };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!urlChatId) return;
      try {
        setLoading(true);
        await fetchMessages(); 
        const docRes = await getDoctorById(realDocId || urlChatId); 
        setDoctor(docRes.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    fetchData();
  }, [urlChatId, realDocId]);

  useEffect(() => {
    const interval = setInterval(() => fetchMessages(), 30000); 
    return () => clearInterval(interval); 
  }, [urlChatId]);

  useEffect(() => {
    if (connection && urlChatId) {
      connection.start().then(() => {
        connection.invoke("JoinChat", parseInt(urlChatId));
        connection.on("ReceiveMessage", (msg) => {
          setMessages((prev) => {
            const mId = msg.messageId || msg.id; 
            if (prev.some(m => m.id === mId)) return prev;
            return [...prev, {
              id: mId,
              messageText: msg.text || msg.messageText,
              senderId: msg.senderId,
              sendAt: msg.sendAt || new Date().toISOString(),
              isSaved: msg.isSaved || false
            }];
          });
        });
      });
    }
  }, [connection, urlChatId]);

  // const handleSaveMessage = async (messageId) => {
  //   if (!messageId) return;
  //   try {
  //     setMessages((prev) =>
  //       prev.map((m) => (m.id === messageId ? { ...m, isSaved: true } : m))
  //     );
  //     await axios.post(`http://doctorprofile.runasp.net/api/Chat/SaveMessage/${messageId}`);
  //   } catch (err) {
  //     console.error("Save error:", err);
  //   }
  // };
  const handleSaveMessage = async (messageId) => {
  if (!messageId) return;
  
  setMessages((prev) =>
    prev.map((m) => (m.id === messageId ? { ...m, isSaved: !m.isSaved } : m))
  );

  try {
    await axios.post(`http://doctorprofile.runasp.net/api/Chat/SaveMessage/${messageId}`);
  } catch (err) {
    console.error("Save error:", err);
  }
};



  
  const handleSendMessage = async () => {
    if (!text.trim() || !connection) return;
    try {
      await connection.invoke("SendMessage", {
        chatId: parseInt(urlChatId),
        senderId: parseInt(patientId),
        MessageText: text.trim()
      });
      setText(""); 
    } catch (err) { console.error("Send error:", err); }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="chat-page container">
      <div className="chat-box border-0 shadow-sm d-flex flex-column"> 
        <div className="chat-header p-3 d-flex align-items-center border-bottom bg-white sticky-top">
          <button className="back-btn-simple" onClick={() => navigate(-1)}><span>‹</span></button>
          {doctor && (
            <div className="d-flex align-items-center">
              <img src={`http://doctorprofile.runasp.net${doctor.imageUrl}`} className="rounded-circle border doctor-img" alt="" />
              <div className="ms-3"><h6 className="mb-0 doctor-name">{doctor.fullName}</h6></div>
            </div>
          )}
        </div>

        <div className="messages p-4 flex-grow-1">
          {messages.map((msg) => (
            <div key={msg.id} className={`d-flex mb-3 ${msg.senderId == patientId ? "justify-content-end" : "justify-content-start"}`}>
              <div 
                className={`msg-bubble shadow-sm ${msg.senderId == patientId ? "msg-patient" : "msg-doctor"}`}
                onDoubleClick={() => handleSaveMessage(msg.id)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {msg.messageText || msg.content || msg.text}
                <div className="d-flex align-items-center justify-content-end mt-1">
                  <span className="msg-time me-1">
                    {msg.sendAt ? new Date(msg.sendAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                  </span>
                  {msg.isSaved && <span className="text-warning" style={{fontSize: "0.8rem"}}>⭐</span>}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        
        <div className="input-group">
          <input 
            type="text" 
            className="form-control chat-input-field" 
            placeholder="Type a message..." 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
          />
          <button 
            className="btn send-btn" 
            onClick={handleSendMessage} 
            disabled={!text.trim()}
          >
            <span style={{ fontSize: '1.2rem', marginLeft: '2px' }}>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}