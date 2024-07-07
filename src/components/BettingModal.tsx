import React, { useState, useEffect } from 'react';
import { fetchUserGroupDetails } from '../api/groups';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  odds: number;
  groupName: string;
  username: string;
}

const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose, onSubmit, odds, groupName, username }) => {
  const [betAmount, setBetAmount] = useState('0');
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const userDetails = await fetchUserGroupDetails(groupName, username);
        setBalance(userDetails[0].current_cash);
      } catch (error) {
        console.error('Error fetching user balance:', error);
      }
    };

    fetchBalance();
  }, [groupName, username]);

  useEffect(() => {
    var calculatedWinnings: number = 0;
    if (odds < 0) {
      calculatedWinnings = (parseFloat(betAmount) * 100 / (-odds));
    } else {
      calculatedWinnings = (parseFloat(betAmount) * (odds) / 100);
    }
    setPotentialWinnings(calculatedWinnings);

    if (balance !== null && parseFloat(betAmount) > balance) {
      setWarning("Bet amount exceeds current balance.");
    } else {
      setWarning(null);
    }
  }, [betAmount, odds, balance]);

  const handleBetSubmission = () => {
    const amount = parseFloat(betAmount);
    if (amount > 0 && (balance === null || amount <= balance)) {
      onSubmit(amount);  // Trigger the passed onSubmit function with the entered amount
      setBetAmount('0');  // Reset the bet amount after submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm mx-auto">
        <h2 className="font-bold text-lg mb-4 text-white text-center">Place Bet</h2>
        <div className="text-white text-center mb-4">
          {balance !== null ? `Current Balance: $${balance.toFixed(2)}` : 'Loading balance...'}
        </div>
        <div>
          <label htmlFor="betAmount" className="block text-sm font-medium text-gray-300">Bet Amount</label>
          <input
            type="number"
            name="betAmount"
            id="betAmount"
            value={betAmount}
            min="0"
            onChange={e => setBetAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
            placeholder="Enter amount to bet"
          />
        </div>
        {warning && <p className="text-red-500 mt-2">{warning}</p>}
        <p className="mt-4 text-gray-300">Potential Winnings: ${potentialWinnings.toFixed(2)}</p>
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleBetSubmission}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Bet
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BettingModal;
