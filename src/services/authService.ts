/**
 * Serviço de autenticação — encapsula as chamadas /auth/* do backend.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ApiError } from './api';

const STORAGE_ACCESS_TOKEN = '@egol:access_token';
const STORAGE_REFRESH_TOKEN = '@egol:refresh_token';
const STORAGE_USER = '@egol:user';

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: AuthUser;
}

// ---------------------------------------------------------------------------
// Persistência local
// ---------------------------------------------------------------------------

export async function saveSession(data: TokenResponse): Promise<void> {
  await AsyncStorage.multiSet([
    [STORAGE_ACCESS_TOKEN, data.access_token],
    [STORAGE_REFRESH_TOKEN, data.refresh_token],
    [STORAGE_USER, JSON.stringify(data.user)],
  ]);
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_ACCESS_TOKEN,
    STORAGE_REFRESH_TOKEN,
    STORAGE_USER,
  ]);
}

export async function loadSession(): Promise<{ user: AuthUser; accessToken: string } | null> {
  const [[, accessToken], [, userJson]] = await AsyncStorage.multiGet([
    STORAGE_ACCESS_TOKEN,
    STORAGE_USER,
  ]);
  if (!accessToken || !userJson) return null;
  try {
    const user = JSON.parse(userJson) as AuthUser;
    return { user, accessToken };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

export async function register(
  email: string,
  password: string,
  name?: string,
): Promise<AuthUser> {
  const data = await api.post<TokenResponse>('/auth/register', { email, password, name });
  await saveSession(data);
  return data.user;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await api.post<TokenResponse>('/auth/login', { email, password });
  await saveSession(data);
  return data.user;
}

export async function refreshSession(): Promise<AuthUser | null> {
  const refreshToken = await AsyncStorage.getItem(STORAGE_REFRESH_TOKEN);
  if (!refreshToken) return null;
  try {
    const data = await api.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    await saveSession(data);
    return data.user;
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) {
      await clearSession();
    }
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore — logout do lado do servidor é no-op
  } finally {
    await clearSession();
  }
}

export async function getMe(): Promise<AuthUser> {
  return api.get<AuthUser>('/auth/me');
}

// ---------------------------------------------------------------------------
// Push token
// ---------------------------------------------------------------------------

export async function registerPushToken(token: string, platform?: string): Promise<void> {
  try {
    await api.post('/users/push-token', { token, platform });
  } catch (e) {
    console.warn('[Auth] Falha ao registrar push token:', e);
  }
}

export async function removePushToken(token: string): Promise<void> {
  try {
    await api.delete('/users/push-token', { token });
  } catch {
    // Ignore
  }
}
