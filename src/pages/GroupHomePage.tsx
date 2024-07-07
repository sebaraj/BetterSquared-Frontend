import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGroup, fetchGroupUsers, fetchUserGroupDetails, handleGroupAction } from '../api/groups';
import { Group } from '../interfaces/Group';
import { User } from '../interfaces/User';
import { UserGroupDetails } from '../interfaces/UserGroupDetails';
import Leaderboard from '../components/Leaderboard';
import UserGroupDetailsComponent from '../components/UserGroupDetails';
import { GetLocalTimeString } from '../utils/Time';
import { getStatusColor, getDateLabel } from '../utils/Time';
import Loading from '../components/Loading';

interface RouteParams extends Record<string, string | undefined> {
  group_name: string;
}

const GroupHomePage: React.FC = () => {
  const { group_name } = useParams<RouteParams>();
  const [group, setGroup] = useState<Group | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userDetails, setUserDetails] = useState<UserGroupDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    const getGroupDetails = async () => {
      if (group_name) {
        try {
          const fetchedGroup = await fetchGroup(group_name);
          setGroup(fetchedGroup);
          const fetchedUsers = await fetchGroupUsers(group_name, 0);
          setUsers(fetchedUsers.slice(0, 10));
          if (username) {
            try {
              const userDetailsData = await fetchUserGroupDetails(group_name, username);
              setUserDetails(userDetailsData[0]); // Assuming the first element is user details
            } catch (err) {
              setUserDetails({
                username: username,
                group_name: group_name,
                group_role: "null",
                current_cash: 0
              });
            }
          }
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('Group name is undefined');
        setLoading(false);
      }
    };
    getGroupDetails();
  }, [group_name, username]);

  const confirmAction = (actionType: string) => {
    if (group_name) {
      handleGroupAction(group_name, actionType)
        .then(() => {
          if (actionType === 'delete' || actionType === 'leave') {
            navigate('/my-groups');
          } else {
            window.location.reload();
          }
        })
        .catch(error => {
          console.error('Error handling group action:', error);
          setError('Failed to perform action');  // Show error message to the user
        });
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const today = new Date();
  const startDate = new Date(group?.start_date || today);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      {group && (
        <div className="relative bg-gray-800 shadow-lg rounded-lg p-8 mb-4 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">{group.group_name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-lg space-y-2">
              <p>{getDateLabel(new Date(group.start_date), true)}</p>
              <p>{getDateLabel(new Date(group.end_date), false)}</p>
              <p>Created: {group.created_at ? GetLocalTimeString(new Date(group.created_at).toLocaleString()) : 'N/A'}</p>
            </div>
            <div className="text-lg text-right space-y-2">
              {userDetails && userDetails.group_role !== "null" && (
                <>
                  <p>Role: {userDetails.group_role.charAt(0).toUpperCase() + userDetails.group_role.slice(1)}</p>
                  <p>Current Cash: ${userDetails.current_cash.toFixed(2)}</p>
                </>
              )}
            </div>
            <span className={`absolute top-4 right-4 text-lg font-bold ${getStatusColor(group)}`}>
              {group.is_active ? 'Active' : (new Date(group.start_date) > new Date() ? 'Upcoming' : 'Inactive')}
            </span>
          </div>
        </div>
      )}
      <div className="w-full max-w-4xl">
        {userDetails && <UserGroupDetailsComponent details={userDetails} handleGroupAction={confirmAction} />}
      </div>
      <div className="w-full max-w-4xl mt-4">
        <Leaderboard users={users} group_name={group_name ? group_name : ""} showAdminControls={false} showTitle={true}/>
      </div>
      <div className="fixed bottom-4 right-4 flex space-x-4">
        {group && group.is_active && (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => handleNavigate(`/group/${group_name}/active`)}
            >
              Active Bets
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => handleNavigate(`/group/${group_name}/leagues`)}
            >
              Place Bet
            </button>
          </>
        )}
        {group && startDate <= today && (
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => handleNavigate(`/group/${group_name}/settled`)}
          >
            Settled Bets
          </button>
        )}
      </div>
      <button
        className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-500 text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
        onClick={() => handleNavigate('/my-groups')}
      >
        My Groups
      </button>
    </div>
  );
};

export default GroupHomePage;
