import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import OAuthSuccess from "./pages/OAuthSuccess";
import useAuthStore from "./store/useAuthStore";

// import CreateChallengeModal from "./components/CreateChallenge";

import RouteGuard from "./components/RouteGuard";
import { Toaster } from "react-hot-toast";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Toaster position="top-right" containerStyle={{ zIndex: 9999 }} />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <RouteGuard requiresAuth={false}>
                <Login />
              </RouteGuard>
            }
          />
          <Route
            path="/register"
            element={
              <RouteGuard requiresAuth={false}>
                <Register />
              </RouteGuard>
            }
          />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route
            path="/dashboard"
            element={
              <RouteGuard requiresAuth={true}>
                <Dashboard />
              </RouteGuard>
            }
          />
        
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
