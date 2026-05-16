"use client";

import { useState } from "react";
import { SidebarHeader } from "@/components/SidebarHeader";
import { MiniCalendar } from "@/components/MiniCalendar";
import { SchedulingSection } from "@/components/SchedulingSection";
import { CalendarAccounts } from "@/components/CalendarAccounts";
import { SchedulingPanel } from "@/components/SchedulingPanel";
import RightSidebar from "@/components/RightSidebar";
import { MainCalendar } from "@/components/MainCalendar";

export default function Home() {
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [rightSidebarView, setRightSidebarView] = useState<"default" | "recurring" | "event">("default");
  const [events, setEvents] = useState<any[]>([]);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const activeEvent = events.find(e => e.id === activeEventId) || null;

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-neutral-800 relative">
      {/* Sidebar Container */}
      <div 
        className={`h-full border-neutral-200 bg-[#f9f9f9] flex flex-col pt-2 shrink-0 z-30 relative transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden
          ${isLeftSidebarOpen ? 'w-[240px] border-r' : 'w-0 border-r-0'}`}
      >
        <div className="w-[240px] flex flex-col h-full shrink-0">
          <SidebarHeader 
            onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)} 
            onEditClick={() => {
              setActiveEventId(null);
              setIsRightSidebarOpen(true);
              setRightSidebarView("event");
            }}
          />
          <MiniCalendar baseDate={baseDate} setBaseDate={setBaseDate} />
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
          isRightSidebarOpen={isRightSidebarOpen} 
          onOpenRightSidebar={() => setIsRightSidebarOpen(true)} 
          isLeftSidebarOpen={isLeftSidebarOpen}
          onOpenLeftSidebar={() => setIsLeftSidebarOpen(true)}
          isRecurringMode={rightSidebarView === "recurring"}
          events={events}
          setEvents={setEvents}
          onEventClick={(event) => {
            setActiveEventId(event.id);
            setRightSidebarView("event");
            setIsRightSidebarOpen(true);
          }}
        />
      </div>

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
        activeEvent={activeEvent}
      />
    </div>
  );
}
