import React from 'react';
import { TRUSTED_COMPANIES } from '../../data/mockData';

export default function TrustedSection() {
  const stats = [
    { value: "10K+", label: "Documents Processed" },
    { value: "95%", label: "Answer Accuracy*" },
    { value: "60%", label: "Faster Research" },
    { value: "100%", label: "Source-backed" },
  ];

  return (
    <section className="border-y border-slate-800/80 bg-[#090e1b]/80 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Trusted By Logos */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block text-center lg:text-left">
              TRUSTED BY RESEARCH TEAMS
            </span>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 opacity-80 hover:opacity-100 transition-opacity">
              {TRUSTED_COMPANIES.map((company) => (
                <span
                  key={company.name}
                  className={`font-sans ${company.style} select-none cursor-default hover:scale-105 transition-transform`}
                >
                  {company.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: 4 Key Metrics / Stats (matches screenshot 4) */}
          <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-6 lg:pt-0 lg:pl-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {stats.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
