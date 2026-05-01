// import React from 'react'

// export default function Aichat() {
//   return (
//     <div>Aichat</div>
//   )
// }

// ده من غير تربيط
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Aichat.css";

export default function DoctorCurrentChat() {
  const navigate = useNavigate();

  // تغيير البيانات لتكون قائمة مرضى (Patients) بدلاً من دكاترة
  const [patientChats] = useState([
    {
      id: 1,
      patientId: 501,
      patientName: "Mohamed Ali", // اسم المريض
      patientInitial: "M",
      lastMessage: "Doctor, I finished the medicine you prescribed.",
      time: "11:15 AM",
    },
    {
      id: 2,
      patientId: 502,
      patientName: "Sara Ahmed",
      patientInitial: "S",
      lastMessage: "Can I schedule a follow-up visit?",
      time: "Yesterday",
    }
  ]);

  return (
    <div className="cc-page-container">
      <div className="container">
        {/* تغيير العنوان ليكون منطقي للدكتور */}
        <h4 className="cc-main-title">Chats</h4>

        <div className="cc-list-wrapper">
          {patientChats.map((chat) => (
            <div 
              key={chat.id} 
              className="cc-whatsapp-card" 
                onClick={() => navigate(`/DoctorCC/${chat.id}?pId=${chat.patientId}`)}            >
              <div className="cc-avatar-side">
                {/* الحرف الأول من اسم المريض */}
                <div className="cc-initials-circle">{chat.patientInitial}</div>
              </div>

              <div className="cc-info-side">
                <div className="cc-info-header">
                  <h6 className="cc-doctor-name">{chat.patientName}</h6>
                  <span className="cc-chat-time">{chat.time}</span>
                </div>
                <p className="cc-last-msg">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// //ده بالتربيط 

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getMyChats } from "../../api/chatApi";
// import "./Aichat.css";

// export default function DoctorCurrentChat() {
//   const navigate = useNavigate();
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchChats() {
//       try {
//         const dId = localStorage.getItem("doctorId");
//         if (!dId) {
//           setError("Doctor data not found.");
//           setLoading(false);
//           return;
//         }

//         const res = await getMyChats(dId);
        
//         // منطق الـ 24 ساعة كما هو
//         const cutoff = new Date();
//         cutoff.setHours(cutoff.getHours() - 24);

//         const filteredChats = res.data.map(chat => {
//           const msgDate = new Date(chat.sendAt || chat.time); 
//           if (msgDate < cutoff && !chat.isSaved) {
//             return { ...chat, lastMessage: "No messages in the last 24h", time: "" };
//           }
//           return chat;
//         });

//         setChats(filteredChats);
//       } catch (err) {
//         setError("Failed to load conversations.");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchChats();
//   }, []);

//   return (
//     <div className="cc-page-container">
//       <div className="container">
//         <h4 className="cc-main-title">Chats</h4>
//         <div className="cc-list-wrapper">
//           {loading ? (
//             <p className="text-center mt-4">Loading...</p>
//           ) : (
//             chats.map((chat) => (
//               <div 
//                 key={chat.id} 
//                 className="cc-whatsapp-card" 
//                 onClick={() => navigate(`/DoctorCC/${chat.id}?pId=${chat.patientId}`)}
//               >
//                 <div className="cc-avatar-side">
//                   <div className="cc-initials-circle">
//                     {/* عرض أول حرف من الاسم المستعار */}
//                     {(chat.displayName || "A").charAt(0).toUpperCase()}
//                   </div>
//                 </div>

//                 <div className="cc-info-side">
//                   <div className="cc-info-header">
//                     <h6 className="cc-doctor-name">
//                       {/* عرض الاسم المستعار فقط لجميع المرضى */}
//                       {chat.displayName || "Anonymous Patient"}
//                     </h6>
//                     <span className="cc-chat-time">{chat.time}</span>
//                   </div>
//                   <p className="cc-last-msg">{chat.lastMessage || "No messages yet."}</p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }