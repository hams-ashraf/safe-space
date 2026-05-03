// import api from "./axiosInstance";


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