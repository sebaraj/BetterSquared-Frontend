import React from 'react';
import { resetPassword } from '../api/auth';
import AuthForm from '../components/AuthForm';

const ForgotPasswordPage: React.FC = () => {
  const handleForgotPassword = async (username: string) => {
    try {
      const data = await resetPassword(username);
      console.log('Reset password successful:', data);
      // Handle successful password reset, e.g., show success message
    } catch (error) {
      console.error('Reset password failed:', error);
      // Handle password reset error, e.g., show error message
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <AuthForm type="forgot" onSubmit={handleForgotPassword} />
        <div className="flex justify-between mt-4">
          <a href="/login" className="text-blue-500">Login</a>
          <a href="/signup" className="text-blue-500">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
