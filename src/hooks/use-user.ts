import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  phoneNumber: string;
  about?: string;
  portfolioLink?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useUser() {
  const [state, setState] = useState<UserState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const checkUser = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/profile');
      
      if (response.ok) {
        const data = await response.json();
        setState({
          user: data.user,
          isLoading: false,
          error: null,
        });
      } else if (response.status === 404) {
        // No user found
        setState({
          user: null,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error('Failed to fetch user');
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const refreshUser = () => {
    checkUser();
  };

  return {
    ...state,
    refreshUser,
  };
} 