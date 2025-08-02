import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getLogoutUri } from '../utils/getRedirectUri';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  logout: () => void;
  loginWithRedirect: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    isLoading,
  } = useAuth0();

  useEffect(() => {
    if (!isLoading) {
      setIsInitialized(true);
      
      // If user is not authenticated and not on the auth page, redirect to auth
      if (!isAuthenticated && location.pathname !== '/auth') {
        navigate('/auth', { replace: true });
      }
      
      // If user is authenticated and on auth page, redirect to dashboard
      if (isAuthenticated && location.pathname === '/auth') {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  const value = {
    isAuthenticated,
    user,
    loading: isLoading,
    logout: () => logout({ logoutParams: { returnTo: getLogoutUri() } }),
    loginWithRedirect,
    isInitialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
