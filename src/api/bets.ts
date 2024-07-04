import axiosInstance from './axiosInstance';
import axios from 'axios';
import { BetGame, Bet } from '../interfaces/Bet';

export const fetchBets = async (group_name: string, isActive: boolean, page: number = 0): Promise<BetGame[]> => {
    const endpoint = isActive ? `/bet/${group_name}/active` : `/bet/${group_name}/settled`;
    try {
      const response = await axiosInstance.get(endpoint, { params: { page } });
      console.log(response.data);
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to fetch active bets');
        }
    }
  };

  export const makeBet = async (bet: Bet) => {
    const { game_id, type, wagered, picked_winner, group_name } = bet;
    try {
      const response = await axiosInstance.post(`/bet/${group_name}/buy`, {
        game_id,
        type,
        wagered,
        picked_winner
      });
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to make bet');
        }
    }
  };

  export const sellBet = async (group_name: string, bet_id: number) => {
    try {
      const response = await axiosInstance.put(`/bet/${group_name}/sell`,{ bet_id } );
      return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Failed to sell bet');
        }
    }
  };