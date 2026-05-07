import api from "./axiosInstance";

export const getChatMessages = (chatId) => api.get(`/Chat/Messages/${chatId}`);
export const getDoctorChatMessages = (chatId) => api.get(`/DoctorChat/Messages/${chatId}`);