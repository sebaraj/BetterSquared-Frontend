import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { searchGroups } from '../api/groups';
import { Group } from '../interfaces/Group';

const JoinGroupPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await searchGroups(page, searchTerm);
        setGroups(data);
      } catch (err: any) {
        // Check if it's an instance of Error and then set the message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred'); // Fallback error message
        }
      }
    };

    if (searchTerm) {
      fetchGroups();
    }
  }, [page, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
};

const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm) {
      setError("Please enter a search term.");
      return;
    }
    setPage(0);
    navigate(`/join-group?page=${page}&name=${searchTerm}`);
};

const handleGoToMyGroups = () => {
    navigate('/my-groups');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Join a Group</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search by group name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group, index) => (
          <Link key={index} to={`/group/${group.group_name}`} className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-200 border border-gray-300">
            <h2 className="text-xl font-semibold">{group.group_name}</h2>
            <p>{group.start_date}</p>
            <p>{group.end_date}</p>
            <p>{group.starting_cash}</p> 
          </Link>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page => Math.max(page - 1, 1))} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Previous</button>
        <button onClick={() => setPage(page => page + 1)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Next</button>
      </div>
      <button
          className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
          onClick={handleGoToMyGroups}
        >
          My Groups
        </button> 
    </div>
  );
};

export default JoinGroupPage;
