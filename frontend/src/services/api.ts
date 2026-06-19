import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, isAxiosError } from 'axios';
import Constants from 'expo-constants';

const AUTH_TOKEN_KEY = '@proestoque:token';

const baseURL = (
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:3333/api'
).replace(/\/$/, '');

let authToken: string | null = null;
let unauthorizedHandler: null | (() => void | Promise<void>) = null;

export const api = create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = authToken ?? (await AsyncStorage.getItem(AUTH_TOKEN_KEY));

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isAxiosError(error) && error.response?.status === 401 && unauthorizedHandler) {
      await unauthorizedHandler();
    }

    return Promise.reject(error);
  }
);

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: null | (() => void | Promise<void>)) {
  unauthorizedHandler = handler;
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const apiMessage = error.response?.data?.erro;

    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Tempo de resposta esgotado. Tente novamente.';
    }

    if (error.message === 'Network Error') {
      return 'Erro de conexão. Verifique a API e sua rede Wi-Fi.';
    }
  }

  return fallback;
}
