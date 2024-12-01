import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import PokemonList from './pages/PokemonList/PokemonList';
import PokemonDetails from './pages/PokemonList/PokemonDetails';
import { useAuth } from './context/AuthContext';

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  return isAuthenticated ? <>{children}</> : <div>Loading...</div>;
};

const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PokemonList />
          </ProtectedRoute>
        }
      />
      {/* Redirect all other routes to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
