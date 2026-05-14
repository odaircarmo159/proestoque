import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type User = {
  nome: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
          new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_TIME_MS)),
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as User);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(email: string, _password: string) {
    setIsLoading(true);

    const nomeBase = email.split('@')[0]?.replace(/[._-]/g, ' ').trim() || 'Usuário';
    const nome = nomeBase
      .split(' ')
      .filter(Boolean)
      .map((parte) => parte[0].toUpperCase() + parte.slice(1))
      .join(' ');

    const nextUser: User = { nome, email };
    const nextToken = `token-${Date.now()}`;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await AsyncStorage.multiSet([
        [AUTH_TOKEN_KEY, nextToken],
        [AUTH_USER_KEY, JSON.stringify(nextUser)],
      ]);
      setToken(nextToken);
      setUser(nextUser);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);

    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_KEY]);
      setToken(null);
      setUser(null);
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
