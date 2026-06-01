import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AUTH_TOKEN_KEY = '@proestoque:token';

const baseURL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3333/api').replace(/\/$/, '');

let authToken: string | null = null;
let unauthorizedHandler: null | (() => void | Promise<void>) = null;

export const api = axios.create({
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
    if (axios.isAxiosError(error) && error.response?.status === 401 && unauthorizedHandler) {
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
  if (axios.isAxiosError(error)) {
    const apiMessage = error.response?.data?.erro;

    if (typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
      return apiMessage;
    }
  }

  return fallback;
}
