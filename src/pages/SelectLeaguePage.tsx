import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLeaguesByGroupName } from '../api/leagues';
import { League } from '../interfaces/League';
import Loading from '../components/Loading';
import leagueNameMap from '../utils/leagueNameMap';

const LeaguesPage: React.FC = () => {
  const { group_name } = useParams<{ group_name: string }>();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (group_name) {
      fetchLeaguesByGroupName(group_name, page)
        .then(data => {
          setLeagues(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching leagues:', error);
          setLoading(false);
        });
    }
  }, [group_name, page]);

  const handleGoBack = () => {
    navigate(`/group/${group_name}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Leagues for {group_name}</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-xl">
        <ul>
          {leagues.map((league, index) => (
            <li key={index} className="mt-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-center text-white font-bold py-2 px-4 rounded w-full text-left"
                onClick={() => navigate(`/bet/${group_name}/league/${league.name}`)}
              >
                {leagueNameMap[league.name]} {league.subleagueOf ? `(Subleague of ${league.subleagueOf})` : ''}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
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

export default LeaguesPage;
