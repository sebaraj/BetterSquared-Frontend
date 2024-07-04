import axiosInstance from './axiosInstance';
import axios from 'axios';
import { BetGame, Bet } from '../interfaces/Bet';

export const fetchBets = async (group_name: string, isActive: boolean, page: number = 0): Promise<BetGame[]> => {
    const endpoint = isActive ? `/bet/${group_name}/active` : `/bet/${group_name}/settled`;
    try {
      const response = await axiosInstance.get(endpoint, { params: { page } });
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to fetch active bets')
        }
    }
  };
 