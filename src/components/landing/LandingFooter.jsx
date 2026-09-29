import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#060a14] border-t border-slate-800/80 text-slate-400 text-xs">
      {/* Pre-footer Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-950 via-[#0e1f44] to-[#0a152e] border border-blue-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl text-center space-y-6">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Ready to modernize your trial analysis?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Start asking evidence-grounded questions today.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join leading clinical research organizations, biopharma sponsors, and medical affairs teams using TrialLens.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-blue-600/40 hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/documents')}
              className="px-5 py-3 bg-[#0a1224] hover:bg-slate-800 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Explore Documents Library
            </button>
          </div>

          {/* Compliance Badges */}
          <div className="relative z-10 pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400 border-t border-slate-800/80 max-w-xl mx-auto">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> HIPAA Compliant</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 21 CFR Part 11</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-emerald-400" /> AES-256 Encryption</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> GxP Audit Trails</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-900 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 space-y-4">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#0a1022] rounded-[10px] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-blue-400 relative">
                  <div className="w-1 h-1 rounded-full bg-cyan-300 absolute inset-0 m-auto" />
                </div>
              </div>
            </div>
            <span className="font-extrabold text-white text-base tracking-wider font-mono">
              TRIALLENS
            </span>
          </NavLink>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            AI-powered clinical research intelligence platform delivering accurate, source-grounded evidence from trial documentation.
          </p>
          <p className="text-[11px] text-blue-400 font-mono italic">
            "Evidence-first research for a healthier tomorrow."
          </p>
        </div>

        {/* Product Column */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><NavLink to="/dashboard" className="hover:text-white transition-colors">Dashboard</NavLink></li>
            <li><NavLink to="/documents" className="hover:text-white transition-colors">Documents Library</NavLink></li>
            <li><NavLink to="/ask" className="hover:text-white transition-colors">Ask a Question</NavLink></li>
            <li><NavLink to="/upload" className="hover:text-white transition-colors">Upload Portal</NavLink></li>
            <li><NavLink to="/saved" className="hover:text-white transition-colors">Saved Answers</NavLink></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><NavLink to="/help" className="hover:text-white transition-colors">Help & FAQ</NavLink></li>
            <li><NavLink to="/help" className="hover:text-white transition-colors">Clinical OCR Specs</NavLink></li>
            <li><NavLink to="/help" className="hover:text-white transition-colors">RAG Citation Guide</NavLink></li>
            <li><NavLink to="/settings" className="hover:text-white transition-colors">API Keys</NavLink></li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div className="space-y-2.5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">Compliance</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">BAA Agreement</span></li>
            <li><span className="hover:text-white cursor-pointer transition-colors">Security Whitepaper</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© 2026 TrialLens Inc. Built for clinical researchers. All rights reserved.</p>
        <p className="font-mono">Platform Release v1.0.0 (Production Verified)</p>
      </div>
    </footer>
  );
}
