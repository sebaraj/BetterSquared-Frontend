import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGamesByLeague } from '../api/games';
import { Game } from '../interfaces/Game'; // Assuming you have a Game interface defined

const GamesPage: React.FC = () => {
  const { group_name, league_name } = useParams<{ group_name: string, league_name: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  if (group_name && league_name) {
  useEffect(() => {
    setLoading(true);
    fetchGamesByLeague(group_name, league_name, page)
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
        setLoading(false);
      });
  }, [group_name, league_name, page]);
}

  const handleGoBack = () => {
    navigate(`/group/${group_name}/leagues`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Games in {league_name} of {group_name}</h1>
      <ul>
      {games.map((game, index) => (
          <div key={index} className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-lg font-bold">Game {game.gameId} - {game.status}</h2>
            <p><strong>Teams:</strong> {game.team1} vs {game.team2}</p>
            <p><strong>Odds:</strong> {game.odds1} vs {game.odds2}</p>
            {game.line1 !== 0 && <p><strong>Line 1:</strong> {game.line1}</p>}
            {game.line2 !== 0 && <p><strong>Line 2:</strong> {game.line2}</p>}
            <p><strong>Game Start:</strong> {new Date(game.game_start_time).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(game.last_update).toLocaleString()}</p>
            {game.winner && <p><strong>Winner:</strong> {game.winner}</p>}

            </div>
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

export default GamesPage;
