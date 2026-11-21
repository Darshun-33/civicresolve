import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ComplaintProvider } from './context/ComplaintContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { Home } from './pages/Home';
import { ReportIssue } from './pages/ReportIssue';
import { TrackComplaint } from './pages/TrackComplaint';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ComplaintProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#1C1322] text-[#F5EDF7] flex flex-col relative selection:bg-[#AD42B8] selection:text-white">
            {/* Ambient Background Grid and Illumination */}
            <div className="fixed inset-0 bg-mesh-grid pointer-events-none opacity-30 z-0" />
            <div className="ambient-glow-orchid fixed top-0 left-1/4 w-[600px] h-[600px] pointer-events-none opacity-40 z-0" />
            <div className="ambient-glow-electric fixed bottom-0 right-1/4 w-[500px] h-[500px] pointer-events-none opacity-30 z-0" />

            <div className="relative z-10 flex flex-col flex-grow">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/report" element={<ReportIssue />} />
                  <Route path="/track" element={<TrackComplaint />} />
                  <Route path="/dashboard" element={<CitizenDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
            </div>

            {/* Global Hackathon Demo Walkthrough Modal */}
            <DemoWalkthroughModal />
          </div>
        </BrowserRouter>
      </ComplaintProvider>
    </LanguageProvider>
  );
};

