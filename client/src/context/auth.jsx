import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [bootstrapped, setBootstrapped] = useState(false);

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!bootstrapped && (meQuery.isSuccess || meQuery.isError)) setBootstrapped(true);
  }, [bootstrapped, meQuery.isSuccess, meQuery.isError]);

  const user = meQuery.data?.data || null;

  const login = async (payload) => {
    await authService.login(payload);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  const register = async (payload) => {
    await authService.register(payload);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  const logout = async () => {
    await authService.logout();
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: !bootstrapped || meQuery.isLoading,
      login,
      register,
      logout,
    }),
    [user, bootstrapped, meQuery.isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

