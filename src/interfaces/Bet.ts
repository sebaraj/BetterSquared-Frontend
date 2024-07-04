export interface BetGame {
    bet_id: number;
    type: string;
    group_name: string;
    username: string;
    wagered: number;
    amount_to_win: number;
    picked_winner: string;
    time_placed: string;
    been_distributed: boolean;
    is_parlay: boolean;
    game_id: number;
    team1: string;
    odds1: number;
    line1: number | null;
    score1: number | null;
    team2: string;
    odds2: number;
    line2: number | null;
    score2: number | null;
    last_update: string;
    game_start_time: string;
    status: string;
    winner: string | null;
    league: string;
}

export interface Bet {
    game_id: number,
    type: string;
    group_name?: string;
    username?: string;
    wagered: number;
    amount_to_win?: number;
    picked_winner: string;
    time_placed?: string;
    been_distributed?: boolean;
    is_paylay?: boolean;
}
  
  