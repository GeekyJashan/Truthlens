import { useState } from 'react';
import { User } from './types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (userData: User) => {
    // In a real app, you would call an API and store the token
    setUser(userData);
  };

  const signOut = () => {
    // In a real app, you would call an API to invalidate the token
    setUser(null);
  };

  return { user, signIn, signOut };
};