import api from "./axiosInstance";

export const getDoctors = async () => {
  return await api.get("/Doctor");
};
export const getDoctorById = async (id) => {
  return await api.get(`/Doctor/${id}`);
};
export const getDoctorReviews = async (doctorId) => {
  const res = await fetch(`http://localhost:3000/reviews?doctorId=${doctorId}`);
  const data = await res.json();
  return data;
};