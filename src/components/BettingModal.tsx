import React, { useState, useEffect } from 'react';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  odds: number;
}

const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose, onSubmit, odds }) => {
  const [betAmount, setBetAmount] = useState('');
  const [potentialWinnings, setPotentialWinnings] = useState(0);

  useEffect(() => {
    var calculatedWinnings: number = 0;
    if (odds < 0) {
        calculatedWinnings = (parseFloat(betAmount) * 100/(-odds));
    } else {
        calculatedWinnings = (parseFloat(betAmount) * (odds)/100);
    }
    setPotentialWinnings(calculatedWinnings);
  }, [betAmount, odds]);

  const handleBetSubmission = () => {
    const amount = parseFloat(betAmount);
    if (amount > 0) {
      onSubmit(amount);  // Trigger the passed onSubmit function with the entered amount
      setBetAmount('');  // Reset the bet amount after submission
    } else {
      alert("Please enter a valid bet amount.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto">
        <h2 className="font-bold text-lg mb-4">Place Your Bet</h2>
        <div>
          <label htmlFor="betAmount" className="block text-sm font-medium text-gray-700">Bet Amount</label>
          <input
            type="number"
            name="betAmount"
            id="betAmount"
            value={betAmount}
            onChange={e => setBetAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter amount to bet"
          />
        </div>
        <p className="mt-4">Potential Winnings: ${potentialWinnings.toFixed(2)}</p>
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
