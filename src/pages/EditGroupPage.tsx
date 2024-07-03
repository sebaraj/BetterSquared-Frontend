import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGroup, updateGroup } from '../api/groups';
import { Group } from '../interfaces/Group';

const EditGroupPage: React.FC = () => {
  const { group_name } = useParams<{ group_name: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (group_name) {
    const getGroupDetails = async () => {
      try {
        const fetchedGroup = await fetchGroup(group_name);
        setGroup(fetchedGroup);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching group details:', error);
        setLoading(false);
      }
    
    };

    getGroupDetails();
}
  }, [group_name]);

  const handleInputChange = (field: keyof Group, value: any) => {
    if (!group) return;
    const updatedGroup = { ...group, [field]: value };
    setGroup(updatedGroup);
  };

  const handleSave = async () => {
    if (group && group_name) {
      try {
        await updateGroup(group_name, group);
        navigate(`/group/${group_name}`);
      } catch (error) {
        console.error('Failed to update group:', error);
      }
    }
  };
  
  const handleGoBack = () => {
    navigate('/my-groups');
  };

  const today = new Date();
  const endDate = new Date(group?.end_date || today);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Edit {group_name}</h1>
      {group && (
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Starting Cash:</label>
            <input type="number" value={group.starting_cash} disabled={group.is_active} onChange={e => handleInputChange('starting_cash', parseFloat(e.target.value))}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${group.is_active ? 'bg-gray-200' : 'bg-white'}`} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Start Date:</label>
            <input type="date" value={group.start_date} disabled={group.is_active} onChange={e => handleInputChange('start_date', e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${group.is_active ? 'bg-gray-200' : 'bg-white'}`} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">End Date:</label>
            <input type="date" value={group.end_date} disabled={endDate < today} onChange={e => handleInputChange('end_date', e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${endDate < today ? 'bg-gray-200' : 'bg-white'}`} />
          </div>
          
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save Changes
          </button>
        </form>
      )}

        <button className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg" 
        onClick={handleGoBack}>
          Go Back
        </button>
    </div>
  );
};

export default EditGroupPage;