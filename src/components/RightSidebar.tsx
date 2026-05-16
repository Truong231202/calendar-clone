import React, { useState } from "react";
import { RecurringLinkView } from "./RecurringLinkView";
import { EventView } from "./EventView";

const RightSidebar = ({ 
  isOpen, 
  onClose,
  view,
  onChangeView,
  onSaveEvent,
  activeEvent,
  onDeleteEvent
}: { 
  isOpen: boolean; 
  onClose?: () => void;
  view: "default" | "recurring" | "event";
  onChangeView: (view: "default" | "recurring" | "event") => void;
  onSaveEvent?: (event: any) => void;
  activeEvent?: any;
  onDeleteEvent?: (id: string) => void;
}) => {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);

  return (
    <div 
      className={`h-full bg-white shrink-0 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${
        isOpen ? 'w-[284px] border-l border-neutral-200' : 'w-0 border-l-0'
      }`}
    >
      {view === "recurring" ? (
        <RecurringLinkView onBack={() => onChangeView("default")} />
      ) : view === "event" ? (
        <EventView onBack={() => onChangeView("default")} onSaveEvent={onSaveEvent} activeEvent={activeEvent} onDeleteEvent={onDeleteEvent} />
      ) : (
        <div className="w-[284px] h-full flex flex-col shrink-0">
          {/* Search Header */}
          <div className="flex flex-col pt-[8px] pb-[8px] pl-[8px] pr-[10px]">
            <div className="flex items-center space-x-2">
              {/* Search Input Container */}
              <div className="relative flex-1 flex items-center bg-transparent hover:bg-neutral-100 focus-within:bg-[#F3F4F6] transition-colors rounded-[6px] px-2 h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  className="w-[18px] h-[18px] text-neutral-500 mr-2 shrink-0"
                >
                  <path
                    fill="currentColor"
                    d="M14.75 10.875a3.625 3.625 0 0 1 2.938 5.747l1.283 1.467.073.102a.626.626 0 0 1-1.015.72l-1.239-1.416a3.625 3.625 0 1 1-2.04-6.62Zm0 1.25a2.375 2.375 0 1 0 0 4.75 2.375 2.375 0 0 0 0-4.75Z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M14.375 5A2.625 2.625 0 0 1 17 7.625v2.69a4.718 4.718 0 0 0-1.25-.459V7.625c0-.76-.616-1.375-1.375-1.375h-8.75c-.76 0-1.375.616-1.375 1.375v4.45c0 .76.616 1.375 1.375 1.375h4.493a4.759 4.759 0 0 0-.113 1.25h-4.38A2.625 2.625 0 0 1 3 12.075v-4.45A2.625 2.625 0 0 1 5.625 5h8.75Z"
                  ></path>
                </svg>
                <input
                  className="bg-transparent border-none outline-none text-[13px] text-neutral-800 placeholder-neutral-500 w-full"
                  placeholder="Search events"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  type="text"
                />
              </div>

              {/* Filter/Slider Button */}
              <button 
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-[6px] hover:bg-neutral-100 transition-colors shrink-0 text-neutral-500"
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
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-5">
            {/* Welcome Section */}
            {isWelcomeVisible && (
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-[2px] pr-[2px] pl-[8px]">
                <span className="text-[13px] font-medium font-sans text-neutral-800">
                  Welcome to Notion Calendar
                </span>
                <button type="button" onClick={() => setIsWelcomeVisible(false)} className="flex items-center justify-center w-6 h-6 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded transition-colors">
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                      className="w-4 h-4"
                    >
                      <path
                        fill="currentColor"
                        d="M15.692 5.192a.625.625 0 1 0-.884-.884L10 9.116 5.192 4.308a.625.625 0 1 0-.884.884L9.116 10l-4.808 4.808a.625.625 0 1 0 .884.884L10 10.884l4.808 4.808a.625.625 0 1 0 .884-.884L10.884 10l4.808-4.808Z"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>

              <div className=" px-[8px] pt-[6px] pb-[10px] mb-[1px]">
                <ul className="flex flex-col space-y-1">
                  {[
                    "Use ⌘K command palette",
                    "Connect another calendar",
                    "Connect Notion workspace",
                    "Create scheduling link",
                    "Create recurring link"
                  ].map((text, idx) => (
                    <li key={idx}>
                      <div
                        role="button"
                        onClick={() => {
                          if (text === "Create recurring link") {
                            onChangeView("recurring");
                          }
                        }}
                        className="flex items-center py-1.5 px-2 -mx-2 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer group"
                      >
                        <div role="button" className="relative flex items-center justify-center w-[18px] h-[18px] border border-neutral-300 rounded-full mr-3 bg-transparent group-hover:border-neutral-400 transition-colors shrink-0">
                          <input type="checkbox" readOnly className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                        <div className="text-[13px] font-normal text-neutral-700 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                          {text}
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 16 16"
                          className="w-4 h-4 text-neutral-400 ml-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <path
                            fill="currentColor"
                            d="M2.8 3.375A1.825 1.825 0 0 0 .975 5.2v5.6c0 1.008.817 1.825 1.825 1.825H10a1.825 1.825 0 0 0 1.825-1.825v-.645l2.401 1.455a.625.625 0 0 0 .95-.535v-6.15a.625.625 0 0 0-.95-.535l-2.4 1.455V5.2A1.825 1.825 0 0 0 10 3.375H2.8ZM2.225 5.2c0-.318.258-.575.575-.575H10c.318 0 .575.257.575.575v5.6a.575.575 0 0 1-.575.575H2.8a.575.575 0 0 1-.575-.575V5.2Zm9.6 3.493V7.307l2.1-1.273v3.932l-2.1-1.273Z"
                          ></path>
                        </svg>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              </div>
            )}

            {/* Useful Shortcuts Section */}
            <div className={`flex flex-col ${isWelcomeVisible ? 'border-t border-neutral-200 py-[10px]' : 'pt-0 pb-[10px]'} px-2`}>
              <div
                className="text-[13px] pb-2 text-neutral-800 mb-[2px]"
                style={{ fontFamily: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji", "Noto Sans Arabic", "Noto Sans Hebrew", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"' }}
              >
                Useful shortcuts
              </div>
              <ul className="flex flex-col space-y-1">
                {[
                  { label: "Command menu", keys: ["Ctrl", "K"] },
                  { label: "Toggle sidebar", keys: ["`"] },
                  { label: "Go to date", keys: ["."] },
                  { label: "Show teammate calendar", keys: ["P"] },
                  { label: "All keyboard shortcuts", keys: ["?"] },
                ].map((shortcut, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between -mx-[1px] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                  >
                    <div className="text-[13px] font-normal text-neutral-400">
                      {shortcut.label}
                    </div>
                    <span className="flex items-center space-x-1">
                      {shortcut.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-white border border-neutral-200 rounded text-[11px] font-medium text-neutral-500 shadow-sm font-sans"
                        >
                          {k}
                        </kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
