import axiosInstance from './axiosInstance';
import axios from 'axios';
import { Game } from '../interfaces/Game';

export const fetchGamesByLeague = async (group_name: string, league_name: string, page: number = 0): Promise<Game[]> => {
    try {
      const response = await axiosInstance.get(`/bet/${group_name}/view/${league_name}`, { params: { page } });
      console.log(response.data);
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to fetch games in league');
        }
    }
  };
 