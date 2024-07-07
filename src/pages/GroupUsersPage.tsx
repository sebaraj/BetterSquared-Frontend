import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchGroupUsers } from '../api/groups';
import Leaderboard from '../components/Leaderboard';
import { User } from '../interfaces/User';
import Loading from '../components/Loading';

const GroupUsersPage: React.FC = () => {
  const { group_name } = useParams<{ group_name: string }>();
  const location = useLocation();
  const showAdminControls = (location.state as { showAdminControls?: boolean })?.showAdminControls ?? false;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (group_name) {
        try {
          const data = await fetchGroupUsers(group_name, page);
          setUsers(data);
        } catch (error) {
          setError((error as Error).message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUsers();
  }, [group_name, page]);

  const goToGroupHomePage = () => {
    navigate(`/group/${group_name}`);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Users in {group_name}</h1>
      <div className="w-full max-w-4xl">
      <Leaderboard 
        users={users} 
        group_name={group_name ? group_name : ""} 
        showAdminControls={showAdminControls} 
        showTitle={false} 
      />
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button onClick={() => setPage(page => Math.max(page - 1, 0))} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">Previous</button>
        <button onClick={() => setPage(page => page + 1)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500">Next</button>
      </div>
      <button className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-lg"
        onClick={goToGroupHomePage}>
        My Groups
      </button>
    </div>
  );
};

export default GroupUsersPage;
