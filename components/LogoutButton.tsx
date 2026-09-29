import React from 'react';
import { useHealth } from '../context/HealthContext';

const LogoutButton: React.FC = () => {
    const { logout } = useHealth();
    return (
        <button className="w-full text-left py-3 text-sm text-red-400" onClick={logout}>Log Out</button>
    );
};

export default LogoutButton;
