import axios from "axios";
import { saveLoginIdentity } from "./roleApi";
const API = axios.create({
  baseURL: "https://doctorprofile.runasp.net/api",
  headers: { "Content-Type": "application/json" },
});

export const registerUser = (data) => API.post("/Auth/Register", data);

export const loginUser = async (data) => {
  const res = await API.post("/Auth/login", data);
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  saveLoginIdentity(res.data);
  return res;
};