import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchGroups } from '../api/groups';
import { Group } from '../interfaces/Group';

const MyGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchGroups();
        setGroups(data);
      } catch (error) {
        setErrorMessage('Failed to fetch groups');
      }
    };

    loadGroups();
  }, []);

  const handleGroupClick = (groupName: string) => {
    navigate(`/group/${groupName}`);
  };

  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  const handleJoinGroup = () => {
    navigate('/join-group');
  };

  const handleSignOut = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    navigate('/login');
  };

  // sort by status
  const filteredGroups = [...groups.filter(group => group.is_active), ...groups.filter(group => !group.is_active)];


  return (
    <div className="min-h-screen bg-gray-100 p-4">
        <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mb-4">{sessionStorage.getItem('username')}'s groups</h1>
      <button
          onClick={handleSignOut}
          className="bg-red-500 text-white p-2 rounded shadow hover:bg-red-600"
        >
          Sign Out
        </button>
        </div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16"> {/* Adjusted bottom margin */}
        {filteredGroups.map(group => (
          <div
            key={group.group_name}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-200 border border-gray-300" // Added border for gray outline
            onClick={() => handleGroupClick(group.group_name)}
          >
            <Link to={`/group/${group.group_name}`}></Link>
            <h2 className="text-xl font-semibold">{group.group_name}</h2>
            <p>Current Cash: {group.current_cash ? group.current_cash.toFixed(2) : 0}</p>
            <p>Starting Cash: {group.starting_cash.toFixed(2)}</p>
            <p>Start Date: {new Date(group.start_date).toLocaleDateString()}</p>
            <p>End Date: {new Date(group.end_date).toLocaleDateString()}</p>
            <p>Status: {group.is_active ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4 space-x-4 flex">
        <button
          onClick={handleCreateGroup}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
        >
          Create Group
        </button>
        <button
          onClick={handleJoinGroup}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600"
        >
          Join Group
        </button>
      </div>
    </div>
  );
};

export default MyGroupsPage;