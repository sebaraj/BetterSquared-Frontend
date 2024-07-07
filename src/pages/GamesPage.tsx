import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGamesByLeague } from '../api/games';
import { Game } from '../interfaces/Game';
import BettingModal from '../components/BettingModal';
import { makeBet } from '../api/bets';
import { Bet } from '../interfaces/Bet';
import { GetLocalTimeString } from '../utils/Time';
import Loading from '../components/Loading';
import leagueNameMap from '../utils/leagueNameMap';

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
  const username = sessionStorage.getItem('username');

  useEffect(() => {
    if (group_name && league_name) {
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
    }
  }, [group_name, league_name, page]);

  const handleBet = (amount: number) => {
    const bet: Bet = {
      game_id: selectedGameId,
      type: 'h2h',
      wagered: amount,
      picked_winner: selectedWinner,
      group_name: group_name || ''
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

  const formatOdds = (odds: number) => (odds > 0 ? `+${odds}` : `${odds}`);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">{leagueNameMap[league_name!]} Games for {group_name}</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
        <div className={`grid ${games.length < 2 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
          {games.map((game) => (
            <div key={game.game_id} className="bg-gray-700 p-4 shadow rounded-lg flex flex-col justify-between h-full">
              <table className="w-full table-fixed border-separate border-spacing-2">
                <tbody>
                  <tr>
                    <td className="text-lg font-bold mb-2 text-left w-4/9">{game.team1}</td>
                    <td className="w-1/9"></td>
                    <td className="text-lg font-bold mb-2 text-right w-4/9">{game.team2}</td>
                  </tr>
                  <tr>
                      <td className="text-left w-4/9">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm w-20"
                          onClick={() => {
                            setSelectedOdds(game.odds1);
                            setSelectedGameId(game.game_id);
                            setSelectedWinner(game.team1);
                            setShowModal(true);
                          }}>
                          {formatOdds(game.odds1)}
                        </button>
                        </td>
                        <td className="text-center w-1/9">
                          Odds
                        </td>
                        <td className='text-right w-4/9'>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm w-20"
                          onClick={() => {
                            setSelectedOdds(game.odds2);
                            setSelectedGameId(game.game_id);
                            setSelectedWinner(game.team2);
                            setShowModal(true);
                          }}>
                          {formatOdds(game.odds2)}
                        </button>
                        </td>
                  </tr>
                  {game.line1 !== 0 && (
                    <tr>
                      <td className="text-left w-4/9">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm w-20"
                          onClick={() => {
                            setSelectedOdds(game.line1 ? game.line1 : 0);
                            setSelectedGameId(game.game_id);
                            setSelectedWinner(game.team1);
                            setShowModal(true);
                          }}>
                          {game.line1}
                        </button>
                      </td>
                      <td className="text-center w-1/9">
                        Line
                      </td>
                      <td className="text-right w-4/9">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm w-20"
                          onClick={() => {
                            setSelectedOdds(game.line2 ? game.line2 : 0);
                            setSelectedGameId(game.game_id);
                            setSelectedWinner(game.team2);
                            setShowModal(true);
                          }}>
                          {game.line2}
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-auto">
                <p><strong>Starts:</strong> {GetLocalTimeString(new Date(game.game_start_time).toLocaleString())}</p>
                <p><strong>Last Updated:</strong> {GetLocalTimeString(new Date(game.last_update).toLocaleString())}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BettingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleBet}
        odds={selectedOdds}
        groupName={group_name ? group_name : ""}
        username={username ? username : ""}
      />
      <div className="flex justify-center mt-4 space-x-4">
        <button onClick={() => setPage(Math.max(0, page - 1))} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded">Previous</button>
        <button onClick={() => setPage(page + 1)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded">Next</button>
      </div>
      <button className="fixed bottom-4 left-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded shadow-lg" 
        onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default GamesPage;
