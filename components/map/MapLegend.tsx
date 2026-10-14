'use client';

import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-[400] bg-[#FFFCF7]/95 backdrop-blur-sm border border-[#E5D8C8] rounded-xl p-3 shadow-md max-w-xs text-xs text-[#282321]">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between cursor-pointer font-semibold select-none pb-1"
      >
        <div className="flex items-center gap-1.5 text-[#702C3B]">
          <Layers className="w-3.5 h-3.5" />
          <span>Map Legend</span>
        </div>
        <button className="text-[#776E68] p-0.5">
          {collapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="space-y-2 mt-2 pt-2 border-t border-[#E5D8C8]/60 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#702C3B] text-white flex items-center justify-center font-bold text-[9px]">
              119
            </div>
            <span>Simulated Active Bus (with heading)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#702C3B] bg-white" />
            <span>Mysuru Bus Stop</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#2D6A4F] border border-white" />
            <span>Boarding Bus Stop</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#702C3B] border border-white" />
            <span>Destination Alighting Stop</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-1 rounded bg-[#702C3B]" />
            <span>Selected Bus Route Path</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-white" />
            <span>Your Current Location</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Collapsible state for mobile screen optimization
