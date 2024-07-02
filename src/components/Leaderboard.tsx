import React from 'react';
import { User } from '../interfaces/User';
import { Link } from 'react-router-dom';

interface LeaderboardProps {
  users: User[];
  group_name: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, group_name }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 mt-4">
      <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Username</th>
            <th className="py-2">Current Cash</th>
            <th className="py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} className="text-center">
              <td className="px-6 py-2">
                <Link to={`/group/${group_name}/user/${user.username}`} className="text-blue-500 hover:text-blue-700">
                  {user.username}
                </Link>
              </td>
              <td className="px-6 py-2">{user.current_cash.toFixed(2)}</td>
              <td className="px-6 py-2">{user.group_role}</td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
