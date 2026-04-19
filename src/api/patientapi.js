import api from "./axiosInstance";

export const getMyProfile = () => api.get("/Patient/MyProfile");