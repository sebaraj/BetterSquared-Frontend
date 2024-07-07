import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchGroups } from '../api/groups';
import { Group } from '../interfaces/Group';
import { getStatusColor, getDateLabel } from '../utils/Time';
import Loading from '../components/Loading';

const MyGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchGroups();
        setGroups(data);
      } catch (error) {
        setErrorMessage('Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  if (loading) return <Loading />;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  const filteredGroups = [
    ...groups.filter(group => group.is_active),
    ...groups.filter(group => !group.is_active)
  ];


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col">
      <header className="relative mb-6">
        <h1 className="text-3xl font-bold text-center w-full uppercase">
          {sessionStorage.getItem('username')}'s Groups
        </h1>
        <button
          onClick={handleSignOut}
          className="absolute right-0 top-0 bg-red-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
        >
          Sign Out
        </button>
      </header>
      {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {filteredGroups.map(group => (
          <div
            key={group.group_name}
            className="relative bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-all duration-300 border border-gray-700"
            onClick={() => handleNavigate(`/group/${group.group_name}`)}
          >
            <Link to={`/group/${group.group_name}`} />
            <h2 className="text-2xl font-semibold mb-4">{group.group_name}</h2>
            <div className="space-y-2">
              <p className="text-lg">Current Cash: ${group.current_cash ? group.current_cash.toFixed(2) : '0.00'}</p>
              <p className="text-lg">Starting Cash: ${group.starting_cash.toFixed(2)}</p>
              <p className="text-lg">{getDateLabel(new Date(group.start_date), true)}</p>
              <p className="text-lg">{getDateLabel(new Date(group.end_date), false)}</p>
            </div>
            <span className={`absolute top-4 right-4 text-lg font-bold ${getStatusColor(group)}`}>
              {group.is_active ? 'Active' : (new Date(group.start_date) > new Date() ? 'Upcoming' : 'Inactive')}
            </span>
          </div>
        ))}
      </div>
      <div className="fixed bottom-4 right-4 flex space-x-4">
        <button
          onClick={() => handleNavigate('/create-group')}
          className="bg-blue-500 text-white py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
        >
          Create Group
        </button>
        <button
          onClick={() => handleNavigate('/join-group')}
          className="bg-green-500 text-white py-4 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300"
        >
          Join Group
        </button>
      </div>
    </div>
  );
};

export default MyGroupsPage;
