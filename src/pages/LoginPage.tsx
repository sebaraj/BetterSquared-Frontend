import React from 'react';
import { login } from '../api/auth';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  const handleLogin = async (username: string, _email?: string, password?: string) => {
    if (!password) {
      console.error('Password is required');
      return;
    }

    try {
      const data = await login(username, password);
      console.log('Login successful:', data);
      // Handle successful login, e.g., redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error, e.g., show error message
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <AuthForm type="login" onSubmit={handleLogin} />
        <div className="flex justify-between mt-4">
          <a href="/signup" className="text-blue-500">Sign Up</a>
          <a href="/forgot-password" className="text-blue-500">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
