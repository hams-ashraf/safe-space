import api from "./axiosInstance";

export const getMySessions = async () => {
  const res = await api.get("/Sessions/MySessions");
  return res.data;
};

export const getDoctorSessions = async () => {
  const res = await api.get("/DoctorSessions/MySessions");
  return res.data;
};

export const joinCall = async (payload) => {
  const res = await api.post("/Call/join", payload);
  return res.data;
};

export const endCall = async (id) => {
  const res = await api.post(`/Call/end/${id}`);
  return res.data;
};

export const updateNotes = async (id, notes) => {
  const res = await api.post(`/DoctorSessions/${id}/Notes`, { notes });
  return res.data;
};

export const canJoinSession = (session) => {
  const sessionDateStr = session.date || session.Date;
  const sessionTimeStr = session.time || session.Time || "";
  
  if (!sessionDateStr || !sessionTimeStr) return true;
  
  let sessionDate = new Date(sessionDateStr);
  const timeMatch = sessionTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3]?.toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    sessionDate.setHours(hours, minutes, 0, 0);
    
    // Shift late-night sessions to next day if needed
    if (hours >= 0 && hours <= 4) {
      sessionDate.setDate(sessionDate.getDate() + 1);
    }
    
    const now = new Date();
    const diffInMinutes = (sessionDate - now) / (1000 * 60);
    
    if (diffInMinutes > 15) {
      return false;
    }
  }
  return true;
};