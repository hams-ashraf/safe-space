import api from "./axiosInstance";

export const generateQuestionApi = (moodValue) => 
  api.post("/SymptomsDetection/GenerateQuestion", { mood: moodValue });
export const analyzeSymptomsApi = (data) => 
  api.post("/SymptomsDetection/Analyze", { 
    mood: data.mood, 
    analyze: data.analyze 
  });