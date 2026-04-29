import api from "./axiosInstance";

export const getMyChats = (patientId) => api.get(`/Chat/MyChats/${patientId}`);

export const startChatApi = (chatData) => api.post("/Chat/StartChat", chatData);