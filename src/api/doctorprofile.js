import axios from "axios";

const API = axios.create({
  baseURL: "/api", // البروكسي هنا يشتغل
  headers: { "Content-Type": "application/json" },
});

export const getDoctors = () => API.get("/Doctor");
export const getDoctorById = (id) => API.get(`/Doctor/${id}`);