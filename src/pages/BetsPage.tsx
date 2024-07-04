// src/pages/BetsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBets } from '../api/bets';
import { BetGame } from '../interfaces/Bet';

interface BetsPageProps {
  isActive: boolean;  // Determines whether to show active or settled bets
}

const BetsPage: React.FC<BetsPageProps> = ({ isActive }) => {
  const navigate = useNavigate();
  const { group_name } = useParams<{ group_name: string }>();
  const [betgames, setBets] = useState<BetGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  if (group_name) {
  useEffect(() => {
    fetchBets(group_name, isActive, page)
      .then(data => {
        setBets(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching ${isActive ? 'active' : 'settled'} bets:`, error);
        setLoading(false);
      });
  }, [group_name, isActive, page]);
}

const handleGoBack = () => {
    navigate(`/group/${group_name}`);
  };


  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{isActive ? 'Active Bets' : 'Settled Bets'} for {group_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {betgames.map((bet, index) => (
          <div key={index} className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-bold">{bet.type} - {bet.status}</h2>
            <p><strong>Bet ID:</strong> {bet.betId}</p>
            <p><strong>Wagered:</strong> ${bet.wagered.toFixed(2)}</p>
            <p><strong>To Win:</strong> ${bet.amountToWin.toFixed(2)}</p>
            <p><strong>Picked Winner:</strong> {bet.pickedWinner}</p>
            <p><strong>Placed:</strong> {new Date(bet.timePlaced).toLocaleString()}</p>
            <p><strong>Teams:</strong> {bet.team1} vs {bet.team2}</p>
            <p><strong>Odds:</strong> {bet.odds1} - {bet.odds2}</p>
            <p><strong>Scores:</strong> {bet.score1 ?? 'N/A'} - {bet.score2 ?? 'N/A'}</p>
            <p><strong>Game Starts:</strong> {new Date(bet.gameStartTime).toLocaleString()}</p>
            <p><strong>League:</strong> {bet.league}</p>
            {bet.winner && <p><strong>Winner:</strong> {bet.winner}</p>}
            <p><strong>Last Updated:</strong> {new Date(bet.lastUpdate).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(Math.max(0, page - 1))} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Previous</button>
        <button onClick={() => setPage(page + 1)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Next</button>
      </div>
      <button className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg" 
        onClick={handleGoBack}>
          Go Back
        </button>
    </div>
  );
};

export default BetsPage;
