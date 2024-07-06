import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGamesByLeague } from '../api/games';
import { Game } from '../interfaces/Game';
import BettingModal from '../components/BettingModal';
import { makeBet } from '../api/bets';
import { Bet } from '../interfaces/Bet'
import { GetLocalTimeString } from '../interfaces/Time';


const GamesPage: React.FC = () => {
  const { group_name, league_name } = useParams<{ group_name: string, league_name: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedOdds, setSelectedOdds] = useState<number>(0);
  const [selectedGameId, setSelectedGameId] = useState<number>(0);
  const [selectedWinner, setSelectedWinner] = useState<string>('');
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

const handleBet = (amount: number) => {
  const bet: Bet = {
    game_id: selectedGameId,
    type: 'h2h',
    wagered: amount,
    picked_winner: selectedWinner,
    group_name: group_name 
  };
  console.log(bet);
  makeBet(bet)
    .then(() => {
      navigate(`/group/${group_name}`);
    })
    .catch(error => {
      console.error('Error placing bet:', error);
    });
};


  const handleGoBack = () => {
    navigate(`/group/${group_name}/leagues`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Games in {league_name} of {group_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <div key={game.game_id} className="bg-white p-4 shadow rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{game.team1}</h2>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm mt-1"
                  onClick={() => {
                    setSelectedOdds(game.odds1);
                    setSelectedGameId(game.game_id);
                    setSelectedWinner(game.team1);
                    setShowModal(true);
                  }}>
                  Odds: {game.odds1}
                </button>
                {game.line1 !== 0 && (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm mt-1"
                    onClick={() => {
                      setSelectedOdds(game.line1 ? game.line1 : 0);
                      console.log(game.game_id)
                      setSelectedGameId(game.game_id);
                      setSelectedWinner(game.team1);
                      setShowModal(true);
                    }}>
                    Line: {game.line1}
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold">{game.team2}</h2>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm mt-1"
                  onClick={() => {
                    setSelectedOdds(game.odds2);
                    setSelectedGameId(game.game_id);
                    setSelectedWinner(game.team2);
                    setShowModal(true);
                  }}>
                  Odds: {game.odds2}
                </button>
                {game.line2 !== 0 && (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm mt-1"
                    onClick={() => {
                      setSelectedOdds(game.line2 ? game.line2 : 0);
                      setSelectedGameId(game.game_id);
                      setSelectedWinner(game.team2);
                      setShowModal(true);
                    }}>
                    Line: {game.line2}
                  </button>
                )}
              </div>
            </div>
            <p><strong>Game Start:</strong> {GetLocalTimeString(new Date(game.game_start_time).toLocaleString())}</p>
            <p><strong>Last Updated:</strong> {GetLocalTimeString(new Date(game.last_update).toLocaleString())}</p>
              
          </div>
          
        ))}
      </div>
      <BettingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleBet}
        odds={selectedOdds}
      />
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
