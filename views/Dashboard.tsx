
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS } from '../constants';
import { useHealth } from '../context/HealthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { medications, appointments, scans, notifications, logMedication, userName } = useHealth();

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.read).length;

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Good Morning, {userName}</h2>
          <p className="text-slate-400 font-medium">Your neurological status is stable today.</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-dark p-2 rounded-[1.5rem] border border-white/5 shadow-inner">
          <div className="px-5 py-2.5 bg-primary/10 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Stability</span>
            <span className="text-xl font-bold">94%</span>
          </div>
          <div className="px-5 py-2.5 bg-green-500/10 rounded-2xl flex flex-col items-center">
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Alerts</span>
            <span className="text-xl font-bold">{unreadCount}</span>
          </div>
          {urgentCount > 0 && (
            <div className="px-5 py-2.5 bg-orange-500/10 rounded-2xl flex flex-col items-center animate-pulse">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Urgent</span>
              <span className="text-xl font-bold">{urgentCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {/* Main Score Area */}
          <div className="rounded-[3rem] bg-card-dark border border-slate-800 overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col group">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
              style={{ backgroundImage: `url("${ASSETS.HEALTH_WAVE}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>

            <div className="relative p-12 mt-auto">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="flex flex-col gap-2">
                  <div className="px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] w-fit mb-3">Health Velocity</div>
                  <p className="text-7xl font-display font-bold tracking-tighter">88.4</p>
                  <p className="text-slate-400 font-medium text-lg">Daily Wellness Score <span className="text-green-400 text-sm ml-2 font-bold">▲ 4.2%</span></p>
                </div>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Resting Heart Rate</p>
                    <p className="text-3xl font-bold">72 <span className="text-sm font-normal text-slate-500">bpm</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Last Sleep</p>
                    <p className="text-3xl font-bold">7h 45m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Records & History Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-xl hover:border-primary/20 transition-all group">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Recent Scan</h3>
                <button onClick={() => navigate('/scans')} className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">Full Library</button>
              </div>
              {scans.length > 0 ? (
                <div className="flex gap-6 items-center">
                  <div
                    className="w-24 h-24 rounded-3xl bg-cover bg-center border border-white/10 shrink-0 group-hover:scale-105 transition-transform shadow-lg"
                    style={{ backgroundImage: `url("${scans[0].imageUrl}")` }}
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-lg leading-tight mb-1 truncate">{scans[0].name}</p>
                    <p className="text-slate-400 text-xs font-medium mb-4">{scans[0].date}</p>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-bold w-fit uppercase tracking-widest">
                      <span className="material-symbols-outlined text-sm">verified</span> Verified Report
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">No scans recorded yet.</p>
              )}
            </div>

            <div className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-8 shadow-xl hover:border-primary/20 transition-all flex flex-col group">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Next Milestone</h3>
                <button onClick={() => navigate('/chat')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">chat</span>
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                <p className="text-slate-300 text-sm leading-relaxed italic">"You are 2 days away from your weekly cognitive goal. Complete a mood log to stay on track."</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
                    <span className="material-symbols-outlined">emoji_events</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Wellness Goal #4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-4 flex flex-col gap-8">
          {/* Calendar Section */}
          <div className="bg-surface-dark border border-white/5 rounded-[3rem] p-8 h-full shadow-2xl">
            <h3 className="text-xl font-bold mb-10 flex items-center justify-between">
              Schedule
              <button className="material-symbols-outlined text-slate-600 hover:text-white transition-colors">calendar_add_on</button>
            </h3>
            <div className="flex flex-col gap-8">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex gap-4 items-center group cursor-pointer">
                  <div
                    className="w-16 h-16 rounded-3xl bg-cover bg-center border border-white/10 group-hover:border-primary/50 transition-all shadow-md"
                    style={{ backgroundImage: `url("${apt.imageUrl}")` }}
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate">{apt.doctor}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{apt.specialty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm">{apt.date}</p>
                    <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{apt.time}</p>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && <p className="text-slate-500 text-center py-4">No upcoming appointments.</p>}
            </div>

            <button onClick={() => navigate('/calendar')} className="w-full mt-12 py-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-sm tracking-widest uppercase transition-all shadow-sm">
              View Full Calendar
            </button>
          </div>

          {/* Pharmacy Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-10 flex items-center justify-between">
              Medications
              <span className="px-3 py-1 rounded-full bg-primary text-[10px] font-bold uppercase tracking-widest">Today</span>
            </h3>
            <div className="flex flex-col gap-5">
              {medications.map((med) => (
                <div key={med.id} className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${med.taken ? 'bg-green-500/10 border-green-500/20' : 'bg-surface-dark border-white/5'
                  }`}>
                  <div className="flex gap-4 items-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${med.taken ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                      <span className="material-symbols-outlined text-2xl">{med.taken ? 'check_circle' : 'medication'}</span>
                    </div>
                    <div>
                      <p className={`font-bold text-base ${med.taken ? 'text-green-400 line-through opacity-60' : ''}`}>{med.name}</p>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{med.dosage} • {med.time}</p>
                    </div>
                  </div>
                  {!med.taken && (
                    <button
                      onClick={() => logMedication(med.id)}
                      className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline px-2 py-1"
                    >
                      Log
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Designer Credits Section */}
      <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Platform Design Architecture</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary transition-colors">person_outline</span>
              </div>
              <span className="text-sm font-semibold text-slate-300">Alizah Fatima</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary transition-colors">person_outline</span>
              </div>
              <span className="text-sm font-semibold text-slate-300">Laiba Asif</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary transition-colors">person_outline</span>
              </div>
              <span className="text-sm font-semibold text-slate-300">Samra Hussain</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="px-4 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            NeuroCare AI Platform v2.5.0
          </div>
          <p className="text-[9px] text-slate-600 font-medium">© 2024 Specialized Neurological Care Systems</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
