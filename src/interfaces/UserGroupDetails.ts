export interface UserGroupDetails {
    username: string;
    group_name: string;
    group_role: string;
    current_cash: number;
}
  
export interface AccountBet {
    type: string;
    wagered: number;
    amount_to_win: number;
    picked_winner: string;
    time_placed: string;
    been_distributed: boolean;
    is_parlay: boolean;
    team1: string;
    odds1: number;
    line1?: number;
    score1?: number;
    team2: string;
    odds2: number;
    line2?: number;
    score2?: number;
    last_update: string;
    game_start_time: string;
    status: string;
    winner?: string;
    league: string;
}