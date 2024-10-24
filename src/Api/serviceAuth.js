import axios from 'axios';
import { API_URL } from '../Config/config';

const API_LOGIN = `${API_URL}auth/login`;
const API_VERIFY_TOKEN = `${API_URL}auth/verify/token`;
const API_LOGOUT = `${API_URL}protected/logout`;

const servicesAuth = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_LOGIN, {
        email,
        password
      });
      return response;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await axios.get(API_VERIFY_TOKEN, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  logout: async (token) => {
    try {
        const response = await axios.post(API_LOGOUT, null, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
  }
};

export default servicesAuth;
