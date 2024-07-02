import axios from 'axios';
import axiosInstance from './axiosInstance';

export const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post(`/login`, { username, password });
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
        const response = await axiosInstance.post(`/signup`, { username, email, password });
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
    const response = await axiosInstance.post(`/reset-password`, { username });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.message || 'Reset password failed';
    } else {
      throw 'Reset password failed';
    }
  }
};
