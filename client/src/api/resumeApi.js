import apiClient from "./axios.js";

export const resumeApi = {
  getResumes: async (params = {}) => {
    const response = await apiClient.get("/resumes", { params });
    return response.data;
  },

  getResume: async (id) => {
    const response = await apiClient.get(`/resumes/${id}`);
    return response.data;
  },

  createResume: async (data) => {
    const response = await apiClient.post("/resumes", data);
    return response.data;
  },

  updateResume: async (id, data) => {
    const response = await apiClient.put(`/resumes/${id}`, data);
    return response.data;
  },

  duplicateResume: async (id) => {
    const response = await apiClient.post(`/resumes/${id}/duplicate`);
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  },
};
