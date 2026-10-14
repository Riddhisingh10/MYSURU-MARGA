'use client';

import React, { useState } from 'react';
import { Bus, MapPin, Route, Menu, X, Compass, Activity } from 'lucide-react';
import { BRAND } from '@/lib/constants';

interface HeaderProps {
  activeTab: 'plan' | 'routes' | 'track';
  onSelectTab: (tab: 'plan' | 'routes' | 'track') => void;
  simulationRunning: boolean;
  onToggleSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  simulationRunning,
  onToggleSimulation,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFCF7]/95 backdrop-blur-md border-b border-[#E5D8C8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Wordmark */}
          <div
            onClick={() => onSelectTab('plan')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#702C3B] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-[#F7F1E7]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#282321]">
                  Mysuru <span className="text-[#702C3B]">Marga</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#702C3B]/10 text-[#702C3B] border border-[#702C3B]/20">
                  ಮೈಸೂರು ಮಾರ್ಗ
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#776E68] font-medium tracking-wide">
                Smart City Bus Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={() => onSelectTab('plan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'plan'
                  ? 'bg-[#702C3B] text-white shadow-sm'
                  : 'text-[#282321] hover:bg-[#F7F1E7] hover:text-[#702C3B]'
              }`}
            >
              <Compass className="w-4 h-4" />
              Plan Journey
            </button>

            <button
              onClick={() => onSelectTab('routes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'routes'
                  ? 'bg-[#702C3B] text-white shadow-sm'
                  : 'text-[#282321] hover:bg-[#F7F1E7] hover:text-[#702C3B]'
              }`}
            >
              <Route className="w-4 h-4" />
              Bus Routes
            </button>

            <button
              onClick={() => onSelectTab('track')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'track'
                  ? 'bg-[#702C3B] text-white shadow-sm'
                  : 'text-[#282321] hover:bg-[#F7F1E7] hover:text-[#702C3B]'
              }`}
            >
              <div className="relative">
                <Activity className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
              </div>
              Track Bus
            </button>
          </nav>

          {/* Right Status / Simulation Toggle & Mobile Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleSimulation}
              title={simulationRunning ? 'Pause simulated GPS updates' : 'Resume simulated GPS updates'}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E5D8C8] bg-[#F7F1E7] text-xs font-medium text-[#776E68] hover:border-[#702C3B] hover:text-[#702C3B] transition-colors"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  simulationRunning ? 'bg-[#2D6A4F]' : 'bg-[#B07D14]'
                }`}
              />
              {simulationRunning ? 'Sim: Active' : 'Sim: Paused'}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#282321] hover:bg-[#F7F1E7] focus:outline-none focus:ring-2 focus:ring-[#702C3B]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5D8C8] bg-[#FFFCF7] px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              onSelectTab('plan');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'plan'
                ? 'bg-[#702C3B] text-white'
                : 'text-[#282321] hover:bg-[#F7F1E7]'
            }`}
          >
            <Compass className="w-5 h-5" />
            Plan Journey
          </button>

          <button
            onClick={() => {
              onSelectTab('routes');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'routes'
                ? 'bg-[#702C3B] text-white'
                : 'text-[#282321] hover:bg-[#F7F1E7]'
            }`}
          >
            <Route className="w-5 h-5" />
            Bus Routes Directory
          </button>

          <button
            onClick={() => {
              onSelectTab('track');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-all ${
              activeTab === 'track'
                ? 'bg-[#702C3B] text-white'
                : 'text-[#282321] hover:bg-[#F7F1E7]'
            }`}
          >
            <Activity className="w-5 h-5 text-[#2D6A4F]" />
            Live Bus Tracking
          </button>

          <div className="pt-2 border-t border-[#E5D8C8] flex items-center justify-between px-2 text-xs text-[#776E68]">
            <span>Simulation Engine:</span>
            <button
              onClick={onToggleSimulation}
              className="font-semibold text-[#702C3B] underline"
            >
              {simulationRunning ? 'Pause Simulation' : 'Resume Simulation'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Accessible aria-labels for mobile drawer navigation
