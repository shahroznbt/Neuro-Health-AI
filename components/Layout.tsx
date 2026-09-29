
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: 'grid_view', label: 'Dashboard', path: '/dashboard' },
    { icon: 'radiology', label: 'MRI Scans', path: '/scans' },
    { icon: 'chat_bubble', label: 'Neuro AI', path: '/chat' },
    { icon: 'notifications', label: 'Alerts', path: '/notifications' },
    { icon: 'settings', label: 'Settings', path: '/profile' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background-dark text-white selection:bg-primary/30">
      {/* Sidebar - Desktop Only */}
      {showNav && (
        <aside className="hidden md:flex flex-col w-64 bg-surface-dark/50 border-r border-white/5 sticky top-0 h-screen p-6">
          <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl font-bold">neurology</span>
            </div>
            <h2 className="text-xl font-display font-bold tracking-tight">NeuroCare</h2>
          </div>

          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[24px] ${isActive ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="font-semibold text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {/* Top Bar - Desktop Only */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/5 bg-background-dark/50 backdrop-blur-xl sticky top-0 z-40">
           <h1 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Patient Portal v2.5</h1>
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-300">Syncing Live</span>
             </div>
             <button className="text-slate-400 hover:text-white transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border-2 border-background-dark"></span>
             </button>
             <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 overflow-hidden cursor-pointer">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgEsku9ybj0vLi8z0mrEhY-b-AJRd5aMJ-nNpCOlIv81NKHnAt4ZG07vPdX5Vq-e4JQfLI2Ceo56Jg8yR8jo8nLZgwV1EHbwD9ctaH9A-QzfENM2G05AHuOC716lI02rFC-aiiFfy79lRTjxcza2-Iik260sDKJxUKVDiXL-dezr3x9FecHni9zF6LAOEeq-SWJAkNdhxmZ3uq2FfWJieotVM3i6xWMTJZ-bxpLSk7wlbJvZUYXO3S1AUFZPbBnC4N32BbdZ2hEkY" alt="Profile" />
             </div>
           </div>
        </header>

        <div className={`flex-1 ${showNav ? 'pb-24 md:pb-8' : ''}`}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {showNav && (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-dark/95 backdrop-blur-2xl border-t border-white/5 py-3 pb-8 z-50 px-6">
          <ul className="flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1.5 transition-all ${isActive ? 'text-primary' : 'text-slate-500'}`}
                  >
                    <span className={`material-symbols-outlined text-[26px] ${isActive ? 'fill' : ''}`}>
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label.split(' ')[0]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Layout;
