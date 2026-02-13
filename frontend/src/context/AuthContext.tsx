import React, { createContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../api/authApi";
import { User } from "../types/auth.types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuthentication = async (): Promise<void> => {
      try {
        const { user: userData } = await authApi.checkAuth();
        setUser(userData);
      } catch {
        setUser(null);
      }
    };

    const checkAuth = async () => {
      await verifyAuthentication();
      setIsLoading(false);
    };

    void checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
