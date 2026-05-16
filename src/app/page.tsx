"use client";

import { useState, useEffect, useCallback } from "react";
import { SidebarHeader } from "@/components/SidebarHeader";
import { MiniCalendar } from "@/components/MiniCalendar";
import { SchedulingSection } from "@/components/SchedulingSection";
import { CalendarAccounts } from "@/components/CalendarAccounts";
import { SchedulingPanel } from "@/components/SchedulingPanel";
import RightSidebar from "@/components/RightSidebar";
import { MainCalendar } from "@/components/MainCalendar";
import { EventView } from "@/components/EventView";

export default function Home() {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [rightSidebarView, setRightSidebarView] = useState<"default" | "recurring" | "event">("default");
  const [events, setEvents] = useState<any[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [popoverCoords, setPopoverCoords] = useState<{ x: number, y: number } | null>(null);

  const getCoordsForDateAndTime = useCallback((dateStr: string, timeStr: string) => {
    if (typeof document === 'undefined') return null;
    const parts = dateStr.split(' ');
    if (parts.length >= 3) {
      const monthStr = parts[1];
      const day = parseInt(parts[2], 10);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months.indexOf(monthStr);
      if (month !== -1 && !isNaN(day)) {
        const ts = new Date(new Date().getFullYear(), month, day).getTime();
        const column = document.querySelector(`[data-grid-date="${ts}"]`);
        if (column) {
          const rect = column.getBoundingClientRect();
          const timeParts = timeStr.split(' ');
          if (timeParts.length >= 2) {
            const [hm, ampm] = timeParts;
            const [hStr, mStr] = hm.split(':');
            let h = parseInt(hStr, 10);
            const m = parseInt(mStr || "0", 10);
            if (ampm.toLowerCase() === 'pm' && h < 12) h += 12;
            if (ampm.toLowerCase() === 'am' && h === 12) h = 0;
            const hourFloat = h + m / 60;
            return {
              x: rect.right + 10,
              y: rect.top + hourFloat * 48
            };
          }
        }
      }
    }
    return null;
  }, []);

  const activeEvent = events.find(e => e.id === activeEventId) || null;

  useEffect(() => {
    if (!isRightSidebarOpen && activeEvent && rightSidebarView === "event") {
      let isDateChanged = false;
      const parts = activeEvent.date.split(' ');
      if (parts.length >= 3) {
        const monthStr = parts[1];
        const day = parseInt(parts[2], 10);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months.indexOf(monthStr);
        if (month !== -1 && !isNaN(day)) {
          const targetDate = new Date(new Date().getFullYear(), month, day);
          
          const startOfWeek = new Date(baseDate);
          startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
          startOfWeek.setHours(0,0,0,0);
          
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23,59,59,999);
          
          if (targetDate.getTime() < startOfWeek.getTime() || targetDate.getTime() > endOfWeek.getTime()) {
            setBaseDate(targetDate);
            isDateChanged = true;
          }
        }
      }

      setTimeout(() => {
        const coords = getCoordsForDateAndTime(activeEvent.date, activeEvent.startTime);
        if (coords) {
          setPopoverCoords(coords);
        }
      }, isDateChanged ? 100 : 10);
    }
  }, [activeEvent?.date, activeEvent?.startTime, isRightSidebarOpen, rightSidebarView, getCoordsForDateAndTime]);

  useEffect(() => {
    if (selectedDate) {
      const timer = setTimeout(() => {
        setSelectedDate(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedDate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key.toLowerCase() === 'c') {
        const today = new Date(2026, 4, 16);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateStr = `${dayNames[today.getDay()]} ${monthNames[today.getMonth()]} ${today.getDate()}`;
        const startTime = "11:30 PM";
        
        const id = Math.random().toString(36).substr(2, 9);
        const newEvent = {
          id,
          title: "New Event",
          date: dateStr,
          startTime,
          endTime: "12:00 AM",
          color: "bg-[#3cb1ff]"
        };
        setEvents(prev => [...prev, newEvent]);
        setActiveEventId(id);
        setRightSidebarView("event");
        if (!isRightSidebarOpen) {
          const coords = getCoordsForDateAndTime(dateStr, startTime);
          setPopoverCoords(coords || { x: window.innerWidth / 2 - 142, y: Math.max(100, window.innerHeight / 2 - 200) });
        } else {
          setIsRightSidebarOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-neutral-800 relative">
      {/* Sidebar Container */}
      <div 
        className={`h-full border-neutral-200 bg-[#f9f9f9] flex flex-col pt-2 shrink-0 z-40 relative transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isLeftSidebarOpen ? 'w-[240px] border-r overflow-visible' : 'w-0 border-r-0 overflow-hidden'}`}
      >
        <div className="w-[240px] flex flex-col h-full shrink-0">
          <SidebarHeader 
            onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} 
            onEditClick={(e) => {
              const today = new Date(2026, 4, 16);
              const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const dateStr = `${dayNames[today.getDay()]} ${monthNames[today.getMonth()]} ${today.getDate()}`;
              const startTime = "11:30 PM";
              
              const id = Math.random().toString(36).substr(2, 9);
              const newEvent = {
                id,
                title: "New Event",
                date: dateStr,
                startTime,
                endTime: "12:00 AM",
                color: "bg-[#3cb1ff]"
              };
              setEvents(prev => [...prev, newEvent]);
              setActiveEventId(id);
              setRightSidebarView("event");
              if (!isRightSidebarOpen) {
                const coords = getCoordsForDateAndTime(dateStr, startTime);
                setPopoverCoords(coords || { x: window.innerWidth / 2 - 142, y: Math.max(100, window.innerHeight / 2 - 200) });
              } else {
                setIsRightSidebarOpen(true);
              }
            }}
          />
          <MiniCalendar baseDate={baseDate} setBaseDate={setBaseDate} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <SchedulingSection onSchedulingClick={() => setIsSchedulingOpen(!isSchedulingOpen)} />
          <CalendarAccounts />
          
          {/* The rest of the sidebar will go here */}
        </div>
      </div>
      
      {/* Scheduling Panel Overlay */}
      <div 
        className={`absolute left-[240px] top-0 h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.08)] bg-white transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] origin-left
          ${isSchedulingOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-[10%] opacity-0 invisible pointer-events-none'}`}
      >
        <SchedulingPanel 
          onClose={() => setIsSchedulingOpen(false)} 
          onCreateRecurringLink={() => {
            setIsSchedulingOpen(false);
            setIsRightSidebarOpen(true);
            setRightSidebarView("recurring");
          }}
        />
      </div>
      
      {/* Main Content Container */}
      <div className="flex-1 h-full bg-white flex flex-col min-w-0 z-10">
        <MainCalendar 
          baseDate={baseDate}
          setBaseDate={setBaseDate}
          selectedDate={selectedDate}
          isRightSidebarOpen={isRightSidebarOpen} 
          onOpenRightSidebar={() => setIsRightSidebarOpen(true)} 
          isLeftSidebarOpen={isLeftSidebarOpen}
          onOpenLeftSidebar={() => setIsLeftSidebarOpen(true)}
          isRecurringMode={rightSidebarView === "recurring"}
          events={events}
          setEvents={setEvents}
          onEventClick={(event, coords) => {
            setActiveEventId(event.id);
            setRightSidebarView("event");
            if (!isRightSidebarOpen) {
              setPopoverCoords(coords);
            } else {
              setIsRightSidebarOpen(true);
            }
          }}
          onCreateEventClick={(date, startTime, coords) => {
            const id = Math.random().toString(36).substr(2, 9);
            
            let endTime = "9:00 PM";
            try {
              const [time, ampm] = startTime.split(' ');
              let [h, m] = time.split(':').map(Number);
              let h24 = ampm === 'PM' && h !== 12 ? h + 12 : (ampm === 'AM' && h === 12 ? 0 : h);
              
              m += 30;
              if (m >= 60) {
                m -= 60;
                h24 += 1;
              }
              
              const endAmpm = h24 >= 12 && h24 < 24 ? 'PM' : 'AM';
              let displayH = h24 % 12;
              if (displayH === 0) displayH = 12;
              
              endTime = `${displayH}:${m === 0 ? '00' : '30'} ${endAmpm}`;
            } catch (e) {}

            const newEvent = {
              id,
              title: "New Event",
              date,
              startTime,
              endTime,
              color: "bg-[#3cb1ff]"
            };
            setEvents(prev => [...prev, newEvent]);
            setActiveEventId(id);
            setRightSidebarView("event");
            if (!isRightSidebarOpen) {
              setPopoverCoords(coords);
            } else {
              setIsRightSidebarOpen(true);
            }
          }}
        />
      </div>

      {/* Event Popover */}
      {!isRightSidebarOpen && rightSidebarView === "event" && popoverCoords && (
        <>
          <div className="fixed inset-0 z-40 animate-in fade-in duration-200" onClick={() => {
            setActiveEventId(null);
            setPopoverCoords(null);
          }}></div>
          <div 
            className="fixed z-50 shadow-[0_4px_24px_rgba(0,0,0,0.15)] rounded-xl border border-neutral-200 bg-white w-[284px] h-[550px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-top-left transition-all ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ 
              top: Math.min(popoverCoords.y, typeof window !== 'undefined' ? window.innerHeight - 560 : popoverCoords.y), 
              left: Math.min(popoverCoords.x + 20, typeof window !== 'undefined' ? window.innerWidth - 300 : popoverCoords.x) 
            }}
          >
            <EventView 
              onClose={() => {
                setActiveEventId(null);
                setPopoverCoords(null);
              }} 
              onDockToSidebar={() => {
                setPopoverCoords(null);
                setIsRightSidebarOpen(true);
              }}
              onSaveEvent={(newEvent) => {
                if (!activeEventId) {
                  setActiveEventId(newEvent.id);
                }
                setEvents((prev) => {
                  const index = prev.findIndex(e => e.id === newEvent.id);
                  if (index >= 0) {
                    const newEvents = [...prev];
                    newEvents[index] = newEvent;
                    return newEvents;
                  } else {
                    return [...prev, newEvent];
                  }
                });
              }}
              onDeleteEvent={(id) => {
                setEvents(prev => prev.filter(e => e.id !== id));
                setActiveEventId(null);
                setRightSidebarView("default");
                setPopoverCoords(null);
              }}
              activeEvent={activeEvent} 
            />
          </div>
        </>
      )}

      {/* Right Sidebar */}
      <RightSidebar 
        isOpen={isRightSidebarOpen} 
        onClose={() => setIsRightSidebarOpen(false)} 
        view={rightSidebarView}
        onChangeView={setRightSidebarView}
        onSaveEvent={(newEvent) => {
          if (!activeEventId) {
            setActiveEventId(newEvent.id);
          }
          setEvents((prev) => {
            const index = prev.findIndex(e => e.id === newEvent.id);
            if (index >= 0) {
              const newEvents = [...prev];
              newEvents[index] = newEvent;
              return newEvents;
            } else {
              return [...prev, newEvent];
            }
          });
        }}
        onDeleteEvent={(id) => {
          setEvents(prev => prev.filter(e => e.id !== id));
          setActiveEventId(null);
          setRightSidebarView("default");
        }}
        activeEvent={activeEvent}
      />
    </div>
  );
}
