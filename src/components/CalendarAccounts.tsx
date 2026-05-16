import React, { useState, useRef, useEffect } from 'react';
import { TasksDatabaseModal } from './TasksDatabaseModal';
import { AddCalendarAccountModal } from './AddCalendarAccountModal';

export const CalendarAccounts = () => {
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isAddCalendarModalOpen, setIsAddCalendarModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const [calendars, setCalendars] = useState([
    { id: '1', name: 'einhart2312@gmail.com', label: 'Default', color: '#3EA8FF', checked: true, isDefault: true },
    { id: '2', name: 'Family', color: '#A2D04C', checked: true },
    { id: '3', name: 'Ngày lễ ở Việt Nam', color: '#42C873', checked: true, isHoliday: true },
  ]);

  const toggleCalendar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendars(calendars.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const renderIcon = (c: { id: string, name: string, label?: string, color: string, checked: boolean, isDefault?: boolean, isHoliday?: boolean }) => {
    if (c.isHoliday) {
      return (
        <div className="flex items-center justify-center w-[14px] h-[14px] shrink-0" style={{ color: c.color }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="2" fill="currentColor"></circle>
          </svg>
        </div>
      );
    }

    return (
      <div 
        className="w-[14px] h-[14px] rounded-[3.5px] shrink-0 flex items-center justify-center"
        style={{ backgroundColor: c.color }}
      >
        {c.isDefault && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 w-full px-2 mt-3 select-none overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Account Selector */}
        <div 
          className="flex items-center justify-between w-full h-8 px-2 bg-[#f2f2f2] rounded-md hover:bg-[#e8e8e8] cursor-pointer mb-1 group transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#333333]">
            einhart2312@gmail.com
            <div className="relative flex items-center">
              <button 
                className="flex items-center justify-center hover:bg-neutral-300/50 rounded w-4 h-4 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
            </div>
          </div>
          <button 
            className="text-neutral-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-300/50 rounded w-5 h-5"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
            </svg>
          </button>
        </div>

        {/* Calendars List */}
        <div 
          className={`grid transition-all duration-200 ease-in-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100 mb-1.5 mt-0.5' : 'grid-rows-[0fr] opacity-0 mb-0 mt-0'
          }`}
        >
          <div className="overflow-hidden flex flex-col gap-0.5">
            {calendars.map((c) => (
              <div 
                key={c.id}
                className="flex items-center justify-between w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {renderIcon(c)}
                  <span className={`text-[13px] truncate max-w-[130px] transition-colors ${c.checked ? 'text-[#333333]' : 'text-[#a0a0a0]'}`}>
                    {c.id === '1' ? 'einhart2312@gma...' : c.name}
                  </span>
                </div>
                
                <div className="flex items-center shrink-0 h-full">
                  {c.checked ? (
                    <>
                      {/* Hover icons */}
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-100 pl-1">
                        <button 
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-200/80 text-[#8c8c8c] transition-colors mr-[2px]"
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle></svg>
                        </button>
                        <button 
                          className="w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-200/80 text-[#8c8c8c] transition-colors"
                          onClick={(e) => toggleCalendar(c.id, e)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </div>
                      {/* Label visible only when not hovered */}
                      {c.label && (
                        <span className={`text-[13px] group-hover:hidden transition-colors text-[#b3b3b3] ml-1`}>{c.label}</span>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center">
                      <button 
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-200/80 text-[#8c8c8c] transition-colors mr-[2px] opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle></svg>
                      </button>
                      <button 
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-neutral-200/80 text-[#8c8c8c] transition-colors"
                        onClick={(e) => toggleCalendar(c.id, e)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add calendar account inline */}
            <div 
              className="flex items-center gap-2.5 w-full h-7 px-2 mt-0.5 hover:bg-neutral-100 rounded cursor-pointer text-neutral-400 transition-colors"
              onClick={() => setIsAddCalendarModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-400">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span className="text-[13px] font-medium text-[#777777] transition-colors">Add calendar account</span>
            </div>
          </div>
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
          <span className="text-[13px] font-medium text-[#777777]">Add Notion database</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-neutral-200/60 -mx-2 my-2.5"></div>

        {/* Notion apps */}
        <div className="px-2 mt-3 mb-1 text-[12px] font-medium text-[#8f8f8f]">
          Notion apps
        </div>
        <a href="https://www.notion.so/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer text-[#666666] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-400">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <path d="M8 7v10l8-10v10"/>
          </svg>
          <span className="text-[13px]">Notion</span>
        </a>
        <a href="https://app.notion.com/login/mail?redirectURL=https%3a%2f%2fmail.notion.com%2finbox&error=true" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full h-7 px-2 hover:bg-neutral-100 rounded cursor-pointer text-[#666666] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-400">
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            <line x1="22" y1="2" x2="11" y2="13"></line>
          </svg>
          <span className="text-[13px]">Notion Mail</span>
        </a>
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
      <AddCalendarAccountModal
        isOpen={isAddCalendarModalOpen}
        onClose={() => setIsAddCalendarModalOpen(false)}
      />
    </div>
  );
};

