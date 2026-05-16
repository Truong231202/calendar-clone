import React, { useEffect, useState } from 'react';

export const MiniCalendar = ({ baseDate, setBaseDate, selectedDate, setSelectedDate }: { baseDate: Date, setBaseDate: (date: Date) => void, selectedDate?: Date | null, setSelectedDate?: (date: Date | null) => void }) => {
  const [displayMonth, setDisplayMonth] = useState(() => new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
  }, [baseDate]);

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  const startDate = new Date(displayMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks = [];
  const currentDay = new Date(startDate);

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      week.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  }

  const isSameWeek = (date: Date, base: Date) => {
    const baseStart = new Date(base);
    baseStart.setDate(base.getDate() - base.getDay());
    baseStart.setHours(0, 0, 0, 0);

    const baseEnd = new Date(baseStart);
    baseEnd.setDate(baseStart.getDate() + 6);
    baseEnd.setHours(23, 59, 59, 999);

    return date >= baseStart && date <= baseEnd;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === displayMonth.getMonth();
  };

  return (
    <div className="w-full px-2 py-2">
      {/* Header controls */}
      <div className="flex justify-end items-center mb-2 px-1">
        <div className="flex gap-0.5">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-4 h-4">
              <path fill="currentColor" d="M10.442 6.558a.625.625 0 0 0-.884 0l-5.4 5.4a.625.625 0 1 0 .884.884L10 7.884l4.958 4.958a.625.625 0 1 0 .884-.884l-5.4-5.4Z"></path>
            </svg>
          </button>
          <button
            onClick={handleNextMonth}
            aria-label="Next month"
            className="flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-200/60 text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-4 h-4">
              <path fill="currentColor" d="M9.558 13.442c.244.244.64.244.884 0l5.4-5.4a.625.625 0 1 0-.884-.884L10 12.116 5.042 7.158a.625.625 0 0 0-.884.884l5.4 5.4Z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <table className="w-full text-[12px] border-collapse select-none">
        <thead>
          <tr>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <th key={day} className="text-neutral-500 pb-2 text-center w-7 h-7 font-medium text-[10px]">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wIndex) => (
            <tr key={wIndex}>
              {week.map((date, dIndex) => {
                const activeWeek = isSameWeek(date, baseDate);
                const today = isToday(date);
                const currentMonth = isCurrentMonth(date);

                let cellClass = "text-center w-7 h-7 cursor-pointer relative ";
                
                if (activeWeek) {
                  cellClass += "bg-[#f1f1f1] text-neutral-900 font-medium ";
                  if (dIndex === 0) cellClass += "rounded-l-md ";
                  if (dIndex === 6) cellClass += "rounded-r-md ";
                } else {
                  cellClass += currentMonth ? "text-neutral-900 font-medium hover:bg-neutral-100 rounded " : "text-neutral-400 ";
                }

                return (
                  <td 
                    key={dIndex} 
                    className={cellClass}
                    onClick={() => {
                      setBaseDate(new Date(date));
                      if (setSelectedDate) setSelectedDate(new Date(date));
                    }}
                  >
                    {today ? (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 bg-[#ef4444] text-white rounded font-medium shadow-sm z-10">
                        {date.getDate()}
                      </div>
                    ) : (
                      date.getDate()
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
