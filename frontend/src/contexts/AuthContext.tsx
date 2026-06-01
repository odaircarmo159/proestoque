import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { api, getApiErrorMessage, setAuthToken, setUnauthorizedHandler } from '@/src/services/api';

export type User = {
  id: string;
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  registrar: (nome: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AUTH_TOKEN_KEY = '@proestoque:token';
const AUTH_USER_KEY = '@proestoque:user';
const MIN_SPLASH_TIME_MS = 1500;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function persistSession(nextToken: string, nextUser: User) {
    await AsyncStorage.multiSet([
      [AUTH_TOKEN_KEY, nextToken],
      [AUTH_USER_KEY, JSON.stringify(nextUser)],
    ]);

    setAuthToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  async function clearSession() {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
          new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_TIME_MS)),
        ]);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setAuthToken(storedToken);

          try {
            const response = await api.get<User>('/auth/me');
            const restoredUser = response.data;
            await persistSession(storedToken, restoredUser);
          } catch {
            await persistSession(storedToken, parsedUser);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(async () => {
      await clearSession();
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);

    try {
      const response = await api.post<{ token: string; usuario: User }>('/auth/login', {
        email: email.trim().toLowerCase(),
        senha: password,
      });

      await persistSession(response.data.token, response.data.usuario);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível entrar.'));
    } finally {
      setIsLoading(false);
    }
  }

  async function registrar(nome: string, email: string, password: string) {
    setIsLoading(true);

    try {
      const response = await api.post<{ token: string; usuario: User }>('/auth/registro', {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: password,
      });

      await persistSession(response.data.token, response.data.usuario);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Não foi possível criar a conta.'));
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);

    try {
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      registrar,
      logout,
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
