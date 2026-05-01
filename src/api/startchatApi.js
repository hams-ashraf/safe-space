import api from "./axiosInstance";

export const startNewChat = (chatData) => api.post("/Chat/StartChat", chatData);