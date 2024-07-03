import axiosInstance from './axiosInstance';
import axios from 'axios';
import { Group } from '../interfaces/Group';
import { User } from '../interfaces/User';
//import { group } from 'console';

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

  export const fetchGroup = async (group_name: string): Promise<Group> => {
    try {
      const fetchGroupUrl = `/group/${group_name}`;
      const response = await axiosInstance.get(fetchGroupUrl);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data.message || 'Failed to get group';
      } else {
        throw 'Failed to get group';
      }
    }
  }

  export const fetchGroupUsers = async (group_name: string, page: number): Promise<User[]> => {
    try {
      const response = await axiosInstance.get(`/group/${group_name}/users`, { params: { page } });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data.message || 'Failed to get users';
      } else {
        throw 'Failed to get users';
      }
    }
  };

  export const fetchUserGroupDetails = async (group_name: string, username: string) => {
    try {
      const response = await axiosInstance.get(`/group/${group_name}/user/${username}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          throw new Error('Forbidden'); // Handle 403 specifically
        }
        throw new Error(error.response.data.message || 'Failed to get user group details');
      } else {
        throw new Error('Network error');
      }
    }
  };

  export const handleGroupAction = async (group_name: string, action: string): Promise<void> => {
    let endpoint = `/group/${group_name}`;
    if (action === 'delete') {
      await axiosInstance.delete(endpoint);
    } else if (action === 'leave') {
      endpoint += '/leave';
      await axiosInstance.delete(endpoint);
    } else if (action === 'join') {
      endpoint += '/join';
      await axiosInstance.post(endpoint);
    }
  };

  export const searchGroups = async (page: number, name: string) => {
    try {
      const response = await axiosInstance.get(`/groups/search`, {
        params: { page, name }
      });
      return response.data;  // This should return groups based on the search criteria
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response?.data.message || 'Failed to search groups');
      } else {
        throw new Error('Group search error');
      }
    }
  };