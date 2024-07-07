import React from 'react';
import { UserGroupDetails } from '../interfaces/UserGroupDetails';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { useNavigate } from 'react-router-dom';

interface UserGroupDetailsProps {
  details: UserGroupDetails;
  handleGroupAction: (action: string) => void;
}

const UserGroupDetailsComponent: React.FC<UserGroupDetailsProps> = ({ details, handleGroupAction }) => {
  if (!details) return null;

  const navigate = useNavigate();
  const showConfirmDialog = (action: string, message: string) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white">
          <h1 className="text-lg text-center font-bold">Warning</h1>
          <p className="mt-4">{`Are you sure you want to ${message}?`}</p>
          <div className="mt-6 flex justify-around">
            <button
              className="bg-red-500 hover:bg-red-700 text-white px-8 py-2 rounded-lg"
              onClick={() => {
                handleGroupAction(action);
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

  const goToUsersPage = () => {
    const isAdmin = details.group_role === 'Group Creator';
    navigate(`/group/${details.group_name}/users`, { state: { showAdminControls: isAdmin } });
  };

  const goToEditGroupPage = () => {
    navigate(`/group/edit/${details.group_name}`)
  }

  return (
    <div className="flex flex-col justify-evenly items-center bg-gray-800 p-4 rounded-lg shadow-lg ">
      <h3 className="text-lg font-bold text-white"></h3>
      <div className="flex space-x-8">
        {details.group_role === "Group Creator" && (
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
            onClick={() => showConfirmDialog('delete', 'delete the group')}>Delete Group</button>
        )}
        {details.group_role !== "Group Creator" && details.group_role !== "null" && (
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300"
            onClick={() => showConfirmDialog('leave', 'leave the group')}>Leave Group</button>
        )}
        {details.group_role === "null" && (
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300"
            onClick={() => showConfirmDialog('join', 'join the group')}>Join Group</button>
        )}
        {["Group Creator", "Group Administrator"].includes(details.group_role) && (
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-700 transition-all duration-300"
            onClick={goToEditGroupPage}>Edit Group</button>
        )}
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
          onClick={goToUsersPage}>See All Users</button>
      </div>
    </div>
  );
};

export default UserGroupDetailsComponent;
