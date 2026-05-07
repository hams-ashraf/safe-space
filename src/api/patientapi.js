import api from "./axiosInstance";

export const getMyProfile = () => api.get("/Patient/MyProfile");

export const updateMyProfile = (data) =>
  api.put("/Patient/UpdateProfile", data);

export const updatePassword = (data) => {
  return api.post("/Patient/UpdatePassword", data);
};