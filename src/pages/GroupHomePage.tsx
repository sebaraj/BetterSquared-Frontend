// GroupHomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchGroup, fetchGroupUsers, fetchUserGroupDetails } from '../api/groups'; 
import { Group } from '../interfaces/Group'; 
import { User } from '../interfaces/User'; 
import { UserGroupDetails } from '../interfaces/UserGroupDetails';
import Leaderboard from '../components/Leaderboard'; 
import UserGroupDetailsComponent from '../components/UserGroupDetails';


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
          setUsers(fetchedUsers.slice(0,10));
          if (username) {
            try {
              const userDetailsData = await fetchUserGroupDetails(group_name, username);
              setUserDetails(userDetailsData[0]); // Assuming the first element is user details
            } catch (err) {
              if ((err as Error).message === 'Forbidden') {
                setUserDetails(null); // Do not display component on 403
              } else {
                setError((err as Error).message);
              }
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
    console.log(group_name);
    getGroupDetails();
  }, [group_name, username]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleGoToMyGroups = () => {
    navigate('/my-groups');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {group && (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">{group.group_name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">Starting Cash</p>
              <p className="text-lg">${group.starting_cash.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">Start Date</p>
              <p className="text-lg">{new Date(group.start_date).toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">End Date</p>
              <p className="text-lg">{new Date(group.end_date).toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">Created At</p>
              <p className="text-lg">{group.created_at ? new Date(group.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold">Is Active</p>
              <p className="text-lg">{group.is_active ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
        </div>
    
      )}
      <div >
      {userDetails && <UserGroupDetailsComponent details={userDetails} />}

      <Leaderboard users={users} group_name={group_name ? group_name : ""}/>
      </div>
      


        <button
          className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
          onClick={handleGoToMyGroups}
        >
          My Groups
        </button> 
    </div>
  );
};

export default GroupHomePage;
