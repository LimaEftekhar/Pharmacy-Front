import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios"; //added recently
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import OAuthSuccess from "./pages/OAuthSuccess";
import useAuthStore from "./store/useAuthStore";

import RouteGuard from "./components/RouteGuard";
import { Toaster } from "react-hot-toast";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Start: recently added: Wake up backend
    const wakeServer = async () => {
      try {
        // Wait for backend to wake up
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/health`);
        console.log("Backend awake ✅");
        // end recently: it moved form below line. Only AFTER backend is ready
        await checkAuth();
      } catch (err) {
        console.warn("Backend still waking up: ", err.message);
      }
    };

    wakeServer(); // call it immediately
    //End: recently added

    // 2nd recently: it moved up before catch: checkAuth();
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
