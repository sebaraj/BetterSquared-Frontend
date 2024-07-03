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
      title: 'Confirm to submit',
      message: `Are you sure you want to ${message}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleGroupAction(action)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
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
    <div className="flex flex-row justify-evenly items-center bg-gray-100 p-4 rounded-lg shadow">
      <h3 className="text-lg font-bold"></h3>
      {details.group_role === "Group Creator" && (
        <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          onClick={() => showConfirmDialog('delete', 'delete the group')}>Delete Group</button>
      )}
      {details.group_role !== "Group Creator" && details.group_role !== "null" && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          onClick={() => showConfirmDialog('leave', 'leave the group')}>Leave Group</button>
      )}
      {details.group_role == "null" && (
        <button className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
          onClick={() => showConfirmDialog('join', 'join the group')}>Join Group</button>
      )}
      {["Group Creator", "Group Administrator"].includes(details.group_role) && (
        <button className="bg-yellow-500 text-white px-4 py-2 rounded shadow hover:bg-yellow-600"
          onClick={goToEditGroupPage}>Edit Group</button>
      )}
      <button className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        onClick={goToUsersPage}>See All Users{details.group_role === 'Group Leader' ? '/Make Admin' : ''}
      </button>
    </div>
  );
};

export default UserGroupDetailsComponent;
