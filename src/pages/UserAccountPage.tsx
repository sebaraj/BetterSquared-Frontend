import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserGroupDetails, AccountBet } from '../interfaces/UserGroupDetails';
import { fetchUserGroupDetails } from '../api/groups';
import { GetLocalTimeString } from '../utils/Time';
import Loading from '../components/Loading';
import leagueNameMap from '../utils/leagueNameMap';

const UserAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { group_name, username } = useParams<{ group_name: string; username: string }>();
  const [userDetails, setUserDetails] = useState<UserGroupDetails | null>(null);
  const [accountBets, setAccountBets] = useState<AccountBet[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAccountDetails = async () => {
      if (username && group_name) {
        try {
          const userDetailsData = await fetchUserGroupDetails(group_name, username);
          setUserDetails(userDetailsData[0]);
          setAccountBets(userDetailsData.slice(1));
        } catch (err) {
          if ((err as Error).message === 'Forbidden') {
            setUserDetails(null); // Do not display component on 403
          } else {
            setError((err as Error).message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setError('Username or group name is undefined');
        setLoading(false);
      }
    };

    getAccountDetails();
  }, [group_name, username]);

  const handleBackToGroup = (path: string) => {
    navigate(path);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">{username}'s Account in {group_name}</h1>
      {userDetails && (
        <div className="mb-4 p-4 bg-gray-800 shadow rounded-lg w-full max-w-4xl">
          <p className="font-semibold">Role: {userDetails.group_role}</p>
          <p className="font-semibold">Current Cash: ${userDetails.current_cash.toFixed(2)}</p>
        </div>
      )}
      {accountBets && (
        <div className="bg-gray-800 shadow rounded-lg p-6 w-full max-w-4xl">
          <h2 className="text-lg font-bold mb-4 text-center">Bets</h2>
          <div className={`grid ${accountBets.length < 2 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
            {accountBets.map((bet, index) => (
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
            </div>
          ))}
          </div>
        </div>
      )}
      <button
        className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => handleBackToGroup(group_name ? `/group/${group_name}` : "/groups")}
      >
        {`Back to ${group_name ? group_name : 'Groups'}`}
      </button>
    </div>
  );
};

const getStatusLabel = (bet: AccountBet) => {
  if (bet.picked_winner === 'sold') {
    return 'Sold';
  }
  if (bet.status === 'settled') {
    return bet.picked_winner === bet.winner ? 'Won' : 'Lost';
  }
  return bet.status === 'upcoming' ? 'Upcoming' : bet.status;
};

const getStatusColor = (bet: AccountBet) => {
  if (bet.picked_winner === 'sold') {
    return 'text-red-500';
  }
  if (bet.status === 'upcoming') {
    return 'text-yellow-500';
  }
  if (bet.status === 'playing') {
    return 'text-orange-500';
  }
  if (bet.status === 'settled') {
    return bet.picked_winner === bet.winner ? 'text-green-500' : 'text-red-500';
  }
  return 'text-white';
};

const getStartLabel = (bet: AccountBet) => {
  return bet.status === 'upcoming' ? 'Starts' : 'Started';
};

const formatOdds = (odds: number) => (odds > 0 ? `+${odds}` : `${odds}`);

export default UserAccountPage;
