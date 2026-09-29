import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingNav() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d1a]/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-glow-sm flex items-center justify-center">
            <div className="w-full h-full bg-[#0a1022] rounded-[10px] flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center relative">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-0.5 bg-blue-400 rotate-45 rounded-full" />
              </div>
            </div>
          </div>
          <span className="font-extrabold text-white text-lg tracking-wider font-mono">
            TRIALLENS
          </span>
        </NavLink>

        {/* Center Nav Links (matches screenshot 4: Home, Features, How It Works, Use Cases, About) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-white hover:text-blue-400 transition-colors">
            Home
          </button>
          <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">
            Features
          </button>
          <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">
            How It Works
          </button>
          <button onClick={() => scrollTo('use-cases')} className="hover:text-white transition-colors">
            Use Cases
          </button>
          <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">
            About
          </button>
        </nav>

        {/* Action Buttons: Log in + Get Started */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Log in
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
