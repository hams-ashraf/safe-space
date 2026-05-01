// من غير تربيط 

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./DoctorCurrentChat.css"; 

export default function DoctorChat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { id: 1, messageText: "Hello! How can I help you today?", senderId: 101, sendAt: "2024-05-20T10:00:00Z" },
    { id: 2, messageText: "I have a headache since morning.", senderId: "patient", sendAt: "2024-05-20T10:05:00Z" },
    { id: 3, messageText: "Did you take any painkillers?", senderId: 101, sendAt: "2024-05-20T10:10:00Z" },
  ]);
  
  const [text, setText] = useState("");
  const doctorId = 101; 

  const handleSendMessage = () => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      messageText: text.trim(),
      senderId: doctorId, 
      sendAt: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-page container">
      <div className="chat-box border-0 shadow-sm d-flex flex-column"> 
        <div className="chat-header p-3 d-flex align-items-center border-bottom bg-white sticky-top">
          <button className="back-btn-simple" onClick={() => navigate(-1)}><span>‹</span></button>
          <div className="d-flex align-items-center">
            <div className="cc-initials-circle" style={{width: '40px', height: '40px', fontSize: '1rem', backgroundColor: '#4CAF93'}}>
              M
            </div>
            <div className="ms-3">
              <h6 className="mb-0 doctor-name">Mohamed Ali</h6>
            </div>
          </div>
        </div>

        <div className="messages p-4 flex-grow-1">
          {messages.map((msg) => (
            <div key={msg.id} className={`d-flex mb-3 ${msg.senderId === doctorId ? "justify-content-end" : "justify-content-start"}`}>
              <div 
                className={`msg-bubble shadow-sm ${msg.senderId === doctorId ? "msg-doctor-sender" : "msg-patient-receiver"}`}
                style={{ userSelect: "none" }}
              >
                {msg.messageText}
                <div className="d-flex align-items-center justify-content-end mt-1">
                  <span className="msg-time">
                    {new Date(msg.sendAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-group p-3 bg-white border-top">
          <input 
            type="text" 
            className="form-control chat-input-field" 
            placeholder="Type a message..." 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
          />
          <button className="btn send-btn" onClick={handleSendMessage} disabled={!text.trim()}>
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  );
}

//بالتربيط

// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { getChatMessages } from "../../api/currentchatApi";
// import { getPatientById } from "../../api/patientApi"; 
// import * as signalR from "@microsoft/signalr";
// import "./DoctorCurrentChat.css"; 

// export default function DoctorChat() {
//   const { id: urlChatId } = useParams();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const realPatientId = queryParams.get("pId");

//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [patient, setPatient] = useState(null); 
//   const [connection, setConnection] = useState(null);
//   const [text, setText] = useState("");
//   const messagesEndRef = useRef(null);

//   const doctorId = localStorage.getItem("doctorId");

//   // جلب الرسائل
//   async function fetchMessages() {
//     if (!urlChatId) return;
//     try {
//       const msgsRes = await getChatMessages(urlChatId);
//       const serverMessages = msgsRes.data || [];
//       setMessages(serverMessages); // تبسيط للمثال، يمكنك استخدام منطق الـ sort الخاص بك
//     } catch (err) { console.error(err); }
//   }

//   // إعداد SignalR
//   useEffect(() => {
//     const newConnection = new signalR.HubConnectionBuilder()
//       .withUrl("http://doctorprofile.runasp.net/chatHub")
//       .withAutomaticReconnect()
//       .build();
//     setConnection(newConnection);
//     return () => { if (newConnection) newConnection.stop(); };
//   }, []);

//   useEffect(() => {
//     if (connection && urlChatId) {
//       connection.start().then(() => {
//         connection.invoke("JoinChat", parseInt(urlChatId));
//         connection.on("ReceiveMessage", (msg) => {
//           setMessages((prev) => [...prev, {
//             id: msg.messageId || msg.id,
//             messageText: msg.text || msg.messageText,
//             senderId: msg.senderId,
//             sendAt: msg.sendAt || new Date().toISOString()
//           }]);
//         });
//       });
//     }
//   }, [connection, urlChatId]);

//   useEffect(() => {
//     async function fetchData() {
//       await fetchMessages();
//       if (realPatientId) {
//         const patRes = await getPatientById(realPatientId);
//         setPatient(patRes.data); // البيانات هنا ستحتوي على displayName
//       }
//     }
//     fetchData();
//   }, [urlChatId, realPatientId]);

//   const handleSendMessage = async () => {
//     if (!text.trim() || !connection) return;
//     try {
//       await connection.invoke("SendMessage", {
//         chatId: parseInt(urlChatId),
//         senderId: parseInt(doctorId),
//         MessageText: text.trim()
//       });
//       setText(""); 
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

//   return (
//     <div className="chat-page container">
//       <div className="chat-box d-flex flex-column"> 
//         <div className="chat-header p-3 d-flex align-items-center bg-white sticky-top border-bottom">
//           <button className="back-btn-simple" onClick={() => navigate(-1)}><span>‹</span></button>
//           <div className="d-flex align-items-center">
//             <div className="cc-initials-circle" style={{width: '40px', height: '40px', backgroundColor: '#4CAF93'}}>
//               {(patient?.displayName || "A").charAt(0).toUpperCase()}
//             </div>
//             <div className="ms-3">
//               <h6 className="mb-0 doctor-name">
//                 {/* يظهر دائماً الاسم المستعار فقط */}
//                 {patient?.displayName || "Anonymous Patient"}
//               </h6>
//             </div>
//           </div>
//         </div>

//         <div className="messages p-4 flex-grow-1">
//           {messages.map((msg) => (
//             <div key={msg.id} className={`d-flex mb-3 ${msg.senderId == doctorId ? "justify-content-end" : "justify-content-start"}`}>
//               <div className={`msg-bubble ${msg.senderId == doctorId ? "msg-doctor-sender" : "msg-patient-receiver"}`}>
//                 {msg.messageText}
//                 <div className="msg-time-wrapper text-end mt-1">
//                   <span className="msg-time" style={{fontSize: '0.7rem'}}>
//                     {new Date(msg.sendAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <div className="input-group p-3 border-top">
//           <input 
//             type="text" className="form-control" 
//             placeholder="Type a message..." 
//             value={text} 
//             onChange={(e) => setText(e.target.value)} 
//             onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} 
//           />
//           <button className="btn send-btn" onClick={handleSendMessage}>➤</button>
//         </div>
//       </div>
//     </div>
//   );
// }