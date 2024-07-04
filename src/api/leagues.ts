import axiosInstance from './axiosInstance';
import axios from 'axios';
import { League } from '../interfaces/League';

export const fetchLeaguesByGroupName = async (group_name: string, page: number = 0): Promise<League[]> => {
  try {
    const response = await axiosInstance.get(`/bet/${group_name}`, { params: { page } });  
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message);
    } else {
        throw new Error('Failed to fetch leagues in group');
    }
}
};
