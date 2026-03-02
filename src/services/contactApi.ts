import axios from "axios";

// TODO: Replace with your actual Express.js backend URL when deployed
const API_BASE_URL = "http://localhost:5000";

export interface ContactSubmission {
  name: string;
  phone: string;
  contactMethod: string;
  service: string;
  details: string;
}

export const submitContactForm = async (
  data: ContactSubmission,
): Promise<{ success: boolean }> => {
  const response = await axios.post(`${API_BASE_URL}/submitquery`, data);
  return response.data;
};
