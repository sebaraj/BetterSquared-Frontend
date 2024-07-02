import React, { useState, useEffect } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      navigate('/my-groups');
    }
  }, [navigate]);

  const handleLogin = async (username: string, _email?: string, password?: string) => {
    if (!password) {
      console.error('Password is required');
      setErrorMessage('Password is required');
      return;
    }

    try {
      const data = await login(username, password);
      console.log('Login successful:', data);

      // Store the JWT token in sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('username', username);

      navigate('/my-groups');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
      // Handle login error, e.g., show error message
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <AuthForm type="login" onSubmit={handleLogin} />
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        <div className="flex justify-between mt-4">
          <a href="/signup" className="text-blue-500">Sign Up</a>
          <a href="/forgot-password" className="text-blue-500">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
