import React from 'react';

interface SchedulingSectionProps {
  onSchedulingClick?: () => void;
}

export const SchedulingSection = ({ onSchedulingClick }: SchedulingSectionProps) => {
  return (
    <div className="px-3 pb-2 w-full">
      <div 
        role="button" 
        onClick={onSchedulingClick}
        className="flex items-center justify-between w-full h-8 px-2 rounded-md hover:bg-neutral-200/80 bg-neutral-200/50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="text-neutral-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px]">
              <path fill="currentColor" d="M10.61 3.61a3.776 3.776 0 0 1 5.34 0l.367.368a3.776 3.776 0 0 1 0 5.34l-1.852 1.853a.625.625 0 1 1-.884-.884l1.853-1.853a2.526 2.526 0 0 0 0-3.572l-.368-.367a2.526 2.526 0 0 0-3.572 0L9.641 6.347a.625.625 0 0 1-.883-.884l1.852-1.852Z"></path>
              <path fill="currentColor" d="M12.98 6.949a.625.625 0 0 1 0 .883l-5.45 5.449a.625.625 0 1 1-.884-.884l5.448-5.448a.625.625 0 0 1 .884 0Z"></path>
              <path fill="currentColor" d="M6.348 8.757a.625.625 0 0 1 0 .884l-1.853 1.853a2.526 2.526 0 0 0 0 3.572l.367.367a2.526 2.526 0 0 0 3.572 0l1.853-1.852a.625.625 0 1 1 .884.883l-1.853 1.853a3.776 3.776 0 0 1-5.34 0l-.367-.367a3.776 3.776 0 0 1 0-5.34l1.853-1.853a.625.625 0 0 1 .884 0Z"></path>
            </svg>
          </div>
          <div className="text-[13px] font-medium text-neutral-800">
            Scheduling
          </div>
        </div>
        
        <button 
          aria-label="Visibility"
          type="button" 
          className="flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-300/50 text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="w-[16px] h-[16px]">
            <path fill="currentColor" d="M8 5.372a2.626 2.626 0 0 1 2.625 2.626l-.014.269A2.626 2.626 0 0 1 8 10.624l-.269-.014A2.626 2.626 0 0 1 5.39 8.267l-.014-.269A2.626 2.626 0 0 1 8 5.372Zm0 1.75a.875.875 0 1 0 0 1.75.875.875 0 0 0 0-1.75Z"></path>
            <path fill="currentColor" d="M8 3.26c3.125 0 5.857 1.673 7.152 4.141l.065.144c.11.293.11.617 0 .91l-.065.145c-1.295 2.468-4.027 4.14-7.152 4.14-3.027 0-5.685-1.57-7.026-3.912L.848 8.6a1.29 1.29 0 0 1 0-1.199l.126-.228C2.314 4.83 4.972 3.26 8 3.26Zm0 1.252c-2.6 0-4.833 1.345-5.941 3.281l-.104.19a.04.04 0 0 0 0 .036l.104.189c1.108 1.935 3.34 3.281 5.941 3.281 2.684 0 4.976-1.434 6.045-3.47L14.05 8l-.005-.018c-1.069-2.036-3.36-3.47-6.045-3.47Z"></path>
          </svg>
        </button>
      </div>

      {/* Meet with... Input */}
      <div className="flex items-center gap-2 px-2 mt-1 h-8 w-full bg-[#f1f1f1] hover:bg-[#e8e8e8] transition-colors rounded-md group">
        <div className="text-neutral-400 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px]">
            <path fill="currentColor" d="M10 2.375c-1.137 0-2.054.47-2.674 1.242-.608.757-.9 1.765-.9 2.824 0 1.058.292 2.066.9 2.824.62.772 1.537 1.241 2.674 1.241s2.055-.469 2.675-1.241c.608-.758.9-1.766.9-2.824 0-1.059-.292-2.067-.9-2.824-.62-.773-1.538-1.242-2.675-1.242ZM7.676 6.441c0-.842.233-1.554.624-2.042.38-.473.937-.774 1.7-.774.763 0 1.32.301 1.7.774.391.488.624 1.2.624 2.042 0 .842-.233 1.554-.624 2.041-.38.473-.937.774-1.7.774-.763 0-1.32-.3-1.7-.774-.391-.487-.624-1.2-.624-2.041ZM10 11.63c-2.7 0-5.101 1.315-6.12 3.305-.361.706-.199 1.421.23 1.923.412.48 1.06.767 1.74.767h8.3c.68 0 1.328-.287 1.74-.767.429-.502.591-1.217.23-1.923-1.02-1.99-3.42-3.305-6.12-3.305Zm-5.007 3.875c.761-1.488 2.672-2.626 5.007-2.626 2.335 0 4.246 1.138 5.007 2.626.105.204.07.378-.067.54-.156.182-.448.33-.79.33h-8.3c-.342 0-.634-.148-.79-.33-.138-.162-.172-.336-.067-.54Z"></path>
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="Meet with…" 
          className="bg-transparent border-none outline-none w-full text-[13px] text-neutral-800 placeholder:text-neutral-400 h-full"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};
