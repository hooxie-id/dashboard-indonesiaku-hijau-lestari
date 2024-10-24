import axios from 'axios';
import { API_URL } from '../Config/config';

const API = `${API_URL}protected/member`;

const servicesMember = {
  getAll: async (token) => {
    try {
      const response = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

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

  create: async (token, data) => {
    try {
      const response = await axios.post(API, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  update: async (token, id, data) => {
    try {
      const response = await axios.post(`${API}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  delete: async (token, id) => {
    try {
      const response = await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default servicesMember;
