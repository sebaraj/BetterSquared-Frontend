import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGroup, updateGroup } from '../api/groups';
import { Group } from '../interfaces/Group';
import { GetLocalDateTime } from '../utils/Time';
import Loading from '../components/Loading';

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
          const formattedGroup = {
            ...fetchedGroup,
            start_date: GetLocalDateTime(fetchedGroup.start_date),
            end_date: GetLocalDateTime(fetchedGroup.end_date),
          };
          setGroup(formattedGroup);
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
        const updatedGroup = {
          ...group,
          start_date: new Date(group.start_date).toISOString(),
          end_date: new Date(group.end_date).toISOString(),
        };
        await updateGroup(group_name, updatedGroup);
        navigate(`/group/${group_name}`);
      } catch (error) {
        console.error('Failed to update group:', error);
      }
    }
  };

  const handleGoBack = () => {
    navigate(`/group/${group_name}`);
  };

  const today = new Date().toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
  const startDate = group?.start_date ? new Date(group.start_date).toISOString().slice(0, 16) : today;
  const endDate = group?.end_date ? new Date(group.end_date).toISOString().slice(0, 16) : today;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Edit {group_name}</h1>
      {group && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="w-full">
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">Starting Cash:</label>
              <input
                type="number"
                value={group.starting_cash}
                min="0"
                disabled={group.is_active}
                onChange={e => handleInputChange('starting_cash', parseFloat(e.target.value))}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${group.is_active ? 'bg-gray-600 text-gray-400' : 'bg-white text-gray-900'}`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">Start Date:</label>
              <input
                type="datetime-local"
                value={group.start_date}
                min={today}
                disabled={group.is_active}
                onChange={e => handleInputChange('start_date', e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${group.is_active ? 'bg-gray-600 text-gray-400' : 'bg-white text-gray-900'}`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">End Date:</label>
              <input
                type="datetime-local"
                value={group.end_date}
                min={startDate}
                disabled={endDate < today}
                onChange={e => handleInputChange('end_date', e.target.value)}
                className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ${endDate < today ? 'bg-gray-600 text-gray-400' : 'bg-white text-gray-900'}`}
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      <button className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-lg"
        onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default EditGroupPage;
