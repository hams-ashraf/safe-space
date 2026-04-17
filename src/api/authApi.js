import axios from "axios";

const API = axios.create({
  baseURL: "http://doctorprofile.runasp.net/api",
  headers: { "Content-Type": "application/json" },
});

export const registerUser = (data) => API.post("/Auth/Register", data);
export const loginUser = (data) => API.post("/Auth/login", data);



