/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const user = meQuery.data?.data || null;

  const login = useCallback(async (payload) => {
    await authService.login(payload);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  }, [queryClient]);

  const register = useCallback(async (payload) => {
    await authService.register(payload);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  }, [queryClient]);

  const logout = useCallback(async () => {
    await authService.logout();
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading: meQuery.isPending,
      login,
      register,
      signup: register,
      logout,
    }),
    [user, meQuery.isPending, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
