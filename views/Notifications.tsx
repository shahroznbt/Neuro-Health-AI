
import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';

const Notifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, logMedication } = useHealth();
  const [filter, setFilter] = useState('All');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Meds') return n.type === 'med' || n.type === 'urgent';
    if (filter === 'Insights') return n.type === 'insight';
    if (filter === 'Appointments') return n.type === 'appointment';
    return true;
  });

  const urgentAlerts = notifications.filter(n => n.priority === 'high' && !n.read);

  return (
    <div className="flex flex-col gap-6 pt-12 max-w-4xl mx-auto px-4 pb-12">
      <header className="flex flex-col gap-2 sticky top-0 bg-background-dark/90 backdrop-blur-xl z-30 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">Alert Center</h1>
          <button 
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 text-primary hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            <span className="text-xs font-bold uppercase tracking-widest">Mark all read</span>
          </button>
        </div>
      </header>

      {/* System Status Banner */}
      <div className="bg-surface-dark border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-2xl">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Bio-Telemetry</p>
          </div>
          <h4 className="text-xl font-bold">AI Monitoring Active</h4>
          <p className="text-sm text-slate-400">Your wearable device is syncing correctly.</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-4xl">sensors</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {['All', 'Meds', 'Appointments', 'Insights'].map((f) => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            className={`shrink-0 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
              filter === f 
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25' 
                : 'bg-surface-dark text-slate-500 border-white/5 hover:text-white hover:border-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Urgent Section */}
      {urgentAlerts.length > 0 && (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500 fill text-2xl">error</span>
            <h3 className="font-bold text-lg">Action Required</h3>
          </div>
          {urgentAlerts.map(alert => (
            <div key={alert.id} className="relative bg-surface-dark rounded-[2.5rem] p-8 border-l-4 border-orange-500 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors"></div>
               <div className="relative flex justify-between items-start mb-6">
                 <div>
                   <p className="text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">High Priority Notification</p>
                   <h4 className="text-2xl font-bold mb-1">{alert.title}</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">{alert.description}</p>
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center border border-orange-500/20">
                   <span className="material-symbols-outlined text-3xl">medication</span>
                 </div>
               </div>
               <div className="relative flex gap-4">
                 <button className="flex-1 h-12 rounded-2xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all border border-white/5">Snooze</button>
                 <button 
                   onClick={() => logMedication('m1')} // Simplified mapping for demo
                   className="flex-2 px-8 h-12 rounded-2xl bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
                  >
                    Confirm Dose
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline Section */}
      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-lg mt-4 flex items-center justify-between">
          Recent Activity
          <span className="text-xs font-medium text-slate-500">Showing {filteredNotifications.length} alerts</span>
        </h3>
        
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500 italic bg-surface-dark/30 rounded-3xl border border-dashed border-white/10">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div 
              key={n.id} 
              onClick={() => markNotificationRead(n.id)}
              className={`group bg-surface-dark border transition-all rounded-[2rem] p-6 flex gap-6 cursor-pointer ${
                n.read ? 'border-white/5 opacity-60 grayscale-[0.5]' : 'border-primary/20 shadow-xl scale-[1.01]'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                n.type === 'insight' ? 'bg-teal-500/10 text-teal-400' :
                n.type === 'appointment' ? 'bg-purple-500/10 text-purple-400' :
                'bg-blue-500/10 text-blue-400'
              }`}>
                <span className="material-symbols-outlined text-3xl">
                  {n.type === 'insight' ? 'psychology' : n.type === 'appointment' ? 'event' : 'info'}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{n.title}</h4>
                  <span className="text-[10px] font-bold text-slate-500 uppercase bg-black/30 px-3 py-1 rounded-full">{n.time}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{n.description}</p>
                {!n.read && (
                  <div className="mt-4 flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest">
                    New Alert <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1"></span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
