/**
 * Cliente HTTP para o backend Copa (FastAPI).
 *
 * - Injeta automaticamente o Authorization header quando o token estiver disponível.
 * - Retorna a resposta parseada ou lança ApiError com code + message.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const token = await AsyncStorage.getItem('@egol:access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...extraHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content — sem body
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(response.status, 'Resposta inválida do servidor');
  }

  if (!response.ok) {
    const message =
      (data as { detail?: string })?.detail ??
      `Erro ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>('GET', path, undefined, headers),

  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>('POST', path, body, headers),

  put: <T>(path: string, body?: unknown) =>
    request<T>('PUT', path, body),

  delete: <T>(path: string, body?: unknown) =>
    request<T>('DELETE', path, body),
};
