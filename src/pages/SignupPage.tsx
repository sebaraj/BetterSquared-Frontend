import React from 'react';
import { signup } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSignup = async (username: string, email?: string, password?: string) => {
        if (!email || !password) {
        console.error('Email and password are required');
        return;
        }

        try {
            const data = await signup(username, email, password);
            console.log('Signup successful:', data);
            navigate('/signup-success');
          } catch (error) {
            console.error('Signup failed:', error);
            // Handle signup error, e.g., show error message
          }
    };

    return (
        <div className="h-screen flex items-center justify-center">
        <div>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <AuthForm type="signup" onSubmit={handleSignup} />
            <div className="flex justify-between mt-4">
            <a href="/login" className="text-blue-500">Login</a>
            <a href="/forgot-password" className="text-blue-500">Forgot Password?</a>
            </div>
        </div>
        </div>
    );
};

export default SignupPage;
