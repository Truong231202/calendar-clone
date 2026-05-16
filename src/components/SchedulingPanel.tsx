import React from 'react';

interface SchedulingPanelProps {
  onClose?: () => void;
  onCreateRecurringLink?: () => void;
}

export const SchedulingPanel = ({ onClose, onCreateRecurringLink }: SchedulingPanelProps) => {
  return (
    <div className="w-[300px] h-full bg-white border-r border-neutral-200 flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-[13px] font-semibold text-neutral-800">
          Scheduling
        </div>
        <div className="flex items-center gap-1">
          <button className="group relative flex items-center justify-center w-[26px] h-[26px] rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="17" x2="12" y2="22"></line>
              <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.87l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
            </svg>
            <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-[12px] font-semibold rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity delay-75 z-50 whitespace-nowrap">
              Pin
            </div>
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="group relative flex items-center justify-center w-[26px] h-[26px] rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m11 17-5-5 5-5"></path>
              <path d="m18 17-5-5 5-5"></path>
            </svg>
            <div className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A1A] text-white text-[12px] font-semibold rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity delay-75 z-50 whitespace-nowrap">
              Close
            </div>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="px-3 mt-1">
        <p className="text-[13px] font-normal mb-3 leading-[18px] ">
          Create scheduling links to quickly find times to meet
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onCreateRecurringLink}
            className="w-full h-8 flex items-center justify-center bg-[#3985D3] hover:bg-[#2b65ce] text-white rounded-[5px] transition-colors"
          >
            <div className="text-[13px] font-medium">Create recurring link</div>
          </button>

          <button
            type="button"
            className="w-full h-8 flex items-center justify-center relative bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] border border-neutral-200 hover:bg-neutral-50 rounded-[5px] transition-colors text-neutral-800"
          >
            <div className="text-[13px] font-medium">Create one-off link</div>
            <div className="absolute right-1.5 flex items-center">
              <span className="inline-flex items-center justify-center bg-neutral-50 border border-neutral-200 rounded text-neutral-400 text-[10px] font-medium h-[18px] min-w-[18px] px-1">
                S
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
