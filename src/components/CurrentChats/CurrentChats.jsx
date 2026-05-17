

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getChatMessages, getDoctorChatMessages } from "../../api/currentchatApi";
import { getDoctorById } from "../../api/doctorsApi"; 
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import "./CurrentChats.css"; 

export default function CurrentChats() {
  const { id } = useParams(); 
  const currentChatId = id;
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const realDocId = queryParams.get("docId"); 

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [headerData, setHeaderData] = useState(null);
  const [connection, setConnection] = useState(null);
  const messagesEndRef = useRef(null);

  let patientId = localStorage.getItem("patientId");
  let doctorId = localStorage.getItem("doctorId"); 

  if (!patientId || !doctorId) {
    try {
      const user = JSON.parse(localStorage.getItem("authUser"));
      if (user && user.id) {
        if (!patientId && userRole === "Patient") patientId = user.id;
        if (!doctorId && userRole === "Doctor") doctorId = user.id;
      }
    } catch(e) {}
  }

  const currentUserId = userRole === "Doctor" ? doctorId : patientId;

  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  
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

  //مسؤاله عن الrealtime اي رساله هتيجي هتظهر في الشات علطول
  useEffect(() => {
    if (connection && currentChatId) {
      connection.start()
        .then(() => {
          connection.invoke("JoinChat", parseInt(currentChatId));

          connection.on("ReceiveMessage", (msg) => {
            setMessages((prev) => {
              const mId = msg.messageId || msg.id;
              if (prev.some(m => (m.id || m.messageId) === mId)) return prev;//الفكره كلها اني بمنع التكرار بشوف المسج اللي جايه دي  لو لقيت في الprev رساله بنفس الid خلاص متخدهاش
              
              return [...prev, {
                id: mId,
                messageText: msg.text || msg.messageText || msg.MessageText,
                senderId: msg.senderId,
                sendAt: msg.sendAt || new Date().toISOString(),
                isSaved: msg.isSaved || false
              }];
            });//اخد كوبي من الرسايل واضيف عليه الجديد
          });
        })
        .catch(err => console.error("Connection Error: ", err));
    }
  }, [connection, currentChatId]);


// ده هيجيب الرسايل القديمه علي حسب انا دكتور ولا بييشنت وانا في انهي شات اصلا ومع مين وكمان بيانات المريض او الدكتور

  useEffect(() => {
    if (!currentChatId) return;
      async function fetchData() {
      try {
          setLoading(true);
          let msgsRes;
          
          if (userRole === "Doctor") {
            msgsRes = await getDoctorChatMessages(currentChatId);
            setHeaderData({ 
              fullName: msgsRes.data.patientName || "Patient Account" 
            });  

            const formatted = (msgsRes.data.messages || []).map(m => ({
              ...m,
              id: m.messageId || m.id,
              messageText: m.text || m.messageText
            }));
            setMessages(formatted);  
          }  
          else {
            msgsRes = await getChatMessages(currentChatId);
            const targetDocId = realDocId || currentChatId;
            const docRes = await getDoctorById(targetDocId); 
            setHeaderData(docRes.data);

            const formatted = (msgsRes.data || []).map(m => ({
              ...m,
              id: m.id || m.messageId,
              messageText: m.messageText || m.text
            }));
            setMessages(formatted);
          }

      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentChatId, userRole, realDocId]);

  const handleSendMessage = async () => {
    if (!text.trim() || !connection) return;
    try {
      await connection.invoke("SendMessage", {
        chatId: parseInt(currentChatId),
        senderId: parseInt(currentUserId),
        MessageText: text.trim()
      });
      setText(""); 
    } catch (err) { console.error("Send error:", err); }
  };

  const handleSaveMessage = async (msgId) => {
    if (!msgId) return;
    const token = localStorage.getItem("token");

    setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, isSaved: !m.isSaved } : m)));
    
    try {
      await axios.post(
        `http://doctorprofile.runasp.net/api/Chat/SaveMessage/${msgId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) { 
      console.error("Save error:", err);
      setMessages(prev => prev.map(m => (m.id === msgId ? { ...m, isSaved: !m.isSaved } : m)));
    }
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  return (
    <div className="chat-page container">
      <div className="chat-box border-0 shadow d-flex flex-column"> 
        
        <div className="chat-header p-3 d-flex align-items-center border-bottom bg-white sticky-top">
          <button className="back-btn-simple" onClick={() => navigate(-1)}><span>‹</span></button>
          {headerData && (
            <div className="d-flex align-items-center ms-2">
              {headerData.imageUrl ? (
                <img 
                  src={`http://doctorprofile.runasp.net${headerData.imageUrl}`} 
                  className="rounded-circle border" 
                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  alt="profile" 
                />
              ) : (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#2E8B6E',    
                    fontSize: '18px',
                    border: '1px solid #ddd'
                  }}
                >
                  {getInitial(headerData.fullName)}
                </div>
              )}
              <div className="ms-3">
                <h6 className="mb-0 doctor-name">{headerData.fullName}</h6>
              </div>
            </div>
          )}
        </div>

        <div className="messages p-4 flex-grow-1" style={{ overflowY: 'auto', backgroundColor: '#f5f7fb' }}>
          {loading ? <div className="text-center mt-5 text-muted">Loading Chat...</div> : 
            messages.map((msg, index) => {
              const isMe = String(msg.senderId) === String(currentUserId);
              return (
                <div key={msg.id || index} className={`d-flex mb-3 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                   <div 
                    className={`msg-bubble shadow-sm ${isMe ? "msg-patient" : "msg-doctor"}`}
                    onDoubleClick={() => userRole !== "Doctor" && handleSaveMessage(msg.id)}
                    style={{ 
                      cursor: userRole === "Doctor" ? "default" : "pointer", 
                      userSelect: "none", 
                      position: 'relative' 
                    }}
                  >
                    <div className="msg-text">{msg.messageText}</div>
                    <div className="d-flex align-items-center justify-content-end mt-1" style={{ fontSize: '10px', opacity: 0.7 }}>
                      <span>{msg.sendAt ? new Date(msg.sendAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
                      {msg.isSaved && <span className="ms-1 text-warning">⭐</span>}
                    </div>
                  </div>
                </div>
              );
            })
          }
          <div ref={messagesEndRef} />
        </div>

        <div className="input-group p-3 bg-white border-top">
          <input 
            type="text" 
            className="form-control border-0 bg-light shadow-none" 
            placeholder="Write a message..."
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
          />
          <button className="btn btn-primary rounded-circle ms-2 shadow-sm" onClick={handleSendMessage} disabled={!text.trim()} style={{ width: '45px', height: '45px' }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

