import React, { useState } from 'react';
import { createGroup } from '../api/groups';
import { Group } from '../interfaces/Group';
import { useNavigate, Link } from 'react-router-dom';
import { GetLocalDateTime } from '../utils/Time';

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [viewGroupLink, setViewGroupLink] = useState<string | null>(null);

  const [group, setGroup] = useState<Group>({
    group_name: '',
    start_date: '',
    end_date: '',
    starting_cash: 0,
  });

  const handleCreateGroup = async () => {
    try {
      setErrorMessage('');
      const groupWithLocalISO = {
        ...group,
        start_date: new Date(group.start_date).toISOString(),
        end_date: new Date(group.end_date).toISOString(),
      };

      const createdGroup = await createGroup(groupWithLocalISO);
      setSuccessMessage('Successfully created group!');
      setViewGroupLink(`/group/${group.group_name}`);
      console.log('Group created successfully:', createdGroup);
    } catch (error) {
      console.error('Failed to create group:', error);
      setErrorMessage('Failed to create group. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/my-groups');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGroup((prevGroup) => ({
      ...prevGroup,
      [name]: value,
    }));
  };

  const today = GetLocalDateTime(new Date().toISOString()).slice(0, 16);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Create Group</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }} className="w-full">
          <div className="mb-4">
            <label htmlFor="group_name" className="block text-white text-sm font-bold mb-2">Group Name</label>
            <input
              type="text"
              id="group_name"
              name="group_name"
              value={group.group_name}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="start_date" className="block text-white text-sm font-bold mb-2">Start Date</label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={group.start_date}
              min={today}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end_date" className="block text-white text-sm font-bold mb-2">End Date</label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={group.end_date}
              min={group.start_date}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="starting_cash" className="block text-white text-sm font-bold mb-2">Starting Cash</label>
            <input
              type="number"
              id="starting_cash"
              name="starting_cash"
              value={group.starting_cash}
              onChange={handleChange}
              required
              min="0"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
            />
          </div>
          <div className="flex justify-center">
            {viewGroupLink ? (
              <Link to={viewGroupLink} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                View Group
              </Link>
            ) : (
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">Create Group</button>
            )}
          </div>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>} 
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
      </div>
      <button
        className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-lg"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default CreateGroupPage;
