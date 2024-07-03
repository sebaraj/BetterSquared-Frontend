import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchGroupUsers } from '../api/groups';
import Leaderboard from '../components/Leaderboard';
import { User } from '../interfaces/User'; 

const GroupUsersPage: React.FC = () => {
  const { group_name } = useParams<{ group_name: string }>();
  const location = useLocation();
  const showAdminControls = (location.state as { showAdminControls?: boolean })?.showAdminControls ?? false;
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (group_name){
        try {
            const data = await fetchGroupUsers(group_name, page);
            setUsers(data);
        } catch (error) {
            setError((error as Error).message);
        }
        }
    };

    fetchUsers();
  }, [group_name, page]);

  const goToGroupHomePage = () => {
    navigate(`/group/${group_name}`);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Users in {group_name}</h1>
      <Leaderboard users={users} group_name={group_name ? group_name : "" } showAdminControls={showAdminControls} />
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page => Math.max(page - 1, 0))} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Previous</button>
        <button onClick={() => setPage(page => page + 1)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Next</button>
      </div>

      <button className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
          onClick={goToGroupHomePage}>My Groups</button> 
    </div>
  );
};

export default GroupUsersPage;
