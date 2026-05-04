// import api from "./axiosInstance";


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// export const getMySessions = async () => {
//   const res = await api.get("/Sessions/MySessions");
//   return res.data;
// };
import api from "./axiosInstance";

export const getMySessions = async () => {
  const res = await api.get("/Sessions/MySessions");
  return res.data;
};

// الـ API الجديد الخاص بالدكتور (الإضافة الجديدة)
export const getDoctorSessions = async () => {
  const res = await api.get("/DoctorSessions/MySessions");
  return res.data;
};

export const getDoctorSessions = async () => {
  const res = await API.get("/DoctorSessions/MySessions");
  return res.data;
};

export const joinCall = async (payload) => {
  const res = await API.post("/Call/join", payload);
  return res.data;
};

export const endCall = async (id) => {
  const res = await API.post(`/Call/end/${id}`);
  return res.data;
};


export const updateNotes = async (id, notes) => {
  const res = await API.post(`/DoctorSessions/${id}/Notes`, { notes });
  return res.data;
};