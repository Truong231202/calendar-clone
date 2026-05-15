import { CalendarToolbar } from "@/sections/CalendarShell/components/CalendarToolbar";
import { WeekCalendar } from "@/sections/CalendarShell/components/WeekCalendar";

export const MainCalendar = () => {
  return (
    <div className="absolute box-border caret-transparent flex basis-[0%] flex-col grow outline-[3px] z-[1] overflow-hidden left-60 right-[284px] inset-y-0">
      <CalendarToolbar />
      <WeekCalendar />
    </div>
  )
}