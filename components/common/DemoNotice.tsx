'use client';

import React, { useState } from 'react';
import { Info, X, ChevronRight, Server, Radio, Database } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export const DemoNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-[#FFFCF7] border-b border-[#E5D8C8] px-4 py-2 sm:py-2.5 text-xs text-[#776E68]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B07D14]/15 text-[#B07D14] uppercase tracking-wider">
              Demo Mode
            </span>
            <span className="hidden sm:inline font-medium text-[#282321]">
              Simulated Data:
            </span>
            <span className="truncate max-w-md sm:max-w-xl">
              Bus locations, routes and schedules are simulated demonstration models.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchModal(true)}
              className="text-[#702C3B] font-semibold hover:underline flex items-center gap-1"
            >
              Future GPS Pipeline <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded text-[#776E68] hover:text-[#282321]"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Architecture Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFCF7] border border-[#E5D8C8] rounded-2xl max-w-xl w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowArchModal(false)}
              className="absolute top-4 right-4 p-2 text-[#776E68] hover:text-[#282321] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#702C3B]/10 flex items-center justify-center text-[#702C3B]">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#282321]">
                  Mysuru Marga Hardware Pipeline
                </h3>
                <p className="text-xs text-[#776E68]">
                  From Physical Bus GPS Tracker to Passenger Screen
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-[#282321] leading-relaxed">
              <div className="bg-[#F7F1E7] p-3.5 rounded-xl border border-[#E5D8C8] space-y-2">
                <div className="font-semibold text-sm text-[#702C3B] flex items-center gap-2">
                  <Radio className="w-4 h-4" /> Planned Data Flow
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[11px] pt-1">
                  <div className="p-2 bg-white rounded-lg border border-[#E5D8C8]">
                    <span className="font-bold block text-[#702C3B]">1. In-Bus GPS</span>
                    AIS-140 Tracker on bus OBD/Battery
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#E5D8C8]">
                    <span className="font-bold block text-[#702C3B]">2. Cellular</span>
                    4G GSM MQTT / TCP packets
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#E5D8C8]">
                    <span className="font-bold block text-[#702C3B]">3. Cloud API</span>
                    Validation & ETA engine
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-[#E5D8C8]">
                    <span className="font-bold block text-[#702C3B]">4. Passenger Web</span>
                    WebSocket / SSE subscriptions
                  </div>
                </div>
              </div>

              <p>
                <strong>Current State:</strong> The current build runs on our high-fidelity client-side{' '}
                <code className="bg-[#F7F1E7] px-1 py-0.5 rounded text-[#702C3B]">
                  MockBusLocationService
                </code>
                , calculating smooth road-following interpolations and dynamic ETAs across Mysuru.
              </p>
              <p>
                <strong>Zero UI Rewrite:</strong> Because the map, journey cards, and tracking views strictly implement{' '}
                <code className="bg-[#F7F1E7] px-1 py-0.5 rounded text-[#702C3B]">
                  IBusLocationService
                </code>
                , switching to a live WebSocket feed requires updating only the underlying service implementation.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-4 py-2 bg-[#702C3B] text-white text-xs font-semibold rounded-lg hover:bg-[#8D4554] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Dismiss state persisted in memory
