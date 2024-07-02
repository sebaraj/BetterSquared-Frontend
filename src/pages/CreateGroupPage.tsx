import React, { useState } from 'react';
import { createGroup } from '../api/groups';
import { Group } from '../components/Group';
import { useNavigate, Link } from 'react-router-dom';

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(''); // Add error message state
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
      const createdGroup = await createGroup(group);
      setSuccessMessage('Successfully created group!');
      setViewGroupLink(`/group/${group.group_name}`);
      console.log('Group created successfully:', createdGroup);

    } catch (error) {
      console.error('Failed to create group:', error);
      setErrorMessage('Failed to create group. Please try again.'); // Set error message

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create Group</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }}>
          <div className="mb-4">
            <label htmlFor="group_name" className="block text-gray-700 font-bold mb-2">Group Name</label>
            <input type="text" id="group_name" name="group_name" value={group.group_name} onChange={handleChange} required className="border-gray-300 border w-full px-3 py-2 rounded-md focus:outline-none focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="start_date" className="block text-gray-700 font-bold mb-2">Start Date</label>
            <input type="date" id="start_date" name="start_date" value={group.start_date} onChange={handleChange} required className="border-gray-300 border w-full px-3 py-2 rounded-md focus:outline-none focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="end_date" className="block text-gray-700 font-bold mb-2">End Date</label>
            <input type="date" id="end_date" name="end_date" value={group.end_date} onChange={handleChange} required className="border-gray-300 border w-full px-3 py-2 rounded-md focus:outline-none focus:border-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="starting_cash" className="block text-gray-700 font-bold mb-2">Starting Cash</label>
            <input type="number" id="starting_cash" name="starting_cash" value={group.starting_cash} onChange={handleChange} required className="border-gray-300 border w-full px-3 py-2 rounded-md focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex justify-end">
            {viewGroupLink ? (
              <Link to={viewGroupLink} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                View Group
              </Link>
            ) : (
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">Create Group</button>
            )}
          </div>
        </form>
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>} {/* Display error message in red */}
        {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
        <button
          className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default CreateGroupPage;
