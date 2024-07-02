import { group } from 'console';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UserAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { group_name, username } = useParams<{ group_name: string; username: string }>();

  const handleBackToGroup = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">{username}'s Account in {group_name}</h1>
      {/* Fetch and display user details */}

    
      <button
          className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
          onClick={() => handleBackToGroup(group_name ? `/group/${group_name}` : "/groups")}
        >
          {`Back to ${group_name ? group_name : 'Groups'}`}
        </button> 
    </div>
  );
};

export default UserAccountPage;
