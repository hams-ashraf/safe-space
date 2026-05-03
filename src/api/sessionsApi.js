import axios from "axios";

const API = axios.create({
  baseURL: "http://doctorprofile.runasp.net/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMySessions = async () => {
  const res = await API.get("/Sessions/MySessions");
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