import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from './types';

interface AuthProps {
  onSignIn: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API here
    onSignIn({ id: '1', email });
  };

  return (
<div className="min-h-screen flex">

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex md:w-1/2 bg-gradient-to-r from-primary to-secondary items-center justify-center relative"
      >
          
       


        <div className="text-white text-center">
        <div className="inset-0 flex items-center justify-center opacity-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-40 w-40"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

      </div>
      <div><br></br></div>

        
          <h1 className="text-4xl font-bold mb-4">Welcome to TruthLens</h1>
          <p className="text-xl">Uncover the truth with our advanced fact-checking platform</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-1/2 flex items-center justify-center"
      >
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-4 text-center">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;