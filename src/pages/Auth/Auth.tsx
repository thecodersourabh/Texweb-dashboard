import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Wrench, User, Shield, Zap } from 'lucide-react';
import { QuickLoader } from '../../components/QuickLoader';

export const Auth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      // Small delay to show the redirect message
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    }
  }, [isAuthenticated, navigate, isRedirecting]);

  // Show quick loader for Auth0 initialization
  if (isLoading) {
    return <QuickLoader message="Initializing..." />;
  }

  // Show redirect message when authenticated
  if (isAuthenticated && isRedirecting) {
    return <QuickLoader message="Welcome! Redirecting to dashboard..." />;
  }

  // Show authenticated user info briefly before redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-md w-full space-y-6 p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="text-center">
            <img
              src={user?.picture}
              alt={user?.name}
              className="mx-auto h-20 w-20 rounded-full border-4 border-white/30 mb-4"
            />
            <h2 className="text-2xl font-bold text-white">
              Welcome, {user?.name?.split(' ')[0]}!
            </h2>
            <p className="text-blue-100 text-sm">{user?.email}</p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              <p className="text-white font-medium">Loading dashboard...</p>
            </div>
          </div>
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="w-full py-2 px-4 text-sm font-medium rounded-lg text-white border border-white/30 hover:bg-white/10 transition-colors duration-200"
          >
            Sign Out Instead
          </button>
        </div>
      </div>
    );
  }

  // Main login interface
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Salvatore</h1>
          </div>
          <p className="text-xl text-blue-100">Service Provider Dashboard</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Get Started</h2>
              <p className="text-blue-100">Manage your services across multiple sectors</p>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { name: 'Electrical', icon: Zap },
                { name: 'Tailoring', icon: User },
                { name: 'Plumbing', icon: Wrench },
                { name: 'Security', icon: Shield }
              ].map(({ name, icon: Icon }) => (
                <div key={name} className="flex items-center space-x-2 text-blue-100">
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => loginWithRedirect()}
              className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold text-lg hover:bg-blue-50 active:bg-blue-100 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg"
            >
              Sign In / Register
            </button>

            <p className="text-xs text-blue-200">
              New to Salvatore? Registration is automatic and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
