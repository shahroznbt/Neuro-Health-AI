
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ASSETS } from '../constants';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background-dark overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-6 fixed top-0 w-full z-50 bg-background-dark/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl font-bold">neurology</span>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-tight">NeuroCare AI</h2>
        </div>
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Technology</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">About Us</a>
          <button
            onClick={() => navigate('/auth')}
            className="px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-white transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25 transition-all"
          >
            Join Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center pt-32 pb-16 px-8 md:px-16 gap-12 min-h-screen">
        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8 animate-in fade-in slide-in-from-left-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-xs font-bold uppercase tracking-widest">Next-Gen Neurological Support</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-8">
            The Future of <br />
            <span className="text-primary bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Neurological Care</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-lg">
            A comprehensive, AI-driven platform designed to monitor, analyze, and manage your neurological health with unprecedented precision.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="px-10 py-5 rounded-2xl bg-primary hover:bg-blue-600 text-white text-lg font-bold shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
            >
              Start Your Journey
            </button>
            <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-lg font-bold transition-all">
              Watch Demo
            </button>
          </div>
          <div className="mt-12 flex items-center gap-4 text-slate-500 text-sm font-medium">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background-dark bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                </div>
              ))}
            </div>
            <span>Trusted by 5,000+ patients worldwide</span>
          </div>
        </div>
        <div className="flex-1 relative w-full h-[500px] md:h-[650px]">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
          <div
            className="relative w-full h-full bg-cover bg-center rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden"
            style={{ backgroundImage: `url("${ASSETS.HERO_NEURAL}")` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-10 left-10 p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 max-w-xs">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary">analytics</span>
                <span className="font-bold text-white">Live Health Analysis</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-primary w-3/4 animate-progress"></div>
              </div>
              <p className="text-xs text-slate-300">Synchronizing neural metrics with cloud nodes...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 md:px-16 py-24 bg-white/[0.02] border-y border-white/5">
        {[
          { label: 'Uptime', value: '99.9%', sub: 'Reliable monitoring' },
          { label: 'Accuracy', value: '98.5%', sub: 'AI Diagnostics' },
          { label: 'Users', value: '12k+', sub: 'Active patients' },
          { label: 'Clinics', value: '150+', sub: 'Partners worldwide' }
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center md:items-start">
            <h4 className="text-4xl font-display font-bold text-white mb-2">{s.value}</h4>
            <p className="font-bold text-primary text-sm uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-slate-500 text-xs">{s.sub}</p>
          </div>
        ))}
      </section>

      {/* Feature Grid */}
      <section className="px-8 md:px-16 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Advanced Toolset</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg italic">"Providing clarity where there was once only uncertainty."</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: 'neurology',
              title: 'MRI Computer Vision',
              desc: 'State-of-the-art volumetric analysis of MRI scans using convolutional neural networks.',
              color: 'text-blue-400',
              bg: 'bg-blue-400/10'
            },
            {
              icon: 'smart_toy',
              title: 'Conversational AI',
              desc: 'Expert support assistant trained on the latest neurological clinical guidelines and research.',
              color: 'text-purple-400',
              bg: 'bg-purple-400/10'
            },
            {
              icon: 'vitals',
              title: 'Real-time Tracking',
              desc: 'Seamless integration with wearables to monitor stability, mood, and cognitive performance.',
              color: 'text-teal-400',
              bg: 'bg-teal-400/10'
            }
          ].map((feature, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-surface-dark border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-2 group">
              <div className={`w-16 h-16 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined !text-[32px]">{feature.icon}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-8 md:px-16 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-slate-500 text-sm">© 2024 NeuroCare AI. All rights reserved.</p>
        <div className="flex gap-8 text-sm font-semibold text-slate-400">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
        </div>
        <div className="flex gap-4">
          {['facebook', 'twitter', 'linkedin'].map(social => (
            <button key={social} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-lg">{social === 'linkedin' ? 'group' : 'share'}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
