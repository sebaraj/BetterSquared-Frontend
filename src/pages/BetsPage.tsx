import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBets, sellBet } from '../api/bets';
import { BetGame } from '../interfaces/Bet';
import { GetLocalTimeString } from '../utils/Time';
import Loading from '../components/Loading';
import leagueNameMap from '../utils/leagueNameMap';
import { confirmAlert } from 'react-confirm-alert';

interface BetsPageProps {
  isActive: boolean;
}

const BetsPage: React.FC<BetsPageProps> = ({ isActive }) => {
  const navigate = useNavigate();
  const { group_name } = useParams<{ group_name: string }>();
  const [betgames, setBets] = useState<BetGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (group_name) {
      setLoading(true);
      fetchBets(group_name, isActive, page)
        .then(data => {
          setBets(data);
          setLoading(false);
        })
        .catch(error => {
          console.error(`Error fetching ${isActive ? 'active' : 'settled'} bets:`, error);
          setLoading(false);
        });
    }
  }, [group_name, isActive, page]);

  const handleSellBet = (bet_id: number) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h1 className="text-lg text-center font-bold">Warning</h1>
          <p className="mt-4">{`Are you sure you want to sell this bet?`}</p>
          <div className="mt-6 flex justify-around">
            <button
              className="bg-red-500 hover:bg-red-700 text-white px-8 py-2 rounded-lg"
              onClick={() => {
                sellBet(group_name!, bet_id)
                  .then(() => {
                    fetchBets(group_name ? group_name : "", isActive, page).then(setBets);
                  })
                  .catch(error => console.error('Error selling bet:', error));
                onClose();
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-500 hover:bg-gray-400 text-white px-8 py-2 rounded-lg"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      ),
    });
  };

  const handleGoBack = () => {
    navigate(`/group/${group_name}`);
  };

  const getStatusLabel = (bet: BetGame) => {
    if (bet.picked_winner === 'sold') {
      return 'Sold';
    } else if (bet.status === 'settled') {
      return bet.picked_winner === bet.winner ? 'Won' : 'Lost';
    } else {
      return bet.status === 'upcoming' ? 'Upcoming' : bet.status;
    }
  };

  const getStatusColor = (bet: BetGame) => {
    if (bet.picked_winner === 'sold') {
      return 'text-red-500';
    } else if (bet.status === 'upcoming') {
      return 'text-yellow-500';
    } else if (bet.status === 'playing') {
      return 'text-orange-500';
    } else if (bet.status === 'settled') {
      return bet.picked_winner === bet.winner ? 'text-green-500' : 'text-red-500';
    } else {
      return 'text-white';
    }
  };

  const formatOdds = (odds: number) => (odds > 0 ? `+${odds}` : `${odds}`);

  const getStartLabel = (bet: BetGame) => {
    return bet.status === 'upcoming' ? 'Starts' : 'Started';
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">{isActive ? 'Active Bets' : 'Settled Bets'} in {group_name}</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className={`grid ${betgames.length < 2 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
          {betgames.map((bet, index) => (
            <div key={index} className="bg-gray-700 p-4 shadow rounded-lg relative">
              <h2 className="text-lg font-bold mb-4 pt-4">
                {bet.team1} {bet.score1 !== 0 && `(${bet.score1})`} vs. {bet.team2} {bet.score2 !== 0 && `(${bet.score2})`}
              </h2>
              <span className={`absolute top-2 right-2 font-bold py-1 px-3 rounded ${getStatusColor(bet)}`}>
                {getStatusLabel(bet)}
              </span>
              <p><strong>Wagered:</strong> ${bet.wagered.toFixed(2)}</p>
              <p><strong>To Win:</strong> ${bet.amount_to_win.toFixed(2)}</p>
              {bet.picked_winner !== 'sold' && <p><strong>Picked:</strong> {bet.picked_winner}</p> }
              {bet.winner && <p><strong>Winner:</strong> {bet.winner}</p>}
              <p><strong>Placed:</strong> {GetLocalTimeString(bet.time_placed)}</p>
              <p><strong>Odds:</strong> {formatOdds(bet.odds1)} vs. {formatOdds(bet.odds2)}</p>
              {bet.line1 !== 0 && <p><strong>Line 1:</strong> {bet.line1}</p>}
              {bet.line2 !== 0 && <p><strong>Line 2:</strong> {bet.line2}</p>}
              <p><strong>{getStartLabel(bet)}:</strong> {GetLocalTimeString(bet.game_start_time)}</p>
              <p><strong>Last Updated:</strong> {GetLocalTimeString(bet.last_update)}</p>
              <p><strong>League:</strong> {leagueNameMap[bet.league]}</p>
              {isActive && (
                <button
                  onClick={() => handleSellBet(bet.bet_id)}
                  className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Sell
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button onClick={() => setPage(Math.max(0, page - 1))} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded">Previous</button>
        <button onClick={() => setPage(page + 1)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded">Next</button>
      </div>
      <button className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-lg"
        onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default BetsPage;
