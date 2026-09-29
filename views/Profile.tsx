
import React from 'react';
import { useHealth } from '../context/HealthContext';
import LogoutButton from '../components/LogoutButton';

const Profile: React.FC = () => {
    const { userName } = useHealth();

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-primary/20 flex items-center justify-center text-4xl font-bold text-primary/50">
                {userName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-slate-500">Patient ID: #RE-901-2 • Type B+</p>
            <div className="bg-surface-dark p-6 rounded-2xl w-full max-w-md border border-white/5">
                <p className="text-left text-xs font-bold text-slate-500 uppercase mb-4">Account Settings</p>
                <button className="w-full text-left py-3 border-b border-white/5 text-sm hover:text-primary transition-colors">Security & Privacy</button>
                <button className="w-full text-left py-3 border-b border-white/5 text-sm hover:text-primary transition-colors">Device Integration</button>
                <LogoutButton />
            </div>
        </div>
    );
};

export default Profile;
