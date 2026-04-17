import api from "./axiosInstance";

export const getDoctors = async () => {
  return await api.get("/Doctor");
};
