import axios from 'axios';

const API_URL = 'http://localhost';

export const login = async (username: string, password: string) => {
    console.log("Sending login request with:", { username, password }); // Log the payload
    try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.message || 'Login failed';
    } else {
      throw 'Login failed';
    }
  }
};

export const signup = async (username: string, email: string, password: string) => {
    console.log("Sending signup request with:", { username, email, password }); // Log the payload
    try {
    const response = await axios.post(`http://localhost/signup`, { username, email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.message || 'Signup failed';
    } else {
      throw 'Signup failed';
    }
  }
};

export const resetPassword = async (username: string) => {
  try {
    const response = await axios.post(`/reset-password`, { username });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.message || 'Reset password failed';
    } else {
      throw 'Reset password failed';
    }
  }
};
