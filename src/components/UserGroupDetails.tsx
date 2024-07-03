import React from 'react';
import { UserGroupDetails } from '../interfaces/UserGroupDetails';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS

interface UserGroupDetailsProps {
  details: UserGroupDetails;
  handleGroupAction: (action: string) => void;
}

const UserGroupDetailsComponent: React.FC<UserGroupDetailsProps> = ({ details, handleGroupAction }) => {
  if (!details) return null;

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

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold"></h3>
      {details.group_role === "Group Creator" && (
        <button className="bg-red-500 text-white px-4 py-2 rounded shadow"
          onClick={() => showConfirmDialog('delete', 'delete the group')}>Delete Group</button>
      )}
      {details.group_role !== "Group Creator" && details.group_role !== "null" && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          onClick={() => showConfirmDialog('leave', 'leave the group')}>Leave Group</button>
      )}
      {details.group_role == "null" && (
        <button className="bg-green-500 text-white px-4 py-2 rounded shadow"
          onClick={() => showConfirmDialog('join', 'join the group')}>Join Group</button>
      )}
      {["Group Creator", "Group Administrator"].includes(details.group_role) && (
        <button className="ml-4 bg-yellow-500 text-white px-4 py-2 rounded shadow"
          onClick={() => window.location.href = `/edit-group/${details.group_name}`}>Edit Group</button>
      )}
    </div>
  );
};

export default UserGroupDetailsComponent;
