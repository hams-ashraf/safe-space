import api from "./axiosInstance";

export const getAllDoctors = async () => {
  const res = await api.get("/Admin/GetAllDoctors");
  console.log("DOCTORS API:", res.data);
  return res.data;
};
export const getAllUsers = async () => {
  const res = await api.get("/Admin/GetAllUsers");
   console.log("USERS API:", res.data);
  return res.data;
};
export const addDoctor = async (doctorData) => {
  const res = await api.post("/Admin/AddDoctor", doctorData);
  return res.data;
};
export const updateDoctor = async (id, doctorData) => {
  const res = await api.put(`/Admin/UpdateDoctor/${id}`, doctorData);
  return res.data;
};
export const deleteDoctor = async (id) => {
  return await api.delete(`/Admin/DeleteDoctor/${id}`);
};

export const deleteUser = async (id) => {
  return await api.delete(`/Admin/DeletePatient/${id}`);
};
export const getDashboardStats = async () => {
  const res = await api.get("/Admin/DashboardStats");
  return res.data;
};
export const getDoctorDetails = async (id) => {
  const res = await api.get(`/Admin/GetDoctorDetails/${id}`);
  return res.data;
};