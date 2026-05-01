import api from "./axiosInstance";


export const getMySessions = async () => {
  const res = await api.get("/Sessions/MySessions");
  return res.data;
};