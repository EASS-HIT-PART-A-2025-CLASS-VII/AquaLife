import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';

export function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasNavigated = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasNavigated.current) return;
      try {
        const code = searchParams.get('code');
        const data = searchParams.get('data');
        
        if (data) {
          // If we have data, parse it and store it
          const parsedData = JSON.parse(decodeURIComponent(data));
          console.log('Received data:', data);
          console.log('Storing token and user data...');
          console.time('login');
          login(parsedData.access_token, parsedData.user);
          console.timeEnd('login');
          console.log('Redirecting to dashboard...');
          hasNavigated.current = true;
          navigate('/dashboard', { replace: true });
          return;
        }

        if (!code) {
          throw new Error('No code received from Google');
        }

        console.log('Making request to backend with code...');
        const response = await fetch(`${API_URL}/auth/google/callback?code=${code}`);
        const responseData = await response.json();
        console.log('Received response from backend:', responseData);

        if (!response.ok) {
          throw new Error(responseData.detail || 'Failed to authenticate with Google');
        }

        console.log('Storing token and user data...');
        // Store the token and user data
        login(responseData.access_token, responseData.user);
        console.log('Redirecting to dashboard...');
        hasNavigated.current = true;
        navigate('/dashboard', { replace: true });
      } catch (error) {
        if (!hasNavigated.current) {
          hasNavigated.current = true;
          console.error('Google callback error:', error);
          navigate('/login', { replace: true });
        }
      }
    };

    handleCallback();
    // eslint-disable-next-line
  }, [searchParams, login, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-marine-dark">
      <div className="text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Completing Google Sign In...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
} 