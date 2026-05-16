import React, { useState } from "react";

type DayName = "Su" | "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa";

const defaultSchedule: Record<DayName, { active: boolean; slots: { start: string; end: string }[] }> = {
  Su: { active: false, slots: [{ start: "9 AM", end: "5 PM" }] },
  Mo: { active: true, slots: [{ start: "9 AM", end: "5 PM" }] },
  Tu: { active: true, slots: [{ start: "9 AM", end: "5 PM" }] },
  We: { active: true, slots: [{ start: "9 AM", end: "5 PM" }] },
  Th: { active: true, slots: [{ start: "9 AM", end: "5 PM" }] },
  Fr: { active: true, slots: [{ start: "9 AM", end: "5 PM" }] },
  Sa: { active: false, slots: [{ start: "9 AM", end: "5 PM" }] },
};

export const RecurringLinkView = ({ onBack }: { onBack: () => void }) => {
  const [isBookingWindowOpen, setIsBookingWindowOpen] = useState(false);
  const [isPhoneCallEnabled, setIsPhoneCallEnabled] = useState(false);
  const [minNotice, setMinNotice] = useState("1 hour");
  const [maxWindow, setMaxWindow] = useState("30 days");
  const [conferencing, setConferencing] = useState("Conferencing");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number, right: number } | null>(null);

  const [schedule, setSchedule] = useState(defaultSchedule);

  const addSlot = (day: DayName) => {
    setSchedule(prev => {
      const dayData = prev[day];
      const lastSlot = dayData.slots[dayData.slots.length - 1];

      let nextStart = "6 PM";
      let nextEnd = "7 PM";

      if (lastSlot && lastSlot.end) {
        const match = lastSlot.end.trim().match(/^(\d+)(?:\s*)(AM|PM|am|pm)?$/i);
        if (match) {
          let hour = parseInt(match[1], 10);
          const period = (match[2] || "AM").toUpperCase();
          if (hour === 12 && period === "AM") hour = 0;
          if (hour < 12 && period === "PM") hour += 12;

          let startHour = (hour + 1) % 24;
          let endHour = (hour + 2) % 24;

          const formatHour = (h: number) => {
            const p = h >= 12 ? "PM" : "AM";
            let h12 = h % 12;
            if (h12 === 0) h12 = 12;
            return `${h12} ${p}`;
          };

          nextStart = formatHour(startHour);
          nextEnd = formatHour(endHour);
        }
      }

      return {
        ...prev,
        [day]: {
          ...dayData,
          slots: [...dayData.slots, { start: nextStart, end: nextEnd }],
          active: true,
        }
      };
    });
  };

  const removeSlot = (day: DayName, index: number) => {
    setSchedule(prev => {
      const newSlots = prev[day].slots.filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: newSlots.length > 0 ? newSlots : [{ start: "9 AM", end: "5 PM" }],
          active: newSlots.length > 0
        }
      };
    });
  };

  const toggleDay = (day: DayName) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active
      }
    }));
  };

  const daysList: DayName[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const currentDayIndex = new Date().getDay();

  const minNoticeOptions = ["15 min", "30 min", "1 hour", "4 hours", "1 day"];
  const maxWindowOptions = ["7 days", "14 days", "30 days", "60 days", "90 days"];

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
    if (openDropdown === type) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top - 4,
        right: window.innerWidth - rect.left + 8,
      });
      setOpenDropdown(type);
    }
  };

  return (
    <div className="h-full flex flex-col w-[284px] shrink-0 bg-white overflow-y-auto text-neutral-800 pb-10 relative">
      {openDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)}></div>
          {openDropdown === "minNotice" && dropdownPosition && (
            <div
              className="fixed z-[100] bg-[#262626] rounded-[8px] p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f]"
              style={{ top: dropdownPosition.top, right: dropdownPosition.right, width: '160px' }}
            >
              {minNoticeOptions.map(option => (
                <button
                  key={option}
                  onClick={() => { setMinNotice(option); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-[6px] rounded-[6px] text-[13px] text-[#ebebeb] ${minNotice === option ? 'bg-[#3f3f3f]' : 'hover:bg-[#3f3f3f]'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {openDropdown === "maxWindow" && dropdownPosition && (
            <div 
              className="fixed z-[100] bg-[#262626] rounded-[8px] p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f]"
              style={{ top: dropdownPosition.top, right: dropdownPosition.right, width: '160px' }}
            >
              {maxWindowOptions.map(option => (
                <button 
                  key={option}
                  onClick={() => { setMaxWindow(option); setOpenDropdown(null); }}
                  className={`w-full text-left px-3 py-[6px] rounded-[6px] text-[13px] text-[#ebebeb] ${maxWindow === option ? 'bg-[#3f3f3f]' : 'hover:bg-[#3f3f3f]'}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {openDropdown === "conferencing" && dropdownPosition && (
            <div 
              className="fixed z-[100] bg-[#262626] rounded-[8px] p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f]"
              style={{ top: dropdownPosition.top, right: dropdownPosition.right, width: '220px' }}
            >
              <button 
                onClick={() => { setConferencing("Google Meet"); setOpenDropdown(null); }}
                className={`flex items-center w-full text-left px-2 py-1.5 rounded-[6px] text-[13px] text-[#ebebeb] ${conferencing === "Google Meet" ? 'bg-[#3f3f3f]' : 'hover:bg-[#3f3f3f]'} transition-colors`}
              >
                <div className="w-[18px] h-[18px] mr-2.5 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path fill="#00832d" d="M16.5 18H20v-3.5z"/><path fill="#0066da" d="M4 18h3.5v-3.5z"/><path fill="#e94235" d="M4 6h3.5v3.5z"/><path fill="#2684fc" d="M12.5 12L4 6v12l8.5-6z"/><path fill="#ffba00" d="M20 6h-3.5v3.5z"/><path fill="#00ac47" d="M16.5 12L20 18V6l-3.5 6z"/><path fill="#00832d" d="M12.5 12L16.5 18H12z"/><path fill="#00ac47" d="M12.5 12L16.5 6H12z"/><path fill="#ffba00" d="M12.5 12L16.5 6H12z"/></svg>
                </div>
                <span>Google Meet</span>
              </button>
              
              <button 
                onClick={() => { setConferencing("Zoom"); setOpenDropdown(null); }}
                className={`flex items-center justify-between w-full text-left px-2 py-1.5 rounded-[6px] text-[13px] text-[#ebebeb] ${conferencing === "Zoom" ? 'bg-[#3f3f3f]' : 'hover:bg-[#3f3f3f]'} transition-colors`}
              >
                <div className="flex items-center">
                  <div className="w-[18px] h-[18px] mr-2.5 flex items-center justify-center shrink-0 text-[#2D8CFF]">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13H7v-6h8.5v6zm2-1v-4l-1.5 1v2l1.5 1z"/></svg>
                  </div>
                  <span>Zoom</span>
                </div>
                <span className="text-[12px] text-[#8c8c8c]">Connect</span>
              </button>
              
              <div className="w-full h-px bg-[#3f3f3f] my-1"></div>
              
              <button 
                onClick={() => setOpenDropdown(null)}
                className="flex items-center w-full text-left px-2 py-1.5 rounded-[6px] text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors"
              >
                <div className="w-[18px] h-[18px] mr-2.5 flex items-center justify-center shrink-0 text-[#a0a0a0]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </div>
                <span>Manage conferencing</span>
              </button>
            </div>
          )}
        </>
      )}
      {/* Top right sidebar icon */}
      <div className="flex justify-end p-2 mb-2">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-7 h-7 rounded hover:bg-neutral-100 text-neutral-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            className="w-[18px] h-[18px]"
          >
            <path
              fill="currentColor"
              d="M16.25 3.625c1.174 0 2.125.951 2.125 2.125v8.5a2.125 2.125 0 0 1-2.125 2.125H3.75a2.125 2.125 0 0 1-2.125-2.125v-8.5c0-1.174.951-2.125 2.125-2.125h12.5Zm-12.5 1.25a.875.875 0 0 0-.875.875v8.5c0 .483.392.875.875.875h8.7V4.875h-8.7Zm9.8 10.25h2.7a.875.875 0 0 0 .875-.875v-8.5a.875.875 0 0 0-.875-.875h-2.7v10.25Z"
            />
          </svg>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-4">
        <h2 className="text-[14px] font-semibold text-neutral-800">Recurring link</h2>
        <div className="flex items-center space-x-1">
          <button className="flex items-center justify-center w-7 h-7 rounded hover:bg-neutral-100 text-neutral-400 transition-colors" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-4 h-4"><path fill="currentColor" d="M10.61 3.61a3.776 3.776 0 0 1 5.34 0l.367.368a3.776 3.776 0 0 1 0 5.34l-1.852 1.853a.625.625 0 1 1-.884-.884l1.853-1.853a2.526 2.526 0 0 0 0-3.572l-.368-.367a2.526 2.526 0 0 0-3.572 0L9.641 6.347a.625.625 0 0 1-.883-.884l1.852-1.852Z"></path><path fill="currentColor" d="M12.98 6.949a.625.625 0 0 1 0 .883l-5.45 5.449a.625.625 0 1 1-.884-.884l5.448-5.448a.625.625 0 0 1 .884 0Z"></path><path fill="currentColor" d="M6.348 8.757a.625.625 0 0 1 0 .884l-1.853 1.853a2.526 2.526 0 0 0 0 3.572l.367.367a2.526 2.526 0 0 0 3.572 0l1.853-1.852a.625.625 0 1 1 .884.883l-1.853 1.853a3.776 3.776 0 0 1-5.34 0l-.367-.367a3.776 3.776 0 0 1 0-5.34l1.853-1.853a.625.625 0 0 1 .884 0Z"></path></svg>
          </button>
          <button className="flex items-center justify-center w-7 h-7 rounded hover:bg-neutral-100 text-neutral-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-4 h-4"><path fill="currentColor" d="M4 11.375a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75Zm6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75Zm6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75Z"></path></svg>
          </button>
          <button className="flex items-center justify-center px-3 py-[5px] ml-1 bg-[#2383e2] hover:bg-[#1f73c7] text-white rounded-[6px] text-[13px] font-medium transition-colors">
            Create
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pb-[10px]">
        <input
          type="text"
          className="text-[14px] text-neutral-800 outline-none w-full bg-transparent p-0"
          defaultValue="30min Meeting"
        />
      </div>

      {/* Duration */}
      <div className="flex items-center px-4 space-x-[6px]">
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-neutral-400">
          <path d="M 6 0.5 A 5.5 5.5 0 0 1 6 11.5 L 6 6 Z"></path>
          <path d="M 3.8952411219920067 0.918662571187923 A 5.5 5.5 0 0 0 3.8952411219920067 11.081337428812077"></path>
        </svg>
        <span className="text-[13px] text-neutral-500">30 min</span>
        <span className="text-[13px] text-neutral-400">duration</span>
      </div>

      <div className="w-full h-px bg-neutral-200 shrink-0 my-4"></div>

      {/* Link Block & Expiration */}
      <div className="px-4">
        <div className="text-[13px] leading-relaxed mb-4 text-[#37352F] break-all">
          calendar.notion.so/meet/einhart2312/k26n3vtu
          <button className="inline-flex items-center gap-1 text-[#787774] font-medium hover:text-[#37352F] ml-2 transition-colors whitespace-nowrap align-middle">
            <span>Customize link</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[14px] h-[14px] text-[#a0a0a0]">
              <path fill="currentColor" d="m17.442 9.558-5.4-5.4a.625.625 0 0 0-.884.884l4.333 4.333H3a.625.625 0 1 0 0 1.25h12.491l-4.333 4.333a.625.625 0 1 0 .884.884l5.4-5.4a.622.622 0 0 0 0-.884Z"></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center">
          <button className="w-8 h-4 rounded-full bg-[#e5e5e5] relative transition-colors mr-3 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] left-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform"></div>
          </button>
          <span className="text-[13px] text-[#37352F] flex-1">Link expiration date</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[15px] h-[15px] text-[#a0a0a0] shrink-0">
            <path fill="currentColor" d="M9.978 7.154c-.804 0-1.333.456-1.438.874a.625.625 0 0 1-1.213-.303c.28-1.121 1.44-1.82 2.65-1.82 1.365 0 2.714.905 2.714 2.298 0 .812-.49 1.477-1.13 1.872l-.755.516a.838.838 0 0 0-.381.677.625.625 0 1 1-1.25 0c0-.688.36-1.318.921-1.706l.003-.002.784-.535.014-.008c.374-.228.544-.537.544-.814 0-.459-.517-1.049-1.463-1.049Zm.662 6.336a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0Z"></path>
            <path fill="currentColor" d="M2.375 10a7.625 7.625 0 1 1 15.25 0 7.625 7.625 0 0 1-15.25 0ZM10 3.625a6.375 6.375 0 1 0 0 12.75 6.375 6.375 0 0 0 0-12.75Z"></path>
          </svg>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-200 shrink-0 my-4"></div>

      {/* Times */}
      <div className="px-4 mb-6">
        <h3 className="text-[14px] font-semibold text-[#37352F] mb-4">Times</h3>
        <div className="flex flex-col space-y-[10px]">
          {daysList.map((day, dayIndex) => {
            const data = schedule[day];
            const isToday = dayIndex === currentDayIndex;

            return (
              <React.Fragment key={day}>
                {data.slots.map((slot, slotIndex) => {
                  const showDayBadge = slotIndex === 0;
                  const isActive = data.active;

                  return (
                    <div key={`${day}-${slotIndex}`} className="flex items-center group">
                      {/* Badge */}
                      {showDayBadge ? (
                        <button
                          onClick={() => toggleDay(day)}
                          className={`w-[34px] h-[26px] rounded-[6px] border flex items-center justify-center text-[12px] font-medium mr-4 shrink-0 transition-colors ${isActive
                            ? isToday
                              ? 'border-[#2383e2] text-[#2383e2]'
                              : 'border-[#e5e5e5] text-[#37352F]'
                            : 'border-[#e5e5e5] text-[#b3b3b3] bg-transparent'
                            }`}
                        >
                          {day}
                        </button>
                      ) : (
                        <div className="w-[34px] mr-4 shrink-0"></div>
                      )}

                      {/* Time inputs */}
                      <div className={`flex items-center text-[13px] flex-1 ${isActive ? 'text-[#37352F]' : 'text-[#b3b3b3]'}`}>
                        {isActive ? (
                          <>
                            <input
                              type="text"
                              value={slot.start}
                              onChange={(e) => {
                                setSchedule(prev => {
                                  const newDay = { ...prev[day] };
                                  newDay.slots = [...newDay.slots];
                                  newDay.slots[slotIndex] = { ...newDay.slots[slotIndex], start: e.target.value };
                                  return { ...prev, [day]: newDay };
                                });
                              }}
                              className="w-[42px] bg-transparent outline-none p-0"
                            />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mx-2 ${isActive ? 'text-[#b3b3b3]' : 'text-[#d1d1d1]'}`}>
                              <path d="M5 12h14"></path>
                              <path d="m12 5 7 7-7 7"></path>
                            </svg>
                            <input
                              type="text"
                              value={slot.end}
                              onChange={(e) => {
                                setSchedule(prev => {
                                  const newDay = { ...prev[day] };
                                  newDay.slots = [...newDay.slots];
                                  newDay.slots[slotIndex] = { ...newDay.slots[slotIndex], end: e.target.value };
                                  return { ...prev, [day]: newDay };
                                });
                              }}
                              className="w-[42px] ml-1 bg-transparent outline-none p-0"
                            />
                          </>
                        ) : (
                          <>
                            <span className="w-[42px]">Start</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-2 text-[#d1d1d1]">
                              <path d="M5 12h14"></path>
                              <path d="m12 5 7 7-7 7"></path>
                            </svg>
                            <span className="w-[42px] ml-1">End</span>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center shrink-0">
                        {slotIndex === 0 ? (
                          <>
                            {/* Plus button */}
                            <button
                              onClick={() => addSlot(day)}
                              className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isActive ? 'text-[#a0a0a0] hover:bg-neutral-100' : 'text-[#b3b3b3] hover:bg-neutral-100'}`}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>

                            {/* Remove or Copy/3dots */}
                            <div className="w-6 h-6 ml-1 flex items-center justify-center relative">
                              <button
                                onClick={() => setOpenDropdown(`menu-${day}`)}
                                className={`w-full h-full flex items-center justify-center rounded transition-colors ${isActive ? 'text-[#a0a0a0] hover:bg-neutral-100' : 'text-[#b3b3b3] hover:bg-neutral-100'}`}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle></svg>
                              </button>

                              {openDropdown === `menu-${day}` && (
                                <div className="absolute top-[120%] right-0 mt-1 w-[240px] bg-[#262626] rounded-[8px] p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] z-[100] cursor-default" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => { addSlot(day); setOpenDropdown(null); }}
                                    className="flex items-center w-full text-left px-[10px] py-[6px] rounded-[6px] text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px] mr-[10px] shrink-0"><path fill="currentColor" d="M10 3.59a.66.66 0 0 1 .66.66v5.09h5.09a.66.66 0 0 1 0 1.32h-5.09v5.09a.66.66 0 0 1-1.32 0v-5.09H4.25a.66.66 0 0 1 0-1.32h5.09V4.25a.66.66 0 0 1 .66-.66Z"></path></svg>
                                    Add new time range on day
                                  </button>

                                  <div className="w-full h-px bg-[#3f3f3f] my-1"></div>

                                  <button
                                    onClick={() => {
                                      setSchedule(prev => ({
                                        ...prev,
                                        [day]: { active: false, slots: [{ start: "9 AM", end: "5 PM" }] }
                                      }));
                                      setOpenDropdown(null);
                                    }}
                                    className="flex items-center w-full text-left px-[10px] py-[6px] rounded-[6px] text-[13px] text-[#eb5757] hover:bg-[#3f3f3f] transition-colors"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px] mr-[10px] shrink-0"><path fill="currentColor" d="M8.806 8.505a.55.55 0 0 0-1.1 0v5.979a.55.55 0 1 0 1.1 0V8.505Zm3.488 0a.55.55 0 0 0-1.1 0v5.979a.55.55 0 1 0 1.1 0V8.505Z"></path><path fill="currentColor" d="M6.386 3.925v1.464H3.523a.625.625 0 1 0 0 1.25h.897l.393 8.646A2.425 2.425 0 0 0 7.236 17.6h5.528a2.425 2.425 0 0 0 2.422-2.315l.393-8.646h.898a.625.625 0 1 0 0-1.25h-2.863V3.925c0-.842-.683-1.525-1.525-1.525H7.91c-.842 0-1.524.683-1.524 1.525ZM7.91 3.65h4.18c.15 0 .274.123.274.275v1.464H7.635V3.925c0-.152.124-.275.276-.275Zm-.9 2.99h7.319l-.39 8.588a1.175 1.175 0 0 1-1.174 1.122H7.236a1.175 1.175 0 0 1-1.174-1.122l-.39-8.589H7.01Z"></path></svg>
                                    Clear day
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Placeholder for alignment */}
                            <div className="w-6 h-6"></div>

                            {/* Trash button */}
                            <div className="w-6 h-6 ml-1 flex items-center justify-center">
                              <button
                                onClick={() => removeSlot(day, slotIndex)}
                                className="w-full h-full flex items-center justify-center text-[#a0a0a0] hover:bg-neutral-100 hover:text-neutral-800 rounded transition-colors"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="w-full h-px bg-neutral-200 shrink-0 mb-4"></div>

      {/* Location */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-neutral-800">Location</h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[15px] h-[15px] text-neutral-400">
            <path fill="currentColor" d="M9.978 7.154c-.804 0-1.333.456-1.438.874a.625.625 0 0 1-1.213-.303c.28-1.121 1.44-1.82 2.65-1.82 1.365 0 2.714.905 2.714 2.298 0 .812-.49 1.477-1.13 1.872l-.755.516a.838.838 0 0 0-.381.677.625.625 0 1 1-1.25 0c0-.688.36-1.318.921-1.706l.003-.002.784-.535.014-.008c.374-.228.544-.537.544-.814 0-.459-.517-1.049-1.463-1.049Zm.662 6.336a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0Z"></path>
            <path fill="currentColor" d="M2.375 10a7.625 7.625 0 1 1 15.25 0 7.625 7.625 0 0 1-15.25 0ZM10 3.625a6.375 6.375 0 1 0 0 12.75 6.375 6.375 0 0 0 0-12.75Z"></path>
          </svg>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="relative z-50">
            <button 
              onClick={(e) => handleDropdownClick(e, "conferencing")}
              className={`flex items-center w-full text-left transition-colors rounded-[6px] py-[6px] px-2 -ml-2 ${openDropdown === "conferencing" ? 'bg-[#f3f3f3]' : 'hover:bg-[#f3f3f3]'}`}
            >
              {conferencing === "Google Meet" ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="mr-[10px] shrink-0"><path fill="#00832d" d="M16.5 18H20v-3.5z"/><path fill="#0066da" d="M4 18h3.5v-3.5z"/><path fill="#e94235" d="M4 6h3.5v3.5z"/><path fill="#2684fc" d="M12.5 12L4 6v12l8.5-6z"/><path fill="#ffba00" d="M20 6h-3.5v3.5z"/><path fill="#00ac47" d="M16.5 12L20 18V6l-3.5 6z"/><path fill="#00832d" d="M12.5 12L16.5 18H12z"/><path fill="#00ac47" d="M12.5 12L16.5 6H12z"/><path fill="#ffba00" d="M12.5 12L16.5 6H12z"/></svg>
              ) : conferencing === "Zoom" ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="mr-[10px] shrink-0 text-[#2D8CFF]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13H7v-6h8.5v6zm2-1v-4l-1.5 1v2l1.5 1z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px] mr-[10px] shrink-0 text-[#b3b3b3]"><path fill="currentColor" d="M3.5 4.375A2.125 2.125 0 0 0 1.375 6.5v7c0 1.174.951 2.125 2.125 2.125h9a2.125 2.125 0 0 0 2.125-2.125v-1.084l3.239 1.962a.625.625 0 0 0 .948-.534V6.156a.625.625 0 0 0-.948-.534l-3.239 1.962V6.5A2.125 2.125 0 0 0 12.5 4.375h-9Zm11.125 6.58v-1.91l2.938-1.78v5.47l-2.938-1.78ZM13.375 6.5v7a.875.875 0 0 1-.875.875h-9a.875.875 0 0 1-.875-.875v-7c0-.483.392-.875.875-.875h9c.483 0 .875.392.875.875Z"></path></svg>
              )}
              
              <span className={`text-[13px] flex-1 ${conferencing === "Conferencing" ? 'text-[#b3b3b3]' : 'text-[#37352F]'}`}>
                {conferencing}
              </span>
              
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] text-[#a0a0a0] shrink-0">
                <path d="M5.158 7.742a.625.625 0 0 1 .884 0L10 11.684l3.958-3.942a.625.625 0 0 1 .884.884l-4.4 4.383a.625.625 0 0 1-.884 0l-4.4-4.383a.625.625 0 0 1 0-.884Z" fill="currentColor"></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px] mr-3 shrink-0"><path fill="currentColor" d="M10 5.702a2.775 2.775 0 1 0 0 5.55 2.775 2.775 0 0 0 0-5.55ZM8.475 8.477a1.525 1.525 0 1 1 3.05 0 1.525 1.525 0 0 1-3.05 0Z"></path><path fill="currentColor" d="M10 2.125a6.19 6.19 0 0 0-6.19 6.19v.129c0 1.403.467 2.767 1.327 3.876l4.37 5.626a.625.625 0 0 0 .986 0l4.37-5.626a6.319 6.319 0 0 0 1.328-3.876v-.128A6.19 6.19 0 0 0 10 2.125Zm-4.94 6.19a4.94 4.94 0 1 1 9.88 0v.129c0 1.126-.374 2.22-1.065 3.109L10 16.543l-3.875-4.99a5.069 5.069 0 0 1-1.066-3.109v-.128Z"></path></svg>
            <span className="text-[13px]">Location</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center cursor-pointer select-none" onClick={() => setIsPhoneCallEnabled(!isPhoneCallEnabled)}>
              <button className={`w-8 h-4 rounded-full relative transition-colors mr-3 shrink-0 ${isPhoneCallEnabled ? 'bg-[#2383e2]' : 'bg-[#e5e5e5]'}`}>
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] left-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ${isPhoneCallEnabled ? 'translate-x-[14px]' : 'translate-x-0'}`}></div>
              </button>
              <span className="text-[13px] text-[#37352F]">Phone call</span>
            </div>

            {isPhoneCallEnabled && (
              <div className="text-[12px] text-[#787774] mt-1 pl-[40px] leading-[1.4] tracking-[-0.1px]">
                Recipients will need to provide their phone number when booking
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-200 shrink-0 mb-4"></div>

      {/* Booking Window */}
      {/* Booking Window */}
      <div className="px-4 mb-6 flex flex-col">
        <button
          onClick={() => setIsBookingWindowOpen(!isBookingWindowOpen)}
          className="flex items-center w-max group mb-3 -ml-1 px-1 rounded hover:bg-[#f3f3f3] transition-colors"
        >
          <span className="text-[13px] font-semibold text-[#37352F] mr-1.5">Booking window</span>
          <div className="flex items-center justify-center shrink-0 text-[#37352F] transition-transform">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              style={{ width: "8px", height: "8px" }}
              className={`transition-transform duration-200 ${isBookingWindowOpen ? 'rotate-0' : '-rotate-90'}`}
            >
              <path d="M2.835 3.25a.8.8 0 0 0-.69 1.203l5.164 8.854a.8.8 0 0 0 1.382 0l5.165-8.854a.8.8 0 0 0-.691-1.203H2.835Z"></path>
            </svg>
          </div>
        </button>

        {isBookingWindowOpen && (
          <div className="flex flex-col space-y-[12px]">
            {/* Min Notice */}
            <div className="relative z-50">
              <button
                onClick={(e) => handleDropdownClick(e, "minNotice")}
                className={`flex items-center w-full text-left transition-colors ${openDropdown === "minNotice" ? 'bg-[#f3f3f3] rounded-[6px] py-[4px] px-2 -ml-2' : ''}`}
              >
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] mr-[10px] shrink-0 text-[#b3b3b3]">
                  <path d="M2.625 3.524c.345 0 .625.28.625.625v11.7a.625.625 0 1 1-1.25 0V4.15c0-.345.28-.625.625-.625ZM12.258 5.158a.625.625 0 0 1 .884 0l4.4 4.4a.625.625 0 0 1 0 .884l-4.4 4.4a.625.625 0 0 1-.884-.884l3.333-3.333H5.625a.625.625 0 1 1 0-1.25h9.966l-3.333-3.333a.625.625 0 0 1 0-.884Z" fill="currentColor"></path>
                </svg>
                <div className="text-[13px] flex-1">
                  {openDropdown === "minNotice" ? (
                    <span className="bg-[#cce2ff] text-[#37352F]">{minNotice}</span>
                  ) : (
                    <>
                      <span className="text-[#37352F]">{minNotice}</span> <span className="text-[#787774]">minimum notice</span>
                    </>
                  )}
                </div>
                {openDropdown === "minNotice" && (
                  <div className="w-5 h-5 flex items-center justify-center text-[#a0a0a0] hover:bg-neutral-200 rounded shrink-0 transition-colors" onClick={(e) => { e.stopPropagation(); setMinNotice(""); }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4.293 4.293a1 1 0 0 1 1.414 0L8 6.586l2.293-2.293a1 1 0 1 1 1.414 1.414L9.414 8l2.293 2.293a1 1 0 0 1-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L6.586 8 4.293 5.707a1 1 0 0 1 0-1.414z" /></svg>
                  </div>
                )}
              </button>
            </div>

            {/* Max Window */}
            <div className="relative z-40">
              <button
                onClick={(e) => handleDropdownClick(e, "maxWindow")}
                className={`flex items-center w-full text-left transition-colors ${openDropdown === "maxWindow" ? 'bg-[#f3f3f3] rounded-[6px] py-[4px] px-2 -ml-2' : ''}`}
              >
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[16px] mr-[10px] shrink-0 text-[#b3b3b3]">
                  <path d="M16.975 3.525c.345 0 .625.28.625.625v11.7a.625.625 0 1 1-1.25 0V4.15c0-.345.28-.625.625-.625ZM9.658 5.158a.625.625 0 0 1 .884 0l4.4 4.4a.625.625 0 0 1 0 .884l-4.4 4.4a.625.625 0 0 1-.884-.884l3.333-3.333H3.025a.625.625 0 1 1 0-1.25h9.966L9.658 6.042a.625.625 0 0 1 0-.884Z" fill="currentColor"></path>
                </svg>
                <div className="text-[13px] flex-1">
                  {openDropdown === "maxWindow" ? (
                    <span className="bg-[#cce2ff] text-[#37352F]">{maxWindow}</span>
                  ) : (
                    <>
                      <span className="text-[#37352F]">{maxWindow}</span> <span className="text-[#787774]">maximum window</span>
                    </>
                  )}
                </div>
                {openDropdown === "maxWindow" && (
                  <div className="w-5 h-5 flex items-center justify-center text-[#a0a0a0] hover:bg-neutral-200 rounded shrink-0 transition-colors" onClick={(e) => { e.stopPropagation(); setMaxWindow(""); }}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4.293 4.293a1 1 0 0 1 1.414 0L8 6.586l2.293-2.293a1 1 0 1 1 1.414 1.414L9.414 8l2.293 2.293a1 1 0 0 1-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L6.586 8 4.293 5.707a1 1 0 0 1 0-1.414z" /></svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-px bg-neutral-200 shrink-0 mb-2"></div>

      {/* Details textarea */}
      <div className="px-2 py-1.5">
        <textarea
          placeholder="Any details to show on booking page"
          className="w-full resize-none outline-none text-[13px] text-[#37352F] placeholder-[#a0a0a0] min-h-[64px] rounded-[6px] border border-transparent hover:border-[#e5e5e5] focus:border-[#f3f3f3] focus:bg-[#f3f3f3] p-2 transition-colors bg-transparent"
          spellCheck={false}
        />
      </div>

      <div className="w-full h-px bg-neutral-200 shrink-0 mb-4"></div>

      {/* Accounts & Conflict Avoidance */}
      <div className="px-4 flex flex-col space-y-[14px]">
        <div className="flex items-center">
          <div className="w-[14px] h-[14px] rounded-[4px] bg-[#3cb1ff] mr-3 shrink-0"></div>
          <span className="text-[13px] text-neutral-800">einhart2312@gmail.com</span>
        </div>

        <div className="flex items-center pl-1">
          <button className="w-8 h-4 rounded-full bg-[#2383e2] relative transition-colors mr-2 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] right-[2px] shadow-sm transition-transform"></div>
          </button>
          <span className="text-[13px] text-neutral-800 mr-[6px]">Avoid conflicts</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[14px] h-[14px] text-neutral-400 shrink-0">
            <path fill="currentColor" d="M9.978 7.154c-.804 0-1.333.456-1.438.874a.625.625 0 0 1-1.213-.303c.28-1.121 1.44-1.82 2.65-1.82 1.365 0 2.714.905 2.714 2.298 0 .812-.49 1.477-1.13 1.872l-.755.516a.838.838 0 0 0-.381.677.625.625 0 1 1-1.25 0c0-.688.36-1.318.921-1.706l.003-.002.784-.535.014-.008c.374-.228.544-.537.544-.814 0-.459-.517-1.049-1.463-1.049Zm.662 6.336a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0Z"></path>
            <path fill="currentColor" d="M2.375 10a7.625 7.625 0 1 1 15.25 0 7.625 7.625 0 0 1-15.25 0ZM10 3.625a6.375 6.375 0 1 0 0 12.75 6.375 6.375 0 0 0 0-12.75Z"></path>
          </svg>
        </div>

        <div className="flex items-center pl-[28px]">
          <span className="text-[13px] text-neutral-800">einhart2312@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

