import React from 'react';
import { Link } from 'react-router-dom';

const SignupSuccessPage: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Signup Successful</h2>
        <p className="mb-4">You have successfully signed up. Please login with your new credentials.</p>
        <Link to="/login" className="text-blue-500">Go to Login</Link>
      </div>
    </div>
  );
};

export default SignupSuccessPage;
