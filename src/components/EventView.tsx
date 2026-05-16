import React, { useState, useRef, useEffect } from 'react';

const parseTimeToMins = (timeStr: string) => {
  const match = timeStr.match(/^(\d+)(?::(\d+))?\s*(AM|PM)$/i);
  if (!match) return 0;
  let h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  const ampm = match[3].toUpperCase();
  if (h === 12 && ampm === 'AM') h = 0;
  if (h !== 12 && ampm === 'PM') h += 12;
  return h * 60 + m;
};

const formatMinsToTime = (mins: number) => {
  let m = mins % 1440;
  if (m < 0) m += 1440;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  return `${h12}${min > 0 ? ':' + min.toString().padStart(2, '0') : ''} ${ampm}`;
};

const formatDurationText = (mins: number) => {
  let m = mins;
  if (m <= 0) m += 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min} min`;
  if (min === 0) return `${h} h`;
  return `${h} h ${min} min`;
};

export const EventView = ({ onBack, onSaveEvent, activeEvent }: { onBack: () => void, onSaveEvent?: (event: any) => void, activeEvent?: any }) => {
  const eventId = useRef(activeEvent?.id || Math.random().toString(36).substr(2, 9));
  const [title, setTitle] = useState(activeEvent?.title || "");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number, left: number, right?: number } | null>(null);

  const [startTime, setStartTime] = useState(activeEvent?.startTime || "8:30 PM");
  const [endTime, setEndTime] = useState(activeEvent?.endTime || "9:00 PM");
  const [durationMins, setDurationMins] = useState(() => {
    if (activeEvent?.startTime && activeEvent?.endTime) {
      let diff = parseTimeToMins(activeEvent.endTime) - parseTimeToMins(activeEvent.startTime);
      if (diff <= 0) diff += 1440;
      return diff;
    }
    return 30;
  });
  const [date, setDate] = useState(activeEvent?.date || "Sun Apr 26");
  const [isAllDay, setIsAllDay] = useState(activeEvent?.isAllDay || false);
  const [showAllDayField, setShowAllDayField] = useState(false);
  const [showTimeZoneField, setShowTimeZoneField] = useState(false);
  const [showRepeatField, setShowRepeatField] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date(2026, 3, 1));
  const [timeZoneGmt, setTimeZoneGmt] = useState("GMT+7");
  const [timeZoneCity, setTimeZoneCity] = useState("Bangkok");
  const [isParticipantsActive, setIsParticipantsActive] = useState(false);
  const [participantsValue, setParticipantsValue] = useState("");
  const [isLocationActive, setIsLocationActive] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [isAiNotesActive, setIsAiNotesActive] = useState(false);
  const [aiNotesValue, setAiNotesValue] = useState("");
  const [conferencing, setConferencing] = useState<string>("");
  
  const [reminders, setReminders] = useState<string[]>([]);
  
  const [busyState, setBusyState] = useState("Busy");
  const [visibilityState, setVisibilityState] = useState("Default visibility");

  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeZoneRef = useRef<HTMLDivElement>(null);
  const conferencingRef = useRef<HTMLDivElement>(null);
  const aiNotesRef = useRef<HTMLDivElement>(null);
  const reminderTriggerRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef<HTMLDivElement>(null);
  const visibilityRef = useRef<HTMLDivElement>(null);

  // Initialize from activeEvent if it changes (only when switching events)
  useEffect(() => {
    if (activeEvent) {
      if (eventId.current !== activeEvent.id) {
        eventId.current = activeEvent.id;
        setTitle(activeEvent.title || "");
        setStartTime(activeEvent.startTime || "8:30 PM");
        setEndTime(activeEvent.endTime || "9:00 PM");
        setDate(activeEvent.date || "Sun Apr 26");
        setIsAllDay(activeEvent.isAllDay || false);
        setConferencing(activeEvent.conferencing || "");
        setLocationValue(activeEvent.locationValue || "");
        setParticipantsValue(activeEvent.participantsValue || "");
        if (activeEvent.startTime && activeEvent.endTime) {
          let diff = parseTimeToMins(activeEvent.endTime) - parseTimeToMins(activeEvent.startTime);
          if (diff <= 0) diff += 1440;
          setDurationMins(diff);
        }
      }
    } else {
      // Create new event if we transition to null
      eventId.current = Math.random().toString(36).substr(2, 9);
      setTitle("");
      setConferencing("");
      setLocationValue("");
      setParticipantsValue("");
    }
  }, [activeEvent?.id]);

  // Auto-save event to parent when any key fields change
  useEffect(() => {
    if (onSaveEvent) {
      onSaveEvent({
        id: eventId.current,
        title: title || "New Event",
        startTime,
        endTime,
        isAllDay,
        date,
        conferencing,
        locationValue,
        participantsValue,
        color: activeEvent?.color || "bg-[#3cb1ff]"
      });
    }
  }, [title, startTime, endTime, isAllDay, date, conferencing, locationValue, participantsValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isDropdownClick = (e.target as Element).closest('.dropdown-container');
      
      if (openDropdown && !isDropdownClick) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleDropdownClick = (e: React.MouseEvent, type: string, ref: React.RefObject<any>) => {
    e.stopPropagation();
    if (openDropdown === type) {
      setOpenDropdown(null);
      return;
    }
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        right: rect.right
      });
      setOpenDropdown(type);
    }
  };

  const generateStartTimes = () => {
    const times = [];
    const periods = ['AM', 'PM'];
    for (let p = 0; p < 2; p++) {
      for (let h = 0; h < 12; h++) {
        const hour = h === 0 ? 12 : h;
        for (let m = 0; m < 60; m += 15) {
          const min = m === 0 ? '' : `:${m}`;
          times.push(`${hour}${min} ${periods[p]}`);
        }
      }
    }
    return times;
  };
  const allStartTimes = generateStartTimes();

  const generateEndTimes = (startStr: string) => {
    const startMins = parseTimeToMins(startStr);
    const times = [];
    // Generate end times from 15 mins to 24 hours
    for (let d = 15; d <= 1440; d += 15) {
      if (d > 120 && d % 30 !== 0) continue; // After 2 hours, step by 30 mins to save space
      times.push({
        time: formatMinsToTime(startMins + d),
        dur: formatDurationText(d),
        durationMins: d
      });
    }
    return times;
  };
  const dynamicEndTimes = generateEndTimes(startTime);

  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const firstDayOfWeek = firstDay.getDay(); // 0 is Sunday
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows * 7 cols
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1, 1));
  };

  const handleGoToToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    setPickerDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const calendarDays = generateCalendarDays(pickerDate.getFullYear(), pickerDate.getMonth());
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const timeZones = [
    { gmt: "GMT-12:00", gmtShort: "GMT-12", city: "Baker Island", full: "Anywhere on Earth — Baker Island" },
    { gmt: "GMT-11:00", gmtShort: "GMT-11", city: "Pago Pago", full: "Samoa Standard Time — Pago Pago" },
    { gmt: "GMT-10:00", gmtShort: "GMT-10", city: "Honolulu", full: "Hawaii-Aleutian Standard Time — Honolulu" },
    { gmt: "GMT-09:00", gmtShort: "GMT-9", city: "Anchorage", full: "Alaska Standard Time — Anchorage" },
    { gmt: "GMT-08:00", gmtShort: "GMT-8", city: "Los Angeles", full: "Pacific Standard Time — Los Angeles" },
    { gmt: "GMT-07:00", gmtShort: "GMT-7", city: "Denver", full: "Mountain Standard Time — Denver" },
    { gmt: "GMT-06:00", gmtShort: "GMT-6", city: "Chicago", full: "Central Standard Time — Chicago" },
    { gmt: "GMT-05:00", gmtShort: "GMT-5", city: "New York", full: "Eastern Standard Time — New York" },
    { gmt: "GMT-04:00", gmtShort: "GMT-4", city: "Halifax", full: "Atlantic Standard Time — Halifax" },
    { gmt: "GMT-03:00", gmtShort: "GMT-3", city: "Buenos Aires", full: "Argentina Standard Time — Buenos Aires" },
    { gmt: "GMT-02:00", gmtShort: "GMT-2", city: "Noronha", full: "Fernando de Noronha Time — Noronha" },
    { gmt: "GMT-01:00", gmtShort: "GMT-1", city: "Praia", full: "Cape Verde Time — Praia" },
    { gmt: "GMT+00:00", gmtShort: "GMT+0", city: "London", full: "Greenwich Mean Time — London" },
    { gmt: "GMT+01:00", gmtShort: "GMT+1", city: "Paris", full: "Central European Time — Paris" },
    { gmt: "GMT+02:00", gmtShort: "GMT+2", city: "Cairo", full: "Eastern European Time — Cairo" },
    { gmt: "GMT+03:00", gmtShort: "GMT+3", city: "Moscow", full: "Moscow Standard Time — Moscow" },
    { gmt: "GMT+03:30", gmtShort: "GMT+3:30", city: "Tehran", full: "Iran Standard Time — Tehran" },
    { gmt: "GMT+04:00", gmtShort: "GMT+4", city: "Dubai", full: "Gulf Standard Time — Dubai" },
    { gmt: "GMT+04:30", gmtShort: "GMT+4:30", city: "Kabul", full: "Afghanistan Time — Kabul" },
    { gmt: "GMT+05:00", gmtShort: "GMT+5", city: "Karachi", full: "Pakistan Standard Time — Karachi" },
    { gmt: "GMT+05:30", gmtShort: "GMT+5:30", city: "Kolkata", full: "India Standard Time — Kolkata" },
    { gmt: "GMT+05:45", gmtShort: "GMT+5:45", city: "Kathmandu", full: "Nepal Time — Kathmandu" },
    { gmt: "GMT+06:00", gmtShort: "GMT+6", city: "Bishkek", full: "Kyrgyzstan Time — Bishkek" },
    { gmt: "GMT+06:00", gmtShort: "GMT+6", city: "Dhaka", full: "Bangladesh Standard Time — Dhaka" },
    { gmt: "GMT+06:00", gmtShort: "GMT+6", city: "Omsk", full: "Omsk Standard Time — Omsk" },
    { gmt: "GMT+06:00", gmtShort: "GMT+6", city: "Thimphu", full: "Bhutan Time — Thimphu" },
    { gmt: "GMT+06:00", gmtShort: "GMT+6", city: "Urumqi", full: "Asia/Urumqi — Urumqi" },
    { gmt: "GMT+06:00", gmtShort: "GMT+6", city: "Chagos", full: "Indian Ocean Time — Chagos" },
    { gmt: "GMT+06:30", gmtShort: "GMT+6:30", city: "Yangon", full: "Myanmar Time — Yangon" },
    { gmt: "GMT+06:30", gmtShort: "GMT+6:30", city: "Cocos", full: "Cocos Islands Time — Cocos" },
    { gmt: "GMT+07:00", gmtShort: "GMT+7", city: "Bangkok", full: "Indochina Time — Bangkok" },
    { gmt: "GMT+07:00", gmtShort: "GMT+7", city: "Davis", full: "Davis Time — Davis" },
    { gmt: "GMT+07:00", gmtShort: "GMT+7", city: "Jakarta", full: "Western Indonesia Time — Jakarta" },
    { gmt: "GMT+08:00", gmtShort: "GMT+8", city: "Singapore", full: "Singapore Standard Time — Singapore" },
    { gmt: "GMT+09:00", gmtShort: "GMT+9", city: "Tokyo", full: "Japan Standard Time — Tokyo" },
    { gmt: "GMT+09:30", gmtShort: "GMT+9:30", city: "Adelaide", full: "Australian Central Standard Time — Adelaide" },
    { gmt: "GMT+10:00", gmtShort: "GMT+10", city: "Sydney", full: "Australian Eastern Standard Time — Sydney" },
    { gmt: "GMT+11:00", gmtShort: "GMT+11", city: "Noumea", full: "New Caledonia Time — Noumea" },
    { gmt: "GMT+12:00", gmtShort: "GMT+12", city: "Auckland", full: "New Zealand Standard Time — Auckland" },
    { gmt: "GMT+13:00", gmtShort: "GMT+13", city: "Apia", full: "Samoa Time — Apia" },
    { gmt: "GMT+14:00", gmtShort: "GMT+14", city: "Kiritimati", full: "Line Islands Time — Kiritimati" }
  ];

  return (
    <div className="h-full flex flex-col w-[284px] shrink-0 bg-white overflow-y-auto text-neutral-800 pb-10 relative">
      {/* Top right sidebar icon */}
      <div className="flex justify-between items-center p-2 mb-2">
        <div className="flex items-center text-[#37352F]">
          <span className="text-[14px] font-semibold ml-2 mr-1">Event</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" className="w-[14px] h-[14px] text-[#a0a0a0]">
            <path fill="currentColor" d="m12.76 6.52-4.32 4.32a.62.62 0 0 1-.44.18.62.62 0 0 1-.44-.18L3.24 6.52a.628.628 0 0 1 0-.88c.24-.24.64-.24.88 0L8 9.52l3.88-3.88c.24-.24.64-.24.88 0s.24.64 0 .88Z"></path>
          </svg>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center w-7 h-7 rounded hover:bg-neutral-100 text-[#a0a0a0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-4 h-4"><path fill="currentColor" d="M3.75 12.5c.345 0 .625.28.625.625v1.625c0 .483.392.875.875.875h1.625a.625.625 0 1 1 0 1.25H5.25a2.125 2.125 0 0 1-2.125-2.125v-1.625c0-.345.28-.625.625-.625Zm12.5 0c.345 0 .625.28.625.625v1.625a2.125 2.125 0 0 1-2.125 2.125h-1.625a.625.625 0 1 1 0-1.25h1.625a.875.875 0 0 0 .875-.875v-1.625c0-.345.28-.625.625-.625ZM12.5 7.375c.621 0 1.125.504 1.125 1.125v3c0 .621-.504 1.125-1.125 1.125h-5A1.125 1.125 0 0 1 6.375 11.5v-3c0-.621.504-1.125 1.125-1.125h5Zm-4.875 4h4.75v-2.75h-4.75v2.75Zm-.75-8.25a.625.625 0 1 1 0 1.25H5.25a.875.875 0 0 0-.875.875v1.625a.625.625 0 1 1-1.25 0V5.25c0-1.174.951-2.125 2.125-2.125h1.625Zm7.875 0c1.174 0 2.125.951 2.125 2.125v1.625a.625.625 0 1 1-1.25 0V5.25a.875.875 0 0 0-.875-.875h-1.625a.625.625 0 1 1 0-1.25h1.625Z"></path></svg>
          </button>
          <button className="flex items-center justify-center w-7 h-7 rounded hover:bg-neutral-100 text-[#a0a0a0] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-4 h-4"><path fill="currentColor" d="M4 11.375a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75Zm6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75Zm6 0a1.375 1.375 0 1 0 0-2.75 1.375 1.375 0 0 0 0 2.75Z"></path></svg>
          </button>
          <button
            onClick={onBack}
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-neutral-100 text-[#a0a0a0] transition-colors ml-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[18px] h-[18px]"><path fill="currentColor" d="M16.25 3.625c1.174 0 2.125.951 2.125 2.125v8.5a2.125 2.125 0 0 1-2.125 2.125H3.75a2.125 2.125 0 0 1-2.125-2.125v-8.5c0-1.174.951-2.125 2.125-2.125h12.5Zm-12.5 1.25a.875.875 0 0 0-.875.875v8.5c0 .483.392.875.875.875h8.7V4.875h-8.7Zm9.8 10.25h2.7a.875.875 0 0 0 .875-.875v-8.5a.875.875 0 0 0-.875-.875h-2.7v10.25Z"/></svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-3 pb-[10px]">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-[14px] font-medium text-neutral-800 outline-none w-full bg-transparent px-2 py-1.5 border border-transparent hover:border-neutral-200 focus:border-[#2383e2] focus:bg-white rounded-[6px] placeholder-neutral-400 transition-colors"
          placeholder="Event title"
        />
      </div>

      <div className="w-full h-px bg-[#f0f0f0] shrink-0 mb-2"></div>

      {/* Times */}
      <div className="px-4 py-2 flex flex-col space-y-2">
        {!isAllDay && (
          <div className="flex items-center text-[13px] text-[#37352F]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px] mr-3 text-[#a0a0a0]"><path fill="currentColor" d="M10.625 5.725a.625.625 0 1 0-1.25 0v3.65H6.4a.625.625 0 1 0 0 1.25H10c.345 0 .625-.28.625-.625V5.725Z"></path><path fill="currentColor" d="M10 2.375a7.625 7.625 0 1 0 0 15.25 7.625 7.625 0 0 0 0-15.25ZM3.625 10a6.375 6.375 0 1 1 12.75 0 6.375 6.375 0 0 1-12.75 0Z"></path></svg>
            
            <input 
              ref={startTimeRef}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onClick={(e) => handleDropdownClick(e, 'start', startTimeRef)}
              className={`w-[65px] px-1.5 py-1 rounded-[6px] hover:bg-neutral-100 transition-colors outline-none cursor-pointer focus:cursor-text ${openDropdown === 'start' ? 'bg-[#f3f3f3]' : 'bg-transparent'}`}
            />
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px] mx-1 text-[#a0a0a0]"><path fill="currentColor" d="m17.442 9.558-5.4-5.4a.625.625 0 0 0-.884.884l4.333 4.333H3a.625.625 0 1 0 0 1.25h12.491l-4.333 4.333a.625.625 0 1 0 .884.884l5.4-5.4a.622.622 0 0 0 0-.884Z"></path></svg>
            
            <div className={`flex items-center px-1.5 py-1 rounded-[6px] hover:bg-neutral-100 transition-colors ${openDropdown === 'end' ? 'bg-[#f3f3f3]' : ''}`}>
              <input 
                ref={endTimeRef}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                onClick={(e) => handleDropdownClick(e, 'end', endTimeRef)}
                className="w-[50px] bg-transparent outline-none cursor-pointer focus:cursor-text"
              />
              <span className="text-[#a0a0a0] ml-1.5 text-[12px] whitespace-nowrap pointer-events-none">{formatDurationText(durationMins)}</span>
            </div>
          </div>
        )}
        
        <div className={`flex items-center text-[13px] text-[#37352F] ${isAllDay ? '' : 'pl-[28px]'} mb-1`}>
          {isAllDay && (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px] mr-3 text-[#a0a0a0]"><path fill="currentColor" d="M10.625 5.725a.625.625 0 1 0-1.25 0v3.65H6.4a.625.625 0 1 0 0 1.25H10c.345 0 .625-.28.625-.625V5.725Z"></path><path fill="currentColor" d="M10 2.375a7.625 7.625 0 1 0 0 15.25 7.625 7.625 0 0 0 0-15.25ZM3.625 10a6.375 6.375 0 1 1 12.75 0 6.375 6.375 0 0 1-12.75 0Z"></path></svg>
          )}
          <input 
            ref={dateRef}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onClick={(e) => handleDropdownClick(e, 'date', dateRef)}
            className={`w-[110px] px-1.5 py-1 rounded-[6px] hover:bg-neutral-100 transition-colors outline-none cursor-pointer focus:cursor-text ${openDropdown === 'date' ? 'bg-[#e5efff] text-[#2383e2]' : 'bg-transparent'}`}
          />
        </div>
        
        {/* Vertical form rows for added fields */}
        {showAllDayField && (
          <div className="flex items-center text-[13px] text-[#37352F] cursor-pointer w-fit mt-1" onClick={() => setIsAllDay(!isAllDay)}>
            <div className="w-[16px] flex justify-center mr-3 shrink-0">
              <button className={`w-[22px] h-[12px] rounded-full relative transition-colors ${isAllDay ? 'bg-[#2383e2]' : 'bg-[#e5e5e5]'}`}>
                <div className={`w-[8px] h-[8px] rounded-full bg-white absolute top-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ${isAllDay ? 'translate-x-[12px] left-[0px]' : 'translate-x-0 left-[2px]'}`}></div>
              </button>
            </div>
            <span className="text-[#37352F]">All-day</span>
          </div>
        )}

        {showTimeZoneField && (
          <div 
            ref={timeZoneRef}
            onClick={(e) => handleDropdownClick(e, 'timezone', timeZoneRef)}
            className="flex items-center text-[13px] cursor-pointer group mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px] mr-3 shrink-0 text-[#a0a0a0] group-hover:text-[#37352F] transition-colors"><path fill="currentColor" d="M10 2.375a7.625 7.625 0 1 1 0 15.25 7.625 7.625 0 0 1 0-15.25Zm-1.863 8.25c.054 1.559.31 2.937.681 3.943.212.572.449.992.68 1.256.232.266.404.318.502.318.098 0 .27-.052.502-.318.231-.264.468-.684.68-1.256.371-1.006.627-2.384.681-3.943H8.137Zm-4.48 0a6.378 6.378 0 0 0 4.509 5.48 6.454 6.454 0 0 1-.52-1.104c-.431-1.167-.704-2.697-.76-4.376h-3.23Zm9.456 0c-.055 1.679-.327 3.21-.758 4.376-.15.405-.324.779-.522 1.104a6.378 6.378 0 0 0 4.51-5.48h-3.23ZM8.166 3.894a6.379 6.379 0 0 0-4.51 5.481h3.23c.056-1.679.328-3.21.76-4.376.15-.405.322-.78.52-1.105ZM10 3.858c-.099 0-.27.053-.502.319-.231.264-.468.683-.68 1.255-.371 1.006-.627 2.384-.681 3.943h3.726c-.054-1.559-.31-2.937-.681-3.943-.212-.572-.449-.99-.68-1.255-.232-.266-.404-.319-.502-.319Zm1.833.036c.198.326.372.7.521 1.105.432 1.167.704 2.697.76 4.376h3.23a6.379 6.379 0 0 0-4.511-5.481Z"></path></svg>
            <span className="text-[#a0a0a0]">{timeZoneGmt}</span>
            <input 
              className={`ml-1 text-[#37352F] w-[80px] bg-transparent outline-none cursor-pointer focus:cursor-text ${openDropdown === 'timezone' ? 'bg-[#f3f3f3] rounded-[4px] px-1 -ml-1' : ''}`} 
              value={timeZoneCity}
              onChange={(e) => setTimeZoneCity(e.target.value)}
              onClick={(e) => { e.stopPropagation(); handleDropdownClick(e, 'timezone', timeZoneRef); }}
            />
          </div>
        )}

        {showRepeatField && (
          <div className="flex items-center text-[13px] text-[#a0a0a0] cursor-pointer group mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px] mr-3 shrink-0 text-[#a0a0a0] group-hover:text-[#37352F] transition-colors"><path fill="currentColor" d="m3.625 11.151 1.187-1.187a.625.625 0 1 1 .884.884l-2.254 2.254a.625.625 0 0 1-.884 0L.304 10.848a.625.625 0 0 1 .884-.884l1.187 1.187V10a7.625 7.625 0 0 1 12.813-5.588.625.625 0 1 1-.85.916A6.375 6.375 0 0 0 3.625 10v1.151Zm14-2.302 1.187 1.187a.625.625 0 1 0 .884-.884l-2.254-2.254a.625.625 0 0 0-.884 0l-2.254 2.254a.625.625 0 1 0 .884.884l1.187-1.187V10a6.375 6.375 0 0 1-10.713 4.672.625.625 0 0 0-.85.915A7.625 7.625 0 0 0 17.625 10V8.85Z"></path></svg>
            <span className="group-hover:text-[#37352F] transition-colors">Repeat</span>
          </div>
        )}

        {/* Quick add buttons */}
        {(!showAllDayField || !showTimeZoneField || !showRepeatField) && (
          <div className="flex items-center pl-[28px] text-[13px] text-[#a0a0a0] gap-3 pt-1">
            {!showAllDayField && (
              <button 
                onClick={() => { setShowAllDayField(true); setIsAllDay(true); }}
                className="hover:text-[#37352F] transition-colors"
              >
                All-day
              </button>
            )}
            {!showTimeZoneField && (
              <button 
                onClick={() => setShowTimeZoneField(true)}
                className="hover:text-[#37352F] transition-colors"
              >
                Time zone
              </button>
            )}
            {!showRepeatField && (
              <button 
                onClick={() => setShowRepeatField(true)}
                className="hover:text-[#37352F] transition-colors"
              >
                Repeat
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-[#f0f0f0] shrink-0 my-2"></div>

      {/* Participants, Conferencing, Location */}
      <div className="px-4 py-2 flex flex-col space-y-[14px]">
        {/* Participants */}
        <div 
          onClick={() => { if (!isParticipantsActive) setIsParticipantsActive(true); }}
          className={`flex items-center text-[13px] ${isParticipantsActive ? 'bg-[#f0f0f0] rounded-[6px] px-2 py-1.5 -ml-2' : 'cursor-pointer group'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className={`w-[16px] h-[16px] mr-3 shrink-0 ${isParticipantsActive || participantsValue ? 'text-[#a0a0a0]' : 'text-[#a0a0a0] group-hover:text-[#37352F] transition-colors'}`}><path fill="currentColor" d="M10 2.375c-1.137 0-2.054.47-2.674 1.242-.608.757-.9 1.765-.9 2.824 0 1.058.292 2.066.9 2.824.62.772 1.537 1.241 2.674 1.241s2.055-.469 2.675-1.241c.608-.758.9-1.766.9-2.824 0-1.059-.292-2.067-.9-2.824-.62-.773-1.538-1.242-2.675-1.242ZM7.676 6.441c0-.842.233-1.554.624-2.042.38-.473.937-.774 1.7-.774.763 0 1.32.301 1.7.774.391.488.624 1.2.624 2.042 0 .842-.233 1.554-.624 2.041-.38.473-.937.774-1.7.774-.763 0-1.32-.3-1.7-.774-.391-.487-.624-1.2-.624-2.041ZM10 11.63c-2.7 0-5.101 1.315-6.12 3.305-.361.706-.199 1.421.23 1.923.412.48 1.06.767 1.74.767h8.3c.68 0 1.328-.287 1.74-.767.429-.502.591-1.217.23-1.923-1.02-1.99-3.42-3.305-6.12-3.305Zm-5.007 3.875c.761-1.488 2.672-2.626 5.007-2.626 2.335 0 4.246 1.138 5.007 2.626.105.204.07.378-.067.54-.156.182-.448.33-.79.33h-8.3c-.342 0-.634-.148-.79-.33-.138-.162-.172-.336-.067-.54Z"></path></svg>
          {isParticipantsActive ? (
            <input 
              autoFocus
              onBlur={() => setIsParticipantsActive(false)}
              className="w-full bg-transparent outline-none text-[#37352F] placeholder-[#a0a0a0]" 
              placeholder="Add participants" 
              value={participantsValue}
              onChange={(e) => setParticipantsValue(e.target.value)}
            />
          ) : participantsValue ? (
            <span className="flex-1 text-[#37352F] truncate">{participantsValue}</span>
          ) : (
            <span className="flex-1 text-[#a0a0a0] group-hover:text-[#37352F] transition-colors">Participants</span>
          )}
        </div>
        
        {/* Conferencing */}
        <div 
          ref={conferencingRef}
          onClick={(e) => handleDropdownClick(e, 'conferencing', conferencingRef)}
          className={`flex items-center text-[13px] cursor-pointer group ${openDropdown === 'conferencing' ? 'bg-[#f0f0f0] rounded-[6px] px-2 py-1.5 -ml-2' : ''}`}
        >
          {conferencing === 'Google Meet' ? (
            <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] mr-3 shrink-0"><path fill="#00832d" d="M21 5H3C1.9 5 1 5.9 1 7v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z" opacity=".2"/><path fill="#00832d" d="M21 6H3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1z"/><path fill="#0066cc" d="m18 10 3-3v10l-3-3z"/><path fill="#00832d" d="M6 10h8v4H6z"/><path fill="#fbbc04" d="M22 6h-6v12h6c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/><path fill="#ea4335" d="M8 6H2C.9 6 0 6.9 0 8v10c0 1.1.9 2 2 2h6l3-3-3-3V6z"/><path fill="#4285f4" d="M14 6h-6v8h6V6z"/><path fill="#34a853" d="M22 18h-6v-4l-3-3 3-3V4h6c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2z"/><path fill="#1a73e8" d="M22 6v4l-3-3V4h1c1.1 0 2 .9 2 2z"/></svg>
          ) : conferencing === 'Zoom' ? (
            <div className="w-[16px] h-[16px] bg-[#2D8CFF] rounded-full flex items-center justify-center mr-3 shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M17 10.5V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2v-3.5l5 5v-13l-5 5z"/></svg>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className={`w-[16px] h-[16px] mr-3 shrink-0 ${openDropdown === 'conferencing' ? 'text-[#a0a0a0]' : 'text-[#a0a0a0] group-hover:text-[#37352F] transition-colors'}`}><path fill="currentColor" d="M3.5 4.375A2.125 2.125 0 0 0 1.375 6.5v7c0 1.174.951 2.125 2.125 2.125h9a2.125 2.125 0 0 0 2.125-2.125v-1.084l3.239 1.962a.625.625 0 0 0 .948-.534V6.156a.625.625 0 0 0-.948-.534l-3.239 1.962V6.5A2.125 2.125 0 0 0 12.5 4.375h-9Zm11.125 6.58v-1.91l2.938-1.78v5.47l-2.938-1.78ZM13.375 6.5v7a.875.875 0 0 1-.875.875h-9a.875.875 0 0 1-.875-.875v-7c0-.483.392-.875.875-.875h9c.483 0 .875.392.875.875Z"></path></svg>
          )}
          
          <span className={`flex-1 transition-colors ${openDropdown === 'conferencing' || conferencing ? 'text-[#37352F]' : 'text-[#a0a0a0] group-hover:text-[#37352F]'}`}>
            {conferencing || 'Conferencing'}
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-[#a0a0a0] ${openDropdown === 'conferencing' ? 'rotate-180' : ''} transition-transform`}><path d="M6 9l6 6 6-6"/></svg>
        </div>

        {/* Location */}
        <div 
          onClick={() => { if (!isLocationActive) setIsLocationActive(true); }}
          className={`flex items-center text-[13px] ${isLocationActive ? 'bg-[#f0f0f0] rounded-[6px] px-2 py-1.5 -ml-2' : 'cursor-pointer group'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className={`w-[16px] h-[16px] mr-3 shrink-0 ${isLocationActive || locationValue ? 'text-[#a0a0a0]' : 'text-[#a0a0a0] group-hover:text-[#37352F] transition-colors'}`}><path fill="currentColor" d="M10 5.702a2.775 2.775 0 1 0 0 5.55 2.775 2.775 0 0 0 0-5.55ZM8.475 8.477a1.525 1.525 0 1 1 3.05 0 1.525 1.525 0 0 1-3.05 0Z"></path><path fill="currentColor" d="M10 2.125a6.19 6.19 0 0 0-6.19 6.19v.129c0 1.403.467 2.767 1.327 3.876l4.37 5.626a.625.625 0 0 0 .986 0l4.37-5.626a6.319 6.319 0 0 0 1.328-3.876v-.128A6.19 6.19 0 0 0 10 2.125Zm-4.94 6.19a4.94 4.94 0 1 1 9.88 0v.129c0 1.126-.374 2.22-1.065 3.109L10 16.543l-3.875-4.99a5.069 5.069 0 0 1-1.066-3.109v-.128Z"></path></svg>
          {isLocationActive ? (
            <input 
              autoFocus
              onBlur={() => setIsLocationActive(false)}
              className="w-full bg-transparent outline-none text-[#37352F] placeholder-[#a0a0a0]" 
              placeholder="Add location" 
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
            />
          ) : locationValue ? (
            <span className="flex-1 text-[#37352F] truncate">{locationValue}</span>
          ) : (
            <span className="flex-1 text-[#a0a0a0] group-hover:text-[#37352F] transition-colors">Location</span>
          )}
        </div>

        <div 
          ref={aiNotesRef}
          onClick={(e) => {
            if (!isAiNotesActive) setIsAiNotesActive(true);
            handleDropdownClick(e, 'ai_notes', aiNotesRef);
          }}
          className={`flex items-center text-[13px] ${isAiNotesActive ? 'bg-[#f0f0f0] rounded-[6px] px-2 py-1.5 -ml-2' : 'cursor-pointer group'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className={`w-[16px] h-[16px] mr-3 shrink-0 ${isAiNotesActive ? 'text-[#a0a0a0]' : 'text-[#a0a0a0] group-hover:text-[#37352F] transition-colors'}`}><path fill="currentColor" d="M13.3 14.25a.55.55 0 0 1-.55.55h-5.5a.55.55 0 1 1 0-1.1h5.5a.55.55 0 0 1 .55.55Zm-.55-1.95a.55.55 0 1 0 0-1.1h-5.5a.55.55 0 0 0 0 1.1h5.5Z"></path><path fill="currentColor" d="M6.25 2.375A2.125 2.125 0 0 0 4.125 4.5v11c0 1.174.951 2.125 2.125 2.125h7.5a2.125 2.125 0 0 0 2.125-2.125V8.121c0-.563-.224-1.104-.622-1.502L11.63 2.997a2.125 2.125 0 0 0-1.502-.622H6.25ZM5.375 4.5c0-.483.392-.875.875-.875h3.7V6.25A2.05 2.05 0 0 0 12 8.3h2.625v7.2a.875.875 0 0 1-.875.875h-7.5a.875.875 0 0 1-.875-.875v-11Zm8.691 2.7H12a.95.95 0 0 1-.95-.95V4.184L14.066 7.2Z"></path></svg>
          {isAiNotesActive ? (
            <input 
              autoFocus
              className="w-full bg-transparent outline-none text-[#37352F] placeholder-[#a0a0a0]" 
              placeholder="Search Notion or paste link..." 
              value={aiNotesValue}
              onChange={(e) => setAiNotesValue(e.target.value)}
            />
          ) : (
            <span className="flex-1 text-[#a0a0a0] group-hover:text-[#37352F] transition-colors">AI Meeting Notes and Docs</span>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-[#f0f0f0] shrink-0 my-2"></div>

      {/* Description */}
      <div className="px-4 py-2">
        <div className="text-[13px] text-[#a0a0a0]">Description</div>
      </div>

      <div className="w-full h-px bg-[#f0f0f0] shrink-0 my-2"></div>

      {/* Account Info */}
      <div className="px-4 py-2 flex flex-col space-y-[14px]">
        <div className="flex items-center text-[13px] text-[#37352F]">
          <div className="w-[14px] h-[14px] rounded-[4px] bg-[#3cb1ff] mr-3 shrink-0"></div>
          <span>einhart2312@gmail.com</span>
        </div>

        <div className="flex items-center pl-[26px] text-[13px] text-[#37352F] gap-2">
          {/* Busy Dropdown */}
          <div 
            ref={busyRef}
            onClick={(e) => handleDropdownClick(e, 'busy', busyRef)}
            className={`flex items-center cursor-pointer px-2 py-1 rounded-[6px] transition-colors ${openDropdown === 'busy' ? 'bg-[#e5e5e5]' : 'bg-[#f3f3f3] hover:bg-[#e9e9e9]'}`}
          >
            <span>{busyState}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`ml-1 text-[#a0a0a0] ${openDropdown === 'busy' ? 'rotate-180' : ''} transition-transform`}><path d="M6 9l6 6 6-6"/></svg>
          </div>

          {/* Visibility Dropdown */}
          <div 
            ref={visibilityRef}
            onClick={(e) => handleDropdownClick(e, 'visibility', visibilityRef)}
            className={`flex items-center cursor-pointer px-2 py-1 rounded-[6px] transition-colors ${openDropdown === 'visibility' ? 'bg-[#e5e5e5]' : 'bg-[#f3f3f3] hover:bg-[#e9e9e9]'}`}
          >
            <span>{visibilityState}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`ml-1 text-[#a0a0a0] ${openDropdown === 'visibility' ? 'rotate-180' : ''} transition-transform`}><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>

        <div className="flex flex-col mt-2 text-[13px]">
          {/* Trigger Row */}
          <div 
            ref={reminderTriggerRef}
            onClick={(e) => handleDropdownClick(e, 'reminders', reminderTriggerRef)}
            className={`flex items-center cursor-pointer py-1 px-2 -ml-2 rounded-[6px] transition-colors group ${openDropdown === 'reminders' ? 'bg-[#f0f0f0]' : 'hover:bg-[#f0f0f0]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className={`w-[16px] h-[16px] mr-3 shrink-0 ${openDropdown === 'reminders' ? 'text-[#37352F]' : 'text-[#a0a0a0] group-hover:text-[#37352F] transition-colors'}`}><path fill="currentColor" d="M10 2.355a2.35 2.35 0 0 0-2.253 1.686 5.055 5.055 0 0 0-2.803 4.527v1.189c0 .919-.334 1.806-.939 2.498l-.818.935c-.881 1.007-.166 2.583 1.173 2.583h3.02a2.65 2.65 0 0 0 5.24 0h3.02c1.339 0 2.054-1.576 1.173-2.583l-.818-.935a3.793 3.793 0 0 1-.939-2.498v-1.19a5.055 5.055 0 0 0-2.803-4.526A2.35 2.35 0 0 0 10 2.355Zm1.5 13.418a1.55 1.55 0 0 1-2.998 0H11.5ZM8.909 4.564A1.104 1.104 0 0 1 10 3.605c.556 0 1.017.415 1.091.96l.049.353.329.138a3.807 3.807 0 0 1 2.337 3.512v1.189c0 1.221.444 2.401 1.248 3.32l.818.936a.307.307 0 0 1-.232.51H4.36a.308.308 0 0 1-.232-.51l.818-.935a5.043 5.043 0 0 0 1.248-3.321v-1.19c0-1.58.963-2.936 2.337-3.511l.33-.138.048-.354Z"></path></svg>
            <span className={`${openDropdown === 'reminders' ? 'text-[#37352F]' : 'text-[#a0a0a0] group-hover:text-[#37352F]'} transition-colors`}>Reminders</span>
          </div>

          {/* List of Reminders */}
          {reminders.map((reminder, index) => (
            <div 
              key={index}
              className="flex items-center group py-1 pl-[28px] pr-2 mt-0.5 rounded-[6px] hover:bg-[#f0f0f0] transition-colors -ml-2 -mr-2"
            >
              <span className="flex-1 text-[#37352F]">
                {reminder === "At start of event" ? (
                  reminder
                ) : (
                  <>
                    <span className="font-semibold">{reminder.replace(' before', '')}</span> <span className="text-[#787774]">before</span>
                  </>
                )}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const newReminders = [...reminders];
                  newReminders.splice(index, 1);
                  setReminders(newReminders);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#e5e5e5] rounded-[4px] text-[#a0a0a0] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dropdowns */}
      {openDropdown === 'start' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] overflow-y-auto max-h-[300px]"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left, width: '140px' }}
        >
          {allStartTimes.map(time => (
            <button
              key={time}
              onClick={() => { 
                setStartTime(time); 
                // Auto-update end time to maintain duration
                setEndTime(formatMinsToTime(parseTimeToMins(time) + durationMins));
                setOpenDropdown(null); 
              }}
              className={`w-full text-left px-3 py-1.5 rounded-[6px] text-[13px] text-[#ebebeb] ${startTime === time ? 'bg-[#3f3f3f]' : 'hover:bg-[#3f3f3f]'} transition-colors`}
            >
              {time}
            </button>
          ))}
        </div>
      )}

      {openDropdown === 'end' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] overflow-y-auto max-h-[300px]"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left, width: '180px' }}
        >
          {dynamicEndTimes.map(({time, dur, durationMins: durMins}) => (
            <button
              key={time}
              onClick={() => { 
                setEndTime(time); 
                setDurationMins(durMins); 
                setOpenDropdown(null); 
              }}
              className={`flex items-center w-full text-left px-3 py-1.5 rounded-[6px] text-[13px] ${endTime === time ? 'bg-[#3f3f3f]' : 'hover:bg-[#3f3f3f]'} transition-colors`}
            >
              <span className="text-[#ebebeb] w-[65px] font-medium">{time}</span>
              <span className="text-[#a0a0a0]">{dur}</span>
            </button>
          ))}
        </div>
      )}

      {openDropdown === 'date' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] select-none"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left - 20, width: '260px' }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold text-[14px] text-[#ebebeb]">
              {monthNames[pickerDate.getMonth()]} {pickerDate.getFullYear()}
            </div>
            <div className="flex space-x-3 text-[#a0a0a0]">
              <svg onClick={handleGoToToday} className="w-4 h-4 hover:text-white cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h10a5 5 0 0 1 5 5v2"/><path d="M7 6 3 10l4 4"/></svg>
              <svg onClick={handlePrevMonth} className="w-4 h-4 hover:text-white cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <svg onClick={handleNextMonth} className="w-4 h-4 hover:text-white cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-[12px] font-medium text-[#a0a0a0] text-center">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          {/* Dates */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-[13px] text-center font-medium">
            {calendarDays.map((d, i) => {
              const isSelected = date.includes(`${d.day}`) && d.isCurrentMonth && date.includes(monthNames[pickerDate.getMonth()].substring(0, 3));
              return (
                <div 
                  key={i} 
                  onClick={(e) => { 
                    if (d.isCurrentMonth) {
                      e.stopPropagation();
                      const dayOfWeek = dayNames[(i % 7)];
                      const monthStr = monthNames[pickerDate.getMonth()].substring(0, 3);
                      setDate(`${dayOfWeek} ${monthStr} ${d.day}`);
                      setOpenDropdown(null);
                    }
                  }}
                  className={`p-1.5 flex items-center justify-center rounded-[6px] transition-colors ${!d.isCurrentMonth ? 'text-[#666666] cursor-default' : isSelected ? 'bg-[#3f3f3f] text-[#ebebeb] cursor-pointer' : 'text-[#ebebeb] hover:bg-[#3f3f3f] cursor-pointer'}`}
                >
                  {d.day}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {openDropdown === 'timezone' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] overflow-y-auto max-h-[300px]"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left - 350 - 8, 
            width: '350px' 
          }}
        >
          {timeZones.map((tz) => (
            <button
              key={tz.full}
              onClick={() => { 
                setTimeZoneGmt(tz.gmtShort); 
                setTimeZoneCity(tz.city); 
                setOpenDropdown(null); 
              }}
              className={`flex items-center w-full text-left px-3 py-1.5 text-[13px] ${timeZoneCity === tz.city ? 'bg-[#3f3f3f]' : 'hover:bg-[#3f3f3f]'} transition-colors`}
            >
              <span className="text-[#a0a0a0] w-[80px] shrink-0 font-medium">{tz.gmt}</span>
              <span className="text-[#ebebeb] truncate">{tz.full}</span>
            </button>
          ))}
        </div>
      )}
      {openDropdown === 'conferencing' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] w-[240px]"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left - 240 - 8, 
          }}
        >
          <button 
            onClick={() => { setConferencing('Google Meet'); setOpenDropdown(null); }}
            className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] mr-3 shrink-0"><path fill="#00832d" d="M21 5H3C1.9 5 1 5.9 1 7v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z" opacity=".2"/><path fill="#00832d" d="M21 6H3c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1z"/><path fill="#0066cc" d="m18 10 3-3v10l-3-3z"/><path fill="#00832d" d="M6 10h8v4H6z"/><path fill="#fbbc04" d="M22 6h-6v12h6c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/><path fill="#ea4335" d="M8 6H2C.9 6 0 6.9 0 8v10c0 1.1.9 2 2 2h6l3-3-3-3V6z"/><path fill="#4285f4" d="M14 6h-6v8h6V6z"/><path fill="#34a853" d="M22 18h-6v-4l-3-3 3-3V4h6c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2z"/><path fill="#1a73e8" d="M22 6v4l-3-3V4h1c1.1 0 2 .9 2 2z"/></svg>
            Google Meet
          </button>
          <button 
            onClick={() => { setConferencing('Zoom'); setOpenDropdown(null); }}
            className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors justify-between"
          >
            <div className="flex items-center">
              <div className="w-[16px] h-[16px] bg-[#2D8CFF] rounded-full flex items-center justify-center mr-3 shrink-0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M17 10.5V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2v-3.5l5 5v-13l-5 5z"/></svg>
              </div>
              Zoom
            </div>
            <span className="text-[#a0a0a0]">Connect</span>
          </button>
          
          <div className="h-px w-full bg-[#3f3f3f] my-1.5"></div>
          
          <button className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 shrink-0 text-[#a0a0a0]"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            Manage conferencing
          </button>
        </div>
      )}

      {openDropdown === 'ai_notes' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] w-[280px]"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left - 280 - 8, 
          }}
        >
          <div className="px-3 py-1 text-[11px] font-semibold text-[#a0a0a0] mt-1">Create new page</div>
          
          <button className="flex items-start w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-3 shrink-0 mt-0.5 text-[#a0a0a0]"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/></svg>
            <div className="flex flex-col">
              <span className="font-medium">Add AI Meeting Note</span>
              <span className="text-[#a0a0a0] text-[12px] leading-tight mt-0.5">Notion will create a page to transcribe and summarize when you join the meeting</span>
            </div>
          </button>
          
          <button className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 shrink-0 text-[#a0a0a0]"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span className="font-medium">Add blank Notion page</span>
          </button>

          <div className="h-px w-full bg-[#3f3f3f] my-1.5"></div>
          
          <div className="px-3 py-1 text-[11px] font-semibold text-[#a0a0a0]">Link existing page</div>
          
          <button className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-3 shrink-0 text-[#a0a0a0]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            <span>Untitled</span>
          </button>
          
          <button className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors">
            <span className="mr-3 text-[16px] leading-none flex items-center justify-center">👋</span>
            <span>Getting Started</span>
          </button>

          <div className="h-px w-full bg-[#3f3f3f] my-1.5"></div>
          
          <div className="px-3 py-1 text-[11px] font-semibold text-[#a0a0a0]">Change workspace</div>
          
          <button className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors justify-between">
            <div className="flex items-center">
              <div className="w-[16px] h-[16px] bg-[#3f3f3f] text-[#ebebeb] text-[10px] flex items-center justify-center mr-3 rounded-[2px] font-medium shrink-0">T</div>
              <span>Trường Quang's Space</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a0a0a0]"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}

      {openDropdown === 'reminders' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] w-[200px]"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left - 200 - 8, 
          }}
        >
          {['At start of event', '5 min before', '10 min before', '30 min before', '1 hour before'].map((option) => (
            <button 
              key={option}
              onClick={() => {
                if (!reminders.includes(option)) {
                  setReminders([...reminders, option]);
                }
                setOpenDropdown(null);
              }}
              className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors"
            >
              {option === 'At start of event' ? (
                option
              ) : (
                <>
                  <span className="font-medium mr-1">{option.replace(' before', '')}</span>
                  <span className="text-[#a0a0a0]">before</span>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {openDropdown === 'busy' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] w-[180px]"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left - 180 - 8, 
          }}
        >
          {['Busy', 'Free'].map((option) => (
            <button 
              key={option}
              onClick={() => {
                setBusyState(option);
                setOpenDropdown(null);
              }}
              className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors justify-between"
            >
              <div className="flex items-center">
                <div className="w-[16px] mr-2 flex justify-center">
                  {busyState === option && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <span>{option}</span>
              </div>
              {option === 'Busy' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a0a0a0]"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              )}
            </button>
          ))}
        </div>
      )}

      {openDropdown === 'visibility' && dropdownPosition && (
        <div 
          className="fixed z-[100] dropdown-container bg-[#262626] rounded-[8px] py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] border border-[#3f3f3f] w-[200px]"
          style={{ 
            top: dropdownPosition.top, 
            left: dropdownPosition.left - 200 - 8, 
          }}
        >
          {['Default visibility', 'Public', 'Private'].map((option) => (
            <button 
              key={option}
              onClick={() => {
                setVisibilityState(option);
                setOpenDropdown(null);
              }}
              className="flex items-center w-full text-left px-3 py-1.5 text-[13px] text-[#ebebeb] hover:bg-[#3f3f3f] transition-colors justify-between"
            >
              <div className="flex items-center">
                <div className="w-[16px] mr-2 flex justify-center">
                  {visibilityState === option && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>}
                </div>
                <span>{option}</span>
              </div>
              {option === 'Default visibility' && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#a0a0a0]"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
