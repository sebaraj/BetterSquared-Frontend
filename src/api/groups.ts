import axiosInstance from './axiosInstance';
import axios from 'axios';
import { Group } from '../components/Group';

export const fetchGroups = async (): Promise<Group[]> => {
  try {
    const response = await axiosInstance.get('/groups');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data.message || 'Failed to fetch groups';
    } else {
      throw 'Failed to fetch groups';
    }
  }
};

export const createGroup = async (newGroup: Group): Promise<Group> => {
    try {
      const response = await axiosInstance.post('/group', newGroup);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data.message || 'Failed to create group';
      } else {
        throw 'Failed to create group';
      }
    }
  };