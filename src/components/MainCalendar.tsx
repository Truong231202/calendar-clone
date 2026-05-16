import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Menu } from "lucide-react";

const timezones = [
  { gmt: "GMT−07:00", label: "Pacific Daylight Time – Los Angeles" },
  { gmt: "GMT−04:00", label: "Eastern Daylight Time – New York" },
  { gmt: "GMT+01:00", label: "British Summer Time – London" },
  { gmt: "GMT+02:00", label: "Central European Summer Time – Brussels" },
  { gmt: "GMT+05:30", label: "India Standard Time – Kolkata" },
  { gmt: "GMT−11:00", label: "American Samoa Standard Time – Midway" },
  { gmt: "GMT−11:00", label: "Niue Time – Niue" },
  { gmt: "GMT−11:00", label: "American Samoa Standard Time – Pago Pago" },
  { gmt: "GMT−10:00", label: "Hawaii-Aleutian Standard Time – Honolulu" },
  { gmt: "GMT−10:00", label: "Cook Islands Standard Time – Rarotonga" },
  { gmt: "GMT−10:00", label: "Tahiti Time – Tahiti" },
  { gmt: "GMT−09:30", label: "Marquesas Time – Marquesas" },
  { gmt: "GMT−09:00", label: "Hawaii-Aleutian Daylight Time – Adak" },
  { gmt: "GMT−09:00", label: "Gambier Time – Gambier" },
  { gmt: "GMT−08:00", label: "Alaska Daylight Time – Anchorage" },
  { gmt: "GMT−08:00", label: "Alaska Daylight Time – Juneau" },
];

export function MainCalendar({ 
  baseDate, 
  setBaseDate, 
  selectedDate,
  isRightSidebarOpen = true, 
  onOpenRightSidebar, 
  isLeftSidebarOpen = true, 
  onOpenLeftSidebar,
  isRecurringMode = false,
  events = [],
  setEvents,
  onEventClick,
  onCreateEventClick
}: { 
  baseDate: Date, 
  setBaseDate: (date: Date) => void,
  selectedDate?: Date | null,
  isRightSidebarOpen?: boolean, 
  onOpenRightSidebar?: () => void, 
  isLeftSidebarOpen?: boolean, 
  onOpenLeftSidebar?: () => void,
  isRecurringMode?: boolean,
  events?: any[],
  setEvents?: (events: any[]) => void,
  onEventClick?: (event: any, coords: { x: number, y: number }) => void,
  onCreateEventClick?: (date: string, startTime: string, coords: { x: number, y: number }) => void
}) {
  const [isWeekDropdownOpen, setIsWeekDropdownOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, date: string, startTime: string } | null>(null);
  const [visibleDays, setVisibleDays] = useState(7);
  const [isDaysMenuOpen, setIsDaysMenuOpen] = useState(false);
  const [isTimezoneContextMenuOpen, setIsTimezoneContextMenuOpen] = useState(false);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
  const [isTimezonePickerOpen, setIsTimezonePickerOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Update the time every minute to keep the red line in sync
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const timeIndicatorTop = currentHours * 48 + (currentMinutes / 60) * 48;
  const displayCurrentHour = currentHours > 12 ? currentHours - 12 : (currentHours === 0 ? 12 : currentHours);
  const currentAmpm = currentHours >= 12 ? "PM" : "AM";
  const displayCurrentMinutes = currentMinutes.toString().padStart(2, '0');

  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());

  const days = Array.from({ length: visibleDays }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      fullDate: d,
      isCurrent: d.toDateString() === new Date().toDateString(),
    };
  });

  const displayMonth = startOfWeek.toLocaleDateString('en-US', { month: 'long' });
  const displayYear = startOfWeek.getFullYear();

  const handlePrevWeek = () => {
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() - visibleDays);
    setBaseDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + visibleDays);
    setBaseDate(newDate);
  };

  const handleToday = () => {
    setBaseDate(new Date());
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const parseTime = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(" ");
    if (parts.length < 2) return 0;
    const time = parts[0];
    const ampm = parts[1];
    const timeParts = time.split(":");
    let h = parseInt(timeParts[0]);
    const m = timeParts[1] ? parseInt(timeParts[1]) : 0;
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h + m / 60;
  };

  return (
    <div className="flex-1 h-full bg-white flex flex-col min-w-0 font-sans text-neutral-800">
      {/* Header */}
      <header className="flex-none flex flex-col shrink-0 pb-[2px] pl-[20px]">
        {/* Top Row: Controls */}
        <div className="flex justify-between items-center ">
          <div className="flex-1 flex items-center h-[26px]">
            {/* Toggle Left Sidebar Buttons Group (Animated) */}
            <div
              className={`flex items-center space-x-1 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isLeftSidebarOpen ? 'max-w-0 opacity-0 mr-0' : 'max-w-[120px] opacity-100 mr-3'
                }`}
            >
              <button
                onClick={onOpenLeftSidebar}
                className="flex items-center justify-center w-7 h-[26px] rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors border border-transparent hover:border-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '18px', height: '18px' }}>
                  <path fill="currentColor" d="M16.25 3.625c1.174 0 2.125.951 2.125 2.125v8.5a2.125 2.125 0 0 1-2.125 2.125H3.75a2.125 2.125 0 0 1-2.125-2.125v-8.5c0-1.174.951-2.125 2.125-2.125h12.5Zm-12.5 1.25a.875.875 0 0 0-.875.875v8.5c0 .483.392.875.875.875h2.7V4.875h-2.7Zm3.8 10.25h8.7a.875.875 0 0 0 .875-.875v-8.5a.875.875 0 0 0-.875-.875h-8.7v10.25Z"></path>
                </svg>
              </button>
              <button
                className="flex items-center justify-center w-7 h-[26px] rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors border border-transparent hover:border-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '18px', height: '18px' }}>
                  <path fill="currentColor" d="M8.875 2.625a6.25 6.25 0 1 0 3.955 11.09l3.983 3.982a.625.625 0 1 0 .884-.884l-3.983-3.982a6.25 6.25 0 0 0-4.84-10.206Zm-5 6.25a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"></path>
                </svg>
              </button>
              <button
                className="flex items-center justify-center w-7 h-[26px] rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors border border-transparent hover:border-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '18px', height: '18px' }}>
                  <path fill="currentColor" d="m16.774 4.341-.59.589-1.109-1.11.596-.594a.784.784 0 0 1 1.103 0c.302.302.302.8 0 1.102v.013ZM8.65 12.462l6.816-6.813-1.11-1.11-6.822 6.808a1.081 1.081 0 0 0-.236.393l-.289.932c-.052.196.131.38.315.314l.932-.288a.882.882 0 0 0 .394-.236Z"></path>
                  <path fill="currentColor" d="M4.375 6.25c0-1.036.84-1.875 1.875-1.875H11a.625.625 0 1 0 0-1.25H6.25A3.125 3.125 0 0 0 3.125 6.25v7.5c0 1.726 1.4 3.125 3.125 3.125h7.5c1.726 0 3.125-1.4 3.125-3.125V9a.625.625 0 1 0-1.25 0v4.75c0 1.036-.84 1.875-1.875 1.875h-7.5a1.875 1.875 0 0 1-1.875-1.875v-7.5Z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2 pb-1 pr-[10px]">
            {/* Avatar */}
            <button className="w-7 h-7 rounded-full bg-orange-200 overflow-hidden border border-neutral-200 flex items-center justify-center mr-1">
              <span className="text-[12px]">👨‍💻</span>
            </button>

            {/* Week Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsWeekDropdownOpen(!isWeekDropdownOpen)}
                className="h-[26px] px-2.5 rounded-md text-[13px] font-medium flex items-center bg-gradient-to-b from-white to-[#f5f5f5] hover:from-[#f9f9f9] hover:to-[#ebebeb] transition-colors border border-[#e5e5e5] shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-neutral-800"
              >
                Week
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="ml-1 text-neutral-500" style={{ width: '14px', height: '14px' }}><path fill="currentColor" d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.628.628 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88Z"></path></svg>
              </button>

              {isWeekDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsWeekDropdownOpen(false)}></div>
                  <div className="absolute top-[calc(100%+4px)] left-0 w-[240px] bg-[#272727] text-white rounded-[8px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] py-[5px] z-50 font-sans border border-[#3d3d3d]">
                    <div className="flex flex-col">
                      <div className="flex items-center px-1.5 py-[5px] mx-1 hover:bg-[#3b3b3b] rounded-[4px] cursor-pointer group">
                        <div className="w-[28px] shrink-0"></div>
                        <div className="flex-1 text-[13px] text-[#dfdfdf]">Day</div>
                        <div className="text-[12px] font-medium text-[#888888] pr-1">1 or D</div>
                      </div>
                      <div className="flex items-center px-1.5 py-[5px] mx-1 hover:bg-[#3b3b3b] rounded-[4px] cursor-pointer group">
                        <div className="w-[28px] shrink-0 flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '16px', height: '16px' }}><path fill="currentColor" d="M15.784 4.002a.625.625 0 0 1 .214.857L9.444 15.784a.625.625 0 0 1-1.01.085l-4.37-5.098a.625.625 0 0 1 .948-.814l3.806 4.44 6.109-10.181a.625.625 0 0 1 .857-.214Z"></path></svg>
                        </div>
                        <div className="flex-1 text-[13px] text-[#dfdfdf]">Week</div>
                        <div className="text-[12px] font-medium text-[#888888] pr-1">0 or W</div>
                      </div>
                      <div className="flex items-center px-1.5 py-[5px] mx-1 hover:bg-[#3b3b3b] rounded-[4px] cursor-pointer group">
                        <div className="w-[28px] shrink-0"></div>
                        <div className="flex-1 text-[13px] text-[#dfdfdf]">Month</div>
                        <div className="text-[12px] font-medium text-[#888888] pr-1">M</div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#3d3d3d] mx-2 my-1"></div>

                    <div className="flex flex-col">
                      <div className="flex items-center px-1.5 py-[5px] mx-1 hover:bg-[#3b3b3b] rounded-[4px] cursor-pointer group">
                        <div className="w-[28px] shrink-0"></div>
                        <div className="flex-1 text-[13px] text-[#dfdfdf]">Number of days</div>
                        <div className="text-[#888888] pr-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" style={{ width: '14px', height: '14px' }}><path fill="currentColor" d="M6.722 3.238a.625.625 0 1 0-.884.884L9.716 8l-3.878 3.878a.625.625 0 0 0 .884.884l4.32-4.32a.625.625 0 0 0 0-.884l-4.32-4.32Z"></path></svg>
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-[#3d3d3d] mx-2 my-1"></div>

                    <div className="flex flex-col">
                      <div className="flex items-center px-1.5 py-[5px] mx-1 hover:bg-[#3b3b3b] rounded-[4px] cursor-pointer group">
                        <div className="w-[28px] shrink-0"></div>
                        <div className="flex-1 text-[13px] text-[#dfdfdf]">View settings</div>
                        <div className="text-[#888888] pr-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" style={{ width: '14px', height: '14px' }}><path fill="currentColor" d="M6.722 3.238a.625.625 0 1 0-.884.884L9.716 8l-3.878 3.878a.625.625 0 0 0 .884.884l4.32-4.32a.625.625 0 0 0 0-.884l-4.32-4.32Z"></path></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Today Button */}
            <button 
              onClick={handleToday}
              className="h-[26px] px-2.5 rounded-md text-[13px] font-medium bg-gradient-to-b from-white to-[#f5f5f5] hover:from-[#f9f9f9] hover:to-[#ebebeb] transition-colors border border-[#e5e5e5] shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-neutral-800"
            >
              Today
            </button>

            {/* Nav Arrows */}
            <div className="flex items-center space-x-1 pl-1">
              <button 
                onClick={handlePrevWeek}
                className="w-7 h-[26px] rounded flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors border border-transparent hover:border-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '18px', height: '18px' }}><path fill="currentColor" d="M6.308 9.558a.625.625 0 0 0 0 .884l5.4 5.4a.625.625 0 1 0 .884-.884L7.634 10l4.958-4.958a.625.625 0 1 0-.884-.884l-5.4 5.4Z"></path></svg>
              </button>
              <button 
                onClick={handleNextWeek}
                className="w-7 h-[26px] rounded flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors border border-transparent hover:border-neutral-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" style={{ width: '18px', height: '18px' }}><path fill="currentColor" d="M13.692 10.442a.625.625 0 0 0 0-.884l-5.4-5.4a.625.625 0 1 0-.884.884L12.366 10l-4.958 4.958a.625.625 0 0 0 .884.884l5.4-5.4Z"></path></svg>
              </button>
              {/* Toggle Right Sidebar Button (Animated) */}
              <div
                className={`flex items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${isRightSidebarOpen ? 'w-0 opacity-0 ml-0 border-l-0' : 'w-7 opacity-100 ml-2'
                  }`}
              >
                <button
                  onClick={onOpenRightSidebar}
                  className="w-7 h-[26px] shrink-0 rounded flex items-center justify-center hover:bg-neutral-100 text-neutral-500 transition-colors border border-transparent hover:border-neutral-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px]">
                    <path fill="currentColor" d="M16.25 3.625c1.174 0 2.125.951 2.125 2.125v8.5a2.125 2.125 0 0 1-2.125 2.125H3.75a2.125 2.125 0 0 1-2.125-2.125v-8.5c0-1.174.951-2.125 2.125-2.125h12.5Zm-12.5 1.25a.875.875 0 0 0-.875.875v8.5c0 .483.392.875.875.875h8.7V4.875h-8.7Zm9.8 10.25h2.7a.875.875 0 0 0 .875-.875v-8.5a.875.875 0 0 0-.875-.875h-2.7v10.25Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Month/Year */}
        <div className="text-[22px] text-neutral-900 leading-none font-bold">
          {displayMonth} {displayYear}
        </div>
      </header>

      {/* Grid Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Grid Header Area */}
        <div className="flex-none flex flex-col border-b border-neutral-200 z-30 bg-white">

          {/* Row 1: Days of Week + GMT */}
          <div className="flex h-[32px] border-b border-neutral-200 relative">
            {/* Top Left Corner (GMT+7) */}
            <div className="w-[72px] shrink-0 h-full">
              <div className="flex items-center justify-between w-full h-full pl-1 pr-2">
                {/* Add Timezone Button */}
                <div className="shrink-0 relative">
                  <button 
                    type="button" 
                    onClick={() => setIsTimezonePickerOpen(!isTimezonePickerOpen)}
                    className="flex items-center justify-center w-5 h-5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" style={{ width: '12px', height: '12px' }}>
                        <path fill="currentColor" d="M8 2.74a.66.66 0 0 1 .66.66v3.94h3.94a.66.66 0 0 1 0 1.32H8.66v3.94a.66.66 0 0 1-1.32 0V8.66H3.4a.66.66 0 0 1 0-1.32h3.94V3.4A.66.66 0 0 1 8 2.74Z"></path>
                      </svg>
                    </div>
                  </button>
                  
                  {/* Timezone Popover */}
                  {isTimezonePickerOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsTimezonePickerOpen(false)}></div>
                      <div className="absolute top-[100%] left-0 mt-1 w-[380px] bg-[#282828] text-white rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.3)] z-50 flex flex-col border border-[#3A3A3A] overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-left">
                        {/* Input */}
                        <div className="px-3 py-[7px] border-b border-[#3A3A3A] shrink-0">
                          <input 
                            type="text" 
                            placeholder="Time zone" 
                            autoFocus
                            className="w-full bg-transparent text-[13px] text-[#EEEEEE] placeholder:text-[#888888] outline-none" 
                          />
                        </div>
                        {/* List */}
                        <div className="h-[307px] overflow-y-auto [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-thumb]:bg-[#444] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-track]:bg-transparent">
                          <div className="flex flex-col">
                            {timezones.map((tz, i) => (
                              <div key={i} className="flex items-center px-3 py-1.5 hover:bg-[#3B3B3B] cursor-pointer group">
                                <div className="w-[85px] text-[13px] text-[#888888] shrink-0 font-medium group-hover:text-[#A5A5A5] transition-colors">{tz.gmt}</div>
                                <div className="text-[13px] text-[#EEEEEE] truncate">{tz.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* GMT+7 Label */}
                <div className="relative">
                  <div 
                    data-context-menu="true" 
                    data-timezone-column="Asia/Bangkok" 
                    className={`flex items-center px-1.5 py-0.5 rounded cursor-pointer transition-colors group ${isTimezoneContextMenuOpen ? 'bg-neutral-200' : 'hover:bg-neutral-100'}`}
                    onClick={() => setIsTimezoneContextMenuOpen(!isTimezoneContextMenuOpen)}
                  >
                    <span className="text-[10px] font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors">GMT+7</span>
                  </div>
                  
                  {isTimezoneContextMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsTimezoneContextMenuOpen(false)}></div>
                      <div className="absolute top-[100%] left-0 mt-1 w-[260px] bg-[#282828] text-[#EEEEEE] rounded-[8px] shadow-[0_12px_40px_rgba(0,0,0,0.3)] z-50 flex flex-col py-1.5 border border-[#3A3A3A] font-sans">
                        <button 
                          className="flex items-center justify-between w-full text-left px-3 py-1.5 hover:bg-[#3B3B3B] transition-colors group"
                          onClick={() => {
                            setIsTimezoneContextMenuOpen(false);
                            setIsTimezonePickerOpen(true);
                          }}
                        >
                          <div className="flex items-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] mr-3 text-[#A0A0A0] group-hover:text-[#EEEEEE] transition-colors">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                              <path d="M2 12h20"></path>
                            </svg>
                            <span className="text-[13px] font-medium text-[#EEEEEE]">Change time zone</span>
                          </div>
                          <span className="text-[13px] text-[#888888] font-medium">Bangkok</span>
                        </button>
                        
                        <button className="flex items-center justify-between w-full text-left px-3 py-1.5 hover:bg-[#3B3B3B] transition-colors group">
                          <div className="flex items-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] mr-3 text-[#A0A0A0] group-hover:text-[#EEEEEE] transition-colors">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            <span className="text-[13px] font-medium text-[#EEEEEE]">Rename</span>
                          </div>
                          <span className="text-[13px] text-[#888888] font-medium">GMT+7</span>
                        </button>
                        
                        <div className="h-px bg-[#3A3A3A] my-1 mx-3"></div>
                        
                        <button className="flex items-center w-full text-left px-3 py-1.5 hover:bg-[#3B3B3B] transition-colors group">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[14px] h-[14px] mr-3 text-[#e05e5e]">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          <span className="text-[13px] font-medium text-[#e05e5e]">Remove time zone from list</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Day Headers */}
            <div className="flex-1 flex">
              {days.map((day, i) => {
                const ts = new Date(2026, 4, day.date).getTime();
                const isSelectedDay = selectedDate && day.fullDate.toDateString() === selectedDate.toDateString();
                return (
                  <div
                    key={i}
                    data-grid-date={ts}
                    className={`flex-1 transition-colors duration-500 ${isSelectedDay ? 'bg-[rgba(255,0,0,0.1)]' : ''}`}
                  >
                    <div className="h-full w-full flex items-end justify-center pb-1.5">
                      <div className="flex items-center cursor-pointer group">
                        {mounted && day.isCurrent ? (
                          <div className="flex items-center space-x-1 text-[12px] leading-none">
                            <span className="font-bold text-neutral-900">{day.name}</span>
                            <span className="bg-[#db4c3f] text-white font-bold px-1.5 py-0.5 rounded">{day.date}</span>
                          </div>
                        ) : (
                          <span className="text-[12px] font-medium leading-none text-[#737373] group-hover:text-[#333333] transition-colors">
                            {day.name} {day.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Collapse Weekends Button */}
            <div className="absolute right-1.5 bottom-[5px] bg-white z-20">
              <button 
                type="button"
                onClick={() => setIsDaysMenuOpen(!isDaysMenuOpen)}
                className="flex items-center justify-center w-5 h-5 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Change visible days"
              >
                <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '12px', height: '12px' }}>
                  <path d="M3 9.5h6M6 2v5M3 4.5h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>

              {isDaysMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDaysMenuOpen(false)}></div>
                  <div className="absolute top-[calc(100%+4px)] right-0 bg-[#282828] text-[#EEEEEE] rounded-[8px] shadow-[0_12px_40px_rgba(0,0,0,0.3)] z-50 flex items-center h-[32px] px-1 border border-[#3A3A3A]">
                    <button 
                      onClick={() => setVisibleDays(prev => Math.max(1, prev - 1))}
                      disabled={visibleDays <= 1}
                      className="w-7 h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#3B3B3B] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: '12px', height: '12px' }}><path d="M3 7.25h10v1.5H3z"></path></svg>
                    </button>
                    <div className="w-[28px] text-center text-[13px] font-medium leading-none select-none">
                      {visibleDays}
                    </div>
                    <button 
                      onClick={() => setVisibleDays(prev => Math.max(1, prev + 1))}
                      disabled={visibleDays >= 14}
                      className="w-7 h-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#3B3B3B] disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: '12px', height: '12px' }}><path d="M8.75 3v4.25H13v1.5H8.75V13h-1.5V8.75H3v-1.5h4.25V3h1.5z"></path></svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 2: All-day */}
          <div className="flex h-[25px]">
            {/* All-day label */}
            <div className="w-[72px] shrink-0 border-r border-neutral-200 flex items-center justify-end pr-2">
              <div className="text-[11px] text-neutral-400">All-day</div>
            </div>
            {/* All-day slots */}
            <div className="flex-1 flex">
              {days.map((day, i) => {
                const isSelectedDay = selectedDate && day.fullDate.toDateString() === selectedDate.toDateString();
                
                const dayAllDayEvents = events?.filter(e => {
                  if (!e.isAllDay) return false;
                  const eventDayMatch = e.date && e.date.includes(day.date.toString());
                  return eventDayMatch || (day.isCurrent === false && e.date === "today");
                }) || [];

                return (
                <div 
                  key={i} 
                  className={`flex-1 border-r border-neutral-200 h-full relative transition-colors duration-500 ${isSelectedDay ? 'bg-[rgba(255,0,0,0.1)] border-x border-red-500/50' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dataStr = e.dataTransfer.getData('text/plain');
                    if (!dataStr) return;
                    try {
                      const data = JSON.parse(dataStr);
                      if (setEvents && events) {
                        const monthShort = day.fullDate.toLocaleDateString('en-US', { month: 'short' });
                        const newDateStr = `${day.name} ${monthShort} ${day.date}`;
                        
                        const newEvents = events.map(ev => {
                          if (ev.id === data.id) {
                            return { ...ev, date: newDateStr, isAllDay: true };
                          }
                          return ev;
                        });
                        setEvents(newEvents);
                      }
                    } catch(err) {}
                  }}
                >
                  <div className="flex flex-col gap-[2px] px-1 py-0.5 w-full">
                    {dayAllDayEvents.map(event => (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          e.dataTransfer.setData('text/plain', JSON.stringify({ id: event.id, type: 'allday' }));
                        }}
                        className={`w-full rounded-[4px] px-1.5 h-[20px] flex items-center text-[12px] font-bold text-white truncate cursor-pointer overflow-hidden ${event.eventType === 'Birthday' ? 'bg-[#bce0fd]' : event.color || 'bg-[#3cb1ff]'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          if (onEventClick) onEventClick(event, { x: rect.right + 10, y: rect.top });
                        }}
                      >
                        {event.eventType === 'Birthday' && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 mr-1.5 shrink-0"><path d="M19 8h-2.18c.11-.31.18-.64.18-1 0-1.66-1.34-3-3-3-1.08 0-2.03.57-2.5 1.43C11.03 4.57 10.08 4 9 4 7.34 4 6 5.34 6 7c0 .36.07.69.18 1H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zM9 6c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM4 10h7v2H4v-2zm9 0h7v2h-7v-2zm-7 8v-6h7v6H6zm9 0v-6h7v6h-7z"/></svg>
                        )}
                        <span className="truncate leading-none pt-[1px]">{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Scrollable Grid Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex h-[1152px]"> {/* 24 hours * 48px */}

            {/* Time Axis */}
            <div className="w-[72px] shrink-0 border-r border-neutral-200 relative bg-white z-10">
              {hours.map(hour => {
                if (hour === 0) return null; // No 12 AM at the very top usually, or it's hidden
                const isPM = hour >= 12;
                const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                const ampm = isPM ? "PM" : "AM";

                return (
                  <div
                    key={hour}
                    className="absolute w-full flex justify-end pr-3"
                    style={{ top: `${hour * 48}px`, transform: 'translateY(-50%)' }}
                  >
                    <span className="text-[10px] text-neutral-400 flex items-baseline">
                      <span className="text-[11px] font-medium text-neutral-500 mr-0.5">{displayHour}</span>
                      {ampm}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Grid Columns */}
            <div className="flex-1 flex relative">
              {days.map((day, i) => {
                const ts = new Date(day.fullDate.getFullYear(), day.fullDate.getMonth(), day.fullDate.getDate()).getTime();
                const isSelectedDay = selectedDate && day.fullDate.toDateString() === selectedDate.toDateString();
                return (
                  <div
                    key={i}
                    data-grid-container="true"
                    data-grid-date={ts}
                    className={`flex-1 border-r border-neutral-200 relative transition-colors duration-500 ${isSelectedDay ? 'bg-[rgba(255,0,0,0.1)] border-x border-red-500/50' : ''}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dataStr = e.dataTransfer.getData('text/plain');
                      if (!dataStr) return;
                      try {
                        const data = JSON.parse(dataStr);
                        const monthShort = day.fullDate.toLocaleDateString('en-US', { month: 'short' });
                        const newDateStr = `${day.name} ${monthShort} ${day.date}`;

                        const rect = e.currentTarget.getBoundingClientRect();
                        const offsetY = data.offsetY || 0;
                        const yOffset = e.clientY - rect.top - offsetY;
                        const hourFloat = Math.max(0, yOffset / 48);
                        
                        const hour = Math.floor(hourFloat);
                        const minutes = Math.floor((hourFloat - hour) * 60);
                        const roundedMinutes = minutes < 15 ? 0 : (minutes < 45 ? 30 : 60);
                        
                        let finalHour = hour;
                        let finalMins = roundedMinutes;
                        if (finalMins === 60) {
                          finalHour += 1;
                          finalMins = 0;
                        }
                        
                        const startH = finalHour + finalMins / 60;
                        
                        const formatTimeLocal = (h: number) => {
                          let hr = Math.floor(h);
                          let min = Math.round((h - hr) * 60);
                          if (min === 60) { hr += 1; min = 0; }
                          if (hr >= 24) { hr = 23; min = 30; }
                          const ampm = hr >= 12 ? 'PM' : 'AM';
                          const displayHour = hr > 12 ? hr - 12 : (hr === 0 ? 12 : hr);
                          return `${displayHour}:${min.toString().padStart(2, '0')} ${ampm}`;
                        };
                        
                        const parseTimeLocal = (timeStr: string) => {
                          if (!timeStr) return 0;
                          const parts = timeStr.split(" ");
                          if (parts.length < 2) return 0;
                          const time = parts[0];
                          const ampm = parts[1];
                          const timeParts = time.split(":");
                          let h = parseInt(timeParts[0]);
                          const m = timeParts[1] ? parseInt(timeParts[1]) : 0;
                          if (ampm === "PM" && h < 12) h += 12;
                          if (ampm === "AM" && h === 12) h = 0;
                          return h + m / 60;
                        };

                        if (setEvents && events) {
                          const newEvents = events.map(ev => {
                            if (ev.id === data.id) {
                              let newStartTime = ev.startTime;
                              let newEndTime = ev.endTime;
                              
                              if (data.type === 'time') {
                                const oldStartH = parseTimeLocal(ev.startTime);
                                const oldEndH = parseTimeLocal(ev.endTime);
                                const duration = oldEndH - oldStartH;
                                
                                newStartTime = formatTimeLocal(startH);
                                newEndTime = formatTimeLocal(startH + duration);
                              }
                              
                              return { 
                                ...ev, 
                                date: newDateStr, 
                                isAllDay: false,
                                startTime: newStartTime,
                                endTime: newEndTime
                              };
                            }
                            return ev;
                          });
                          setEvents(newEvents);
                        }
                      } catch(err) {}
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const yOffset = e.clientY - rect.top;
                      const hourFloat = yOffset / 48;
                      const hour = Math.floor(hourFloat);
                      const minutes = Math.floor((hourFloat - hour) * 60);
                      // Round to nearest 30 mins
                      const roundedMinutes = minutes < 30 ? 0 : 30;
                      
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                      const startTime = `${displayHour}:${roundedMinutes === 0 ? '00' : '30'} ${ampm}`;
                      
                      const daysNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                      const dateStr = `${daysNames[i]} Apr ${day.date}`;
                      
                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        date: dateStr,
                        startTime
                      });
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="relative h-full w-full">
                        {/* Recurring Mode Indicator */}
                        {isRecurringMode && (
                          <div className="absolute inset-0 z-0 pointer-events-none">
                            {(i === 0 || i === 6) ? (
                              <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, #f0f0f0 4px, #f0f0f0 5px)' }}></div>
                            ) : (
                              <div className="w-full h-full flex flex-col">
                                <div className="w-full h-[432px]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, #f0f0f0 4px, #f0f0f0 5px)' }}></div>
                                <div className="w-[calc(100%-2px)] ml-[1px] h-[384px] bg-white border border-dashed border-[#bfe0fa] z-10 relative"></div>
                                <div className="w-full h-[336px]" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, #f0f0f0 4px, #f0f0f0 5px)' }}></div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Grid Lines */}
                        {hours.map(hour => (
                          <div
                            key={hour}
                            className="absolute w-full border-b border-neutral-100 z-0"
                            style={{ top: `calc(0px + 4px * ${hour * 12})` }}
                          ></div>
                        ))}

                        {/* Events */}
                        {events?.map(event => {
                          if (event.isAllDay) return null;
                          
                          // Match date
                          const eventDayMatch = event.date && event.date.includes(day.date.toString());
                          // Quick match to make sure it only shows on the right day
                          if (!eventDayMatch && day.isCurrent === false && event.date !== "today") return null;

                          const startH = parseTime(event.startTime);
                          const endH = parseTime(event.endTime);
                          const top = startH * 48;
                          const height = Math.max((endH - startH) * 48, 20); // min height 20px

                          return (
                            <div 
                              key={event.id}
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                const offsetY = e.clientY - rect.top;
                                e.dataTransfer.setData('text/plain', JSON.stringify({ id: event.id, type: 'time', offsetY }));
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const rect = e.currentTarget.getBoundingClientRect();
                                if (onEventClick) onEventClick(event, { x: rect.right + 10, y: rect.top });
                              }}
                              className={`absolute left-0 right-2 bg-[#3cb1ff] rounded-[4px] px-1.5 py-0.5 text-white overflow-hidden pointer-events-auto cursor-pointer border border-[#1b9aea] z-20 hover:brightness-95 transition-all`}
                              style={{ top: `${top}px`, height: `${height}px` }}
                            >
                              <div className="text-[12px] font-bold leading-tight truncate">{event.title}</div>
                              <div className="text-[11px] opacity-90 leading-tight truncate">{event.startTime} - {event.endTime}</div>
                            </div>
                          );
                        })}

                        {/* Current Time / Past Time Indicator */}
                        {mounted && (
                          <div className="absolute w-full z-10">
                            <div className="absolute w-full" style={{ top: day.isCurrent ? `${timeIndicatorTop}px` : '0px', display: day.isCurrent ? 'block' : 'none' }}>
                              <div className="absolute w-full bg-neutral-100/40" style={{ opacity: 0.3, transform: 'translateY(-100%)', height: `${timeIndicatorTop}px` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Current Time Label (floating on time axis) */}
              {mounted && (
                <div
                  className="absolute left-[-72px] w-[72px] flex justify-end pr-2 z-20 pointer-events-none"
                  style={{ top: `${timeIndicatorTop}px`, transform: 'translateY(-50%)' }}
                >
                  <div className="text-[#db4c3f] text-[10px] font-bold bg-white px-1">
                    {displayCurrentHour}:<span className="text-[10px]">{displayCurrentMinutes}</span><span className="text-[8px] ml-0.5 opacity-90">{currentAmpm}</span>
                  </div>
                </div>
              )}

              {/* Global Red Line */}
              {mounted && (
                <div
                  className="absolute left-0 right-0 border-t-[1.5px] border-[#db4c3f] z-10 pointer-events-none"
                  style={{ top: `${timeIndicatorTop}px` }}
                >
                  {/* Red dot on current day */}
                  {days.findIndex(d => d.isCurrent) !== -1 && (
                    <div 
                      className="absolute w-2 h-2 bg-[#db4c3f] rounded-full -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `calc((100% / ${visibleDays}) * ${days.findIndex(d => d.isCurrent)})` }}
                    ></div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[100] bg-[#2d2d2d] border border-[#3f3f3f] rounded-[8px] py-1 shadow-[0_4px_12px_rgba(0,0,0,0.3)] w-[200px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button 
            className="w-full text-left px-3 py-1.5 hover:bg-[#3f3f3f] flex items-center justify-between group transition-colors"
            onClick={() => {
              if (onCreateEventClick) onCreateEventClick(contextMenu.date, contextMenu.startTime, { x: contextMenu.x + 50, y: contextMenu.y });
            }}
          >
            <span className="text-[13px] text-[#ebebeb]">Create event</span>
            <span className="text-[12px] text-[#a0a0a0] font-medium font-sans opacity-0 group-hover:opacity-100 transition-opacity">C</span>
          </button>
          <button 
            disabled
            className="w-full text-left px-3 py-1.5 flex items-center justify-between opacity-50 cursor-not-allowed"
          >
            <span className="text-[13px] text-[#a0a0a0]">Paste event</span>
            <span className="text-[12px] text-[#a0a0a0] font-medium font-sans">Ctrl V</span>
          </button>
        </div>
      )}
    </div>
  );
}
