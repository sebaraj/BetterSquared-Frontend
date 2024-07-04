export interface Game {
    gameId: number;
    team1: string;
    odds1: number;
    line1: number | null;
    score1: number | null;
    team2: string;
    odds2: number;
    line2: number | null;
    score2: number | null;
    apiId: string;
    lastUpdate: string;
    gameStartTime: string;
    status: string;
    winner: string | null;
    league: string;
}