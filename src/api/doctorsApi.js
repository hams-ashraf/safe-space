import api from "./axiosInstance";

export const getDoctors = async () => {
  return await api.get("/Doctor");
};
export const getDoctorById = async (id) => {
  return await api.get(`/Doctor/${id}`);
};