import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import {
  AuthUser,
  loadSession,
  login as apiLogin,
  logout as apiLogout,
  refreshSession,
  register as apiRegister,
} from '../services/authService';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthContextType {
  /** null = ainda carregando | undefined = não autenticado | AuthUser = logado */
  user: AuthUser | null | undefined;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // null = carregando, undefined = deslogado, AuthUser = logado
  const [user, setUser] = useState<AuthUser | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura sessão ao boot
  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await loadSession();
        if (!session) {
          setUser(undefined);
          return;
        }
        // Tenta renovar o token silenciosamente para garantir que é válido
        const refreshed = await refreshSession();
        setUser(refreshed ?? undefined);
      } catch {
        setUser(undefined);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loggedUser = await apiLogin(email, password);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const newUser = await apiRegister(email, password, name);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(undefined);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
