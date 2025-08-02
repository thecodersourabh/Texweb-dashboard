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
  return (
    <IonApp>
      <Router future={routerFutureConfig}>
        <Auth0Provider
          domain={config.domain}
          clientId={config.clientId}
          authorizationParams={{
            redirect_uri: getRedirectUri(),
          }}
          cacheLocation="localstorage"
          useRefreshTokens={true}
          skipRedirectCallback={window.location.pathname === '/auth'}
        >
          <CartProvider>
            <AuthProvider>
              <WishlistProvider>
                <IonPage>
                  <IonContent>
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
