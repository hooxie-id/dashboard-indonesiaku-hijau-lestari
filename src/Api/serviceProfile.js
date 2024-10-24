import axios from 'axios';
import { API_URL } from '../Config/config';

const API = `${API_URL}protected/profile`;

const servicesProfile = {
  getById: async (token, id) => {
    try {
      const response = await axios.get(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  update: async (token, id, data) => {
    try {
      const response = await axios.put(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (token, id, data) => {
    try {
      const response = await axios.put(`${API}/${id}/password`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default servicesProfile;
