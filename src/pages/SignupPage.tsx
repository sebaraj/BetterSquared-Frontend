import React, { useState } from 'react';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignup = async (username: string, email?: string, password?: string) => {
    if (!email || !password) {
      console.error('Email and password are required');
      setErrorMessage('Email and password are required');
      return;
    }

    try {
      const data = await signup(username, email, password);
      console.log('Signup successful:', data);
      navigate('/signup-success');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage('Signup failed. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">better<sup>2</sup>.com</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <AuthForm type="signup" onSubmit={handleSignup} />
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        <div className="flex justify-between mt-4">
          <a href="/login" className="text-blue-500 hover:underline">Login</a>
          <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
