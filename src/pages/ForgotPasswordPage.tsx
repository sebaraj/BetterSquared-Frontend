import React, { useState } from 'react';
import { resetPassword } from '../api/auth';
import AuthForm from '../components/AuthForm';

const ForgotPasswordPage: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleForgotPassword = async (username: string) => {
    try {
      const data = await resetPassword(username);
      console.log('Reset password successful:', data);
      setSuccessMessage('Your new password has been sent to your email. Please login.');
      setErrorMessage(null);
    } catch (error) {
      console.error('Reset password failed:', error);
      setErrorMessage('Reset password failed. Please try again.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">better<sup>2</sup>.com</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        <AuthForm type="forgot" onSubmit={handleForgotPassword} />
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 mt-2">{successMessage}</div>
        )}
        <div className="flex justify-between mt-4">
          <a href="/login" className="text-blue-500 hover:underline">Login</a>
          <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
