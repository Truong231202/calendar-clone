import React, { useState } from 'react';
import { TasksDatabaseModal } from './TasksDatabaseModal';

export const CalendarAccounts = () => {
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col flex-1 w-full px-2 mt-3 select-none overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Account Selector */}
        <div className="flex items-center justify-between w-full h-8 px-2 bg-neutral-100 rounded-md hover:bg-neutral-200/50 cursor-pointer mb-1 group">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-600">
            einhart2312@gmail.com
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
          <div className="text-neutral-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
            </svg>
          </div>
        </div>

        {/* Calendars List */}
        <div className="flex flex-col gap-0.5 mb-1.5">
          {/* Calendar 1 */}
          <div className="flex items-center justify-between w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer group">
            <div className="flex items-center gap-2 truncate">
              <div className="w-[14px] h-[14px] rounded-[4px] bg-[#3EA8FF] shrink-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="text-[13px] text-[#b3b3b3] truncate max-w-[120px]">
                einhart2312@gmail....
              </span>
            </div>
            <span className="text-[12px] text-neutral-300">Default</span>
          </div>
          
          {/* Calendar 2 */}
          <div className="flex items-center w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer group">
            <div className="flex items-center gap-2 truncate">
              <div className="w-[14px] h-[14px] rounded-[4px] bg-[#A2D04C] shrink-0"></div>
              <span className="text-[13px] text-[#b3b3b3] truncate">Family</span>
            </div>
          </div>

          {/* Calendar 3 */}
          <div className="flex items-center w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer group">
            <div className="flex items-center gap-2 truncate">
              <div className="flex items-center justify-center w-[14px] h-[14px] text-[#42C873] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11a9 9 0 0 1 9 9"></path>
                  <path d="M4 4a16 16 0 0 1 16 16"></path>
                  <circle cx="5" cy="19" r="2" fill="currentColor"></circle>
                </svg>
              </div>
              <span className="text-[13px] text-[#b3b3b3] truncate">Ngày lễ ở Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Add calendar account */}
        <div className="flex items-center gap-2 w-full h-7 px-2 mt-1 hover:bg-neutral-100 rounded cursor-pointer text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span className="text-[13px] font-medium text-[#8f8f8f]">Add calendar account</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-200/60 -mx-2 my-2.5"></div>

        {/* Add Notion database */}
        <div 
          className="flex items-center gap-2 w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer text-neutral-400"
          onClick={() => setIsTasksModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <path d="M13 12l4-4m0 0v4m0-4h-4"></path>
          </svg>
          <span className="text-[13px] font-medium text-[#8f8f8f]">Add Notion database</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-200/60 -mx-2 my-2.5"></div>

        {/* Notion apps */}
        <div className="px-2 mt-3 mb-1 text-[12px] font-medium text-[#8f8f8f]">
          Notion apps
        </div>
        <div className="flex items-center gap-2 w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer text-[#b3b3b3]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <path d="M8 7v10l8-10v10"/>
          </svg>
          <span className="text-[13px]">Notion</span>
        </div>
        <div className="flex items-center gap-2 w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer text-[#b3b3b3]">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            <line x1="22" y1="2" x2="11" y2="13"></line>
          </svg>
          <span className="text-[13px]">Notion Mail</span>
        </div>
      </div>

      {/* Footer / Help Icon */}
      <div className="mt-auto px-2 pb-3 pt-2 w-full flex items-center justify-start border-t border-transparent">
        <button className="relative flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-100 text-neutral-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div className="absolute top-0 right-0 w-[5px] h-[5px] bg-[#ef4444] rounded-full border border-white"></div>
        </button>
      </div>

      <TasksDatabaseModal 
        isOpen={isTasksModalOpen} 
        onClose={() => setIsTasksModalOpen(false)} 
      />
    </div>
  );
};
