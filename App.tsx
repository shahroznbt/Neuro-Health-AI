
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './views/Landing';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Chat from './views/Chat';
import MRIAnalysis from './views/MRIAnalysis';
import Notifications from './views/Notifications';
import Profile from './views/Profile';
import Calendar from './views/Calendar';
import { HealthProvider } from './context/HealthContext';

// Helper for accessing context in Profile render
import LogoutButton from './components/LogoutButton';

const App: React.FC = () => {
  return (
    <HealthProvider>
      <Router>
        <Routes>
          {/* Screens without persistent navigation */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Screens with main application shell */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/chat"
            element={
              <Layout>
                <Chat />
              </Layout>
            }
          />
          <Route
            path="/scans"
            element={
              <Layout>
                <MRIAnalysis />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout>
                <Notifications />
              </Layout>
            }
          />
          <Route
            path="/calendar"
            element={
              <Layout>
                <Calendar />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HealthProvider>
  );
};

export default App;
