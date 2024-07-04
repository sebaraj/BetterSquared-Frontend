export interface BetGame {
    betId: number;
    type: string;
    groupName: string;
    username: string;
    wagered: number;
    amountToWin: number;
    pickedWinner: string;
    timePlaced: string;
    beenDistributed: boolean;
    isParlay: boolean;
    team1: string;
    odds1: number;
    line1: number | null;
    score1: number | null;
    team2: string;
    odds2: number;
    line2: number | null;
    score2: number | null;
    lastUpdate: string;
    gameStartTime: string;
    status: string;
    winner: string | null;
    league: string;
}

export interface Bet {
    gameId: number,
    type: string;
    groupName?: string;
    username?: string;
    wagered: number;
    amountToWin?: number;
    pickedWinner: string;
    timePlaced?: string;
    beenDistributed?: boolean;
    isParlay?: boolean;
}
  
  