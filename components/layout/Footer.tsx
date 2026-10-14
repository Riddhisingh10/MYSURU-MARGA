'use client';

import React from 'react';
import { Bus, ShieldAlert, Cpu, Heart } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFFCF7] border-t border-[#E5D8C8] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#702C3B] flex items-center justify-center text-white">
                <Bus className="w-4 h-4 text-[#F7F1E7]" />
              </div>
              <span className="text-lg font-bold text-[#282321]">
                Mysuru <span className="text-[#702C3B]">Marga</span>
              </span>
            </div>
            <p className="text-sm text-[#776E68] leading-relaxed">
              {BRAND.tagline}
            </p>
            <p className="text-xs text-[#776E68]">
              {BRAND.kannadaTagline}
            </p>
          </div>

          {/* Column 2: Demo Notice */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#B07D14]">
              <ShieldAlert className="w-4 h-4" />
              <span>Simulated Prototype</span>
            </div>
            <p className="text-xs text-[#776E68] leading-relaxed">
              All routes, schedules, stops, and bus coordinates shown on this platform are demonstration data for architectural evaluation. Do not rely on this data for actual city travel until verified official feeds are connected.
            </p>
          </div>

          {/* Column 3: Future Hardware Architecture */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#702C3B]">
              <Cpu className="w-4 h-4" />
              <span>Future GPS Ready</span>
            </div>
            <p className="text-xs text-[#776E68] leading-relaxed">
              Engineered with clean TypeScript interfaces (<code className="bg-[#F7F1E7] px-1 py-0.5 rounded text-[11px]">IBusLocationService</code>). When GPS hardware is installed on buses, the data ingestion pipeline connects via WebSocket without UI modifications.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E5D8C8] flex flex-col sm:flex-row items-center justify-between text-xs text-[#776E68] gap-3">
          <div>
            © 2026 Mysuru Marga. Built for the citizens and visitors of Mysuru.
          </div>
          <div className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-[#702C3B] fill-current" /> for Mysuru, Karnataka
          </div>
        </div>
      </div>
    </footer>
  );
};
