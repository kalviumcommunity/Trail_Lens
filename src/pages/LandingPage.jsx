import React, { useState } from 'react';
import LandingNav from '../components/landing/LandingNav';
import LandingHero from '../components/landing/LandingHero';
import TrustedSection from '../components/landing/TrustedSection';
import HowItWorks from '../components/landing/HowItWorks';
import UseCasesSection from '../components/landing/UseCasesSection';
import DemoVideoModal from '../components/landing/DemoVideoModal';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col">
      <LandingNav />
      <main className="flex-1">
        <LandingHero onOpenDemo={() => setIsDemoOpen(true)} />
        <TrustedSection />
        <HowItWorks />
        <UseCasesSection />
      </main>
      <LandingFooter />
      <DemoVideoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </div>
  );
}
