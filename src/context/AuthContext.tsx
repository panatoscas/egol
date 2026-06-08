import React, { createContext, useContext } from 'react';

interface AuthContextType {
  login: () => void;
}

export const AuthContext = createContext<AuthContextType>({ login: () => {} });
export const useAuth = () => useContext(AuthContext);
