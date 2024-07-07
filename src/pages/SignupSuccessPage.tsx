import React from 'react';
import { Link } from 'react-router-dom';

const SignupSuccessPage: React.FC = () => {
  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">better<sup>2</sup>.com</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Sign Up Successful</h2>
        <p className="mb-4">You have successfully signed up. Please login with your new credentials.</p>
        <Link to="/login" className="text-blue-500 hover:underline">Go to Login</Link>
      </div>
    </div>
  );
};

export default SignupSuccessPage;
