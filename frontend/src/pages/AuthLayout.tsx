import React from 'react';
import './AuthLayout.css';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-content">{children}</div>
      <div className="auth-layout-image"></div>
    </div>
  );
};

export default AuthLayout;