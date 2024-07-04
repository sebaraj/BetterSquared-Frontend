export interface Game {
    game_id: number;
    team1: string;
    odds1: number;
    line1: number | null;
    score1: number | null;
    team2: string;
    odds2: number;
    line2: number | null;
    score2: number | null;
    apiId: string;
    last_update: string;
    game_start_time: string;
    status: string;
    winner: string | null;
    league: string;
}