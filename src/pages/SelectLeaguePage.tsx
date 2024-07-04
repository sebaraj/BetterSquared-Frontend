// src/pages/LeaguesPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLeaguesByGroupName } from '../api/leagues';
import { League } from '../interfaces/League';

const LeaguesPage: React.FC = () => {
  const { group_name } = useParams<{ group_name: string }>();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  if (group_name) {
  useEffect(() => {
    fetchLeaguesByGroupName(group_name, page)
      .then(data => {
        setLeagues(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leagues:', error);
        setLoading(false);
      });
  }, [group_name]);
  }

  const handleGoBack = () => {
    navigate(`/group/${group_name}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Leagues for {group_name}</h1>
      <ul>
        {leagues.map((league, index) => (
            <li key={index} className="mt-2">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate(`/bet/${group_name}/league/${league.name}`)}
            >
                {league.name} {league.subleagueOf ? `(Subleague of ${league.subleagueOf})` : ''}
            </button>
            </li>
        ))}
        </ul>
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(Math.max(0, page - 1))} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Previous</button>
        <button onClick={() => setPage(page + 1)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Next</button>
      </div>
      <button className="fixed bottom-4 left-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg" 
        onClick={handleGoBack}>
          Go Back
        </button>
    </div>
  );
};

export default LeaguesPage;
