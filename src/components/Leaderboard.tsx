import React, { useEffect, useState } from 'react';
import { User } from '../interfaces/User';
import { Link } from 'react-router-dom';
import { handleRoleChange } from '../api/groups';
import { Switch } from '@headlessui/react';

interface LeaderboardProps {
  users: User[];
  group_name: string;
  showAdminControls: boolean;
  showTitle: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, group_name, showAdminControls, showTitle }) => {
  const [leaderboardUsers, setLeaderboardUsers] = useState<User[]>([]);
  
  useEffect(() => {
    setLeaderboardUsers(users);
  }, [users]);

  const toggleRoleAndUpdateUsers = (username: string, currentRole: string) => {
    const updatedUsers = leaderboardUsers.map(user => {
      if (user.username === username) {
        return {
          ...user,
          group_role: currentRole === 'Group Administrator' ? 'Group Member' : 'Group Administrator'
        };
      }
      return user;
    });
  
    setLeaderboardUsers(updatedUsers); 
  
    handleRoleChange(group_name, username, currentRole)
      .then(success => {
        if (!success) {
          setLeaderboardUsers(users);
        }
      })
      .catch(() => {
        setLeaderboardUsers(users);
      });
  };
  
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-8">
      {showTitle && <h3 className="text-xl font-bold mb-4 text-white text-center">Leaderboard</h3>}
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2">Username</th>
            <th className="py-2">Current Cash</th>
            <th className="py-2">Role</th>
            {showAdminControls && <th className="py-2">Admins</th>} 
          </tr>
        </thead>
        <tbody>
          {leaderboardUsers.map((user, index) => (
            <tr key={index} className="text-center border-b border-gray-700">
              <td className="px-6 py-2">
                <Link to={`/group/${group_name}/user/${user.username}`} className="text-blue-400 hover:text-blue-600">
                  {user.username}
                </Link>
              </td>
              <td className="px-6 py-2">${user.current_cash.toFixed(2)}</td>
              <td className="px-6 py-2">{user.group_role}</td>
              {showAdminControls && user.group_role !== 'Group Creator' && (
                <td className="px-6 py-2">
                  <Switch
                    checked={user.group_role === 'Group Administrator'}
                    onChange={() => toggleRoleAndUpdateUsers(user.username, user.group_role)}
                    className={`${
                      user.group_role === 'Group Administrator' ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex items-center h-6 rounded-full w-11`}
                  >
                    <span
                      className={`${
                        user.group_role === 'Group Administrator' ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full`}
                    />
                  </Switch>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
