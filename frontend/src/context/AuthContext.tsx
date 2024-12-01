import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (user: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem('authToken');
    
    return !!token; // Initialize based on token presence
  });

  const login = (user: string, token: string) => {
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', token); // Save token for persistence
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
