import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { API_URL } from '../config';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] bg-marine-light/30 border-2 border-marine-light/50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
        <CardDescription className="text-marine-light">
          Fill in your details to create an account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="first_name" className="text-sm font-medium text-white">
              First Name
            </label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="bg-marine-light/20 border-2 border-marine-light/50 text-white placeholder:text-marine-light/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="last_name" className="text-sm font-medium text-white">
              Last Name
            </label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="bg-marine-light/20 border-2 border-marine-light/50 text-white placeholder:text-marine-light/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-marine-light/20 border-2 border-marine-light/50 text-white placeholder:text-marine-light/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-marine-light/20 border-2 border-marine-light/50 text-white placeholder:text-marine-light/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-marine-light/20 border-2 border-marine-light/50 text-white placeholder:text-marine-light/50"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-marine-light hover:bg-marine-light/80 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-white hover:text-white hover:bg-white/20"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 