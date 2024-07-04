// src/pages/BetsPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBets, sellBet } from '../api/bets';
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

const handleSellBet = (bet_id: number) => {
  if (window.confirm("Are you sure you want to sell this bet?") && group_name) {
    sellBet(group_name, bet_id)
      .then(() => {
        // Reload the bets to reflect the deletion
        fetchBets(group_name, isActive, page).then(setBets);
      })
      .catch(error => console.error('Error selling bet:', error));
  }
};

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
            {isActive && (
              <button
                onClick={() => handleSellBet(bet.bet_id)}
                className="top-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
              >
                Sell
              </button>
            )}
            <p><strong>Bet ID:</strong> {bet.bet_id}</p>
            <p><strong>Wagered:</strong> ${bet.wagered.toFixed(2)}</p>
            <p><strong>To Win:</strong> ${bet.amount_to_win.toFixed(2)}</p>
            <p><strong>Picked Winner:</strong> {bet.picked_winner}</p>
            <p><strong>Placed:</strong> {new Date(bet.time_placed).toLocaleString()}</p>
            <p><strong>Teams:</strong> {bet.team1} vs {bet.team2}</p>
            <p><strong>Odds:</strong> {bet.odds1.toFixed(2)} vs {bet.odds2.toFixed(2)}</p>
            {bet.line1 !== 0 && <p><strong>Line 1:</strong> {bet.line1}</p>}
            {bet.line2 !== 0 && <p><strong>Line 2:</strong> {bet.line2}</p>}
            {bet.score1 !== 0 && <p><strong>Score 1:</strong> {bet.score1}</p>}
            {bet.score2 !== 0 && <p><strong>Score 2:</strong> {bet.score2}</p>}
            <p><strong>Game Starts:</strong> {new Date(bet.game_start_time).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(bet.last_update).toLocaleString()}</p>
            <p><strong>League:</strong> {bet.league}</p>
            {bet.winner && <p><strong>Winner:</strong> {bet.winner}</p>}
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
