import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useHealth } from '../context/HealthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useHealth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to auth page but save the location they were trying to go to
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
