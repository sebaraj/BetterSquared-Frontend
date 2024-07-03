import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserGroupDetails, AccountBet } from '../interfaces/UserGroupDetails';
import { fetchUserGroupDetails } from '../api/groups';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{username}'s Account in {group_name}</h1>
      {userDetails && (
        <div className="mb-4 p-4 bg-white shadow rounded">
          <p className="font-semibold">Role: {userDetails.group_role}</p>
          <p className="font-semibold">Current Cash: ${userDetails.current_cash.toFixed(2)}</p>
        </div>
      )}
      {accountBets && (
          <div className="bg-white shadow rounded p-4 mb-4">
            <h2 className="text-lg font-bold mb-4">Bets</h2>
            {accountBets.map((bet, index) => (
              <div key={index} className="bg-gray-100 p-2 my-2 rounded border">
                <p>Type: {bet.type}</p>
                <p>Wagered: ${bet.wagered.toFixed(2)}</p>
                <p>Amount to Win: ${bet.amount_to_win.toFixed(2)}</p>
                <p>Picked Winner: {bet.picked_winner}</p>
                <p>Time Placed: {bet.time_placed}</p>
                <p>Been Distributed: {bet.been_distributed ? 'Yes' : 'No'}</p>
                <p>Is Parlay: {bet.is_parlay ? 'Yes' : 'No'}</p>
                <p>Team 1: {bet.team1} - Odds: {bet.odds1}, Line: {bet.line1}</p>
                <p>Team 2: {bet.team2} - Odds: {bet.odds2}, Line: {bet.line2}</p>
                <p>Last Update: {bet.last_update}</p>
                <p>Game Start Time: {bet.game_start_time}</p>
                <p>Status: {bet.status}</p>
                <p>League: {bet.league}</p>
                {bet.winner && <p>Winner: {bet.winner}</p>}
              </div>
            ))}
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

export default UserAccountPage;
