import React from 'react';
import { UserGroupDetails } from '../interfaces/UserGroupDetails';

interface UserGroupDetailsProps {
  details: UserGroupDetails;
}

const UserGroupDetailsComponent: React.FC<UserGroupDetailsProps> = ({ details }) => {
  if (!details) return null; // Hide if no details

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow">
      <h3 className="text-lg font-bold">User Details</h3>
      <p>Role: {details.group_role}</p>
      <p>Current Cash: ${details.current_cash.toFixed(2)}</p>
    </div>
  );
};

export default UserGroupDetailsComponent;
