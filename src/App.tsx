import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { IonApp, IonContent, IonPage, setupIonicReact } from "@ionic/react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./components/MainLayout";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Bookings } from "./pages/Bookings";
import { Auth } from "./pages/Auth/Auth";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProfileLayout } from "./pages/Profile/ProfileLayout";
import { Orders } from "./pages/Orders/Orders";
import { Addresses } from "./pages/Profile/Addresses/Addresses";
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { useEffect, useTransition } from 'react';
import { Capacitor } from '@capacitor/core';
import * as config from "./auth_config.json";
import { getRedirectUri } from "./utils/getRedirectUri";

// Import Ionic CSS
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Setup Ionic React
setupIonicReact();

// Configure future flags for React Router v7
const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

function App() {
  const [isPending] = useTransition();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Handle the App URL open event for Android deep linking
      CapApp.addListener('appUrlOpen', (data: { url: string }) => {
        // Handle the deep link URL, which will contain the auth response
        const params = new URLSearchParams(data.url.split('?')[1]);
        const code = params.get('code');
        const state = params.get('state');
        
        if (code && state) {
          // Close the browser if it's still open
          Browser.close();
        }
      });

      // Configure Auth0 to use the Capacitor Browser plugin
      (window as any).openURL = async (url: string) => {
        await Browser.open({ url, windowName: '_self' });
      };
    }
  }, []);

  // Cross-platform auth configuration
  const getAuthConfig = () => {
    const isNative = Capacitor.isNativePlatform();
    const redirectUri = getRedirectUri();
    
    const baseConfig = {
      domain: config.domain,
      clientId: config.clientId,
      authorizationParams: {
        ...config.authorizationParams,
        redirect_uri: redirectUri,
      },
      cacheLocation: isNative ? 'localstorage' : 'memory',
      useRefreshTokens: true,
      useRefreshTokensFallback: true,
      audience: config.authorizationParams?.audience,
      scope: "openid profile email",
    };

    if (Capacitor.isNativePlatform()) {
      // Mobile app configuration
      return {
        ...baseConfig,
        redirect_uri: 'com.salvatore.app://callback',
      };
    } else {
      // Web configuration
      return {
        ...baseConfig,
        redirect_uri: getRedirectUri(),
      };
    }
  };

  // Cross-platform redirect handling
  const handleRedirectCallback = (appState: any) => {
    if (Capacitor.isNativePlatform()) {
      // Mobile: Use React Router navigation
      window.history.replaceState({}, '', appState?.returnTo || '/');
    } else {
      // Web: Use window.location
      window.location.href = appState?.returnTo || window.location.pathname;
    }
  };

  useEffect(() => {
    const setupCapacitorListeners = async () => {
      // Handle deep links when app is already running
      await CapApp.addListener('appUrlOpen', (event: { url: string }) => {
        console.log('App URL opened:', event.url);
        const slug = event.url.split('callback?').pop();
        if (slug) {
          // Redirect to auth page to handle the callback using history to maintain state
          window.history.pushState({}, '', `/auth?${slug}`);
        }
      });

      // Handle app state changes
      await CapApp.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Active:', isActive);
        if (isActive) {
          // App came to foreground
          document.body.classList.remove('app-paused');
        } else {
          // App went to background
          document.body.classList.add('app-paused');
        }
      });

      // Handle pause event
      await CapApp.addListener('pause', () => {
        console.log('App paused');
        document.body.classList.add('app-paused');
        // Save any necessary state here
      });

      // Handle resume event
      await CapApp.addListener('resume', () => {
        console.log('App resumed');
        document.body.classList.remove('app-paused');
        // Restore any necessary state here
      });

      // Handle browser completion
      await Browser.addListener('browserFinished', () => {
        console.log('Browser finished');
        // Re-enable app interactions
        document.body.classList.remove('browser-active');
      });

      // Handle back button
      await CapApp.addListener('backButton', async ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          // Show confirmation before exiting
          const shouldExit = window.confirm('Are you sure you want to exit?');
          if (shouldExit) {
            await CapApp.exitApp();
          }
        }
      });
    };

    // Initialize listeners
    setupCapacitorListeners().catch(console.error);

    return () => {
      // Cleanup listeners
      const cleanup = async () => {
        await CapApp.removeAllListeners();
        await Browser.removeAllListeners();
      };
      cleanup().catch(console.error);
    };
  }, []);

  return (
    <IonApp>
      <Router future={routerFutureConfig}>
        <Auth0Provider
          domain={config.domain}
          clientId={config.clientId}
          authorizationParams={getAuthConfig()}
          cacheLocation="localstorage"
          onRedirectCallback={handleRedirectCallback}
          useRefreshTokens={true}
          useRefreshTokensFallback={false}
        >
          <CartProvider>
            <AuthProvider>
              <WishlistProvider>
                <IonPage>
                  <IonContent>
                    <div className="min-h-screen bg-white">
                      {isPending && (
                        <div className="fixed top-0 left-0 w-full h-1">
                          <div
                            className="h-full bg-rose-600 animate-[loading_1s_ease-in-out_infinite]"
                            style={{ width: "25%" }}
                          />
                        </div>
                      )}
                      <Routes>
                        {/* Public route - Auth page */}
                        <Route path="/auth" element={<Auth />} />
                        
                        {/* Protected routes - require authentication */}
                        <Route 
                          path="/" 
                          element={
                            <ProtectedRoute>
                              <MainLayout>
                                <Home />
                              </MainLayout>
                            </ProtectedRoute>
                          } 
                      />
                      <Route 
                        path="/services" 
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <Services />
                            </MainLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/bookings" 
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <Bookings />
                            </MainLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/about" 
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <About />
                            </MainLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/orders" 
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <Orders />
                            </MainLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <ProfileLayout />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      >
                        <Route
                          path="payments"
                          element={<div>Payments Coming Soon</div>}
                        />
                        <Route path="addresses" element={<Addresses />} />
                        <Route
                          path="settings"
                          element={<div>Settings Coming Soon</div>}
                        />
                      </Route>
                    </Routes>
                    </div>
                  </IonContent>
                </IonPage>
              </WishlistProvider>
            </AuthProvider>
          </CartProvider>
        </Auth0Provider>
      </Router>
    </IonApp>
  );
}

export default App;
