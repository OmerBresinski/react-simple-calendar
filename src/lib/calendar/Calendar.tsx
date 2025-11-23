import React, { useState } from "react";
import { type CalendarProps, type ViewType } from "./types";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";
import { DayView } from "./views/DayView";
import { CalendarHeader } from "./components/CalendarHeader";
import { cn } from "@/lib/utils";

export const Calendar: React.FC<CalendarProps> = ({
  events,
  defaultView = "month",
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>(defaultView);

  return (
    <div className={cn("flex flex-col h-full w-full bg-background border rounded-lg overflow-hidden shadow-sm", className)}>
      <CalendarHeader
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        view={view}
        onViewChange={setView}
      />
      <div className="flex-1 overflow-hidden">
        {view === "month" && (
          <MonthView currentDate={currentDate} events={events} />
        )}
        {view === "week" && (
          <WeekView currentDate={currentDate} events={events} />
        )}
        {view === "day" && (
          <DayView currentDate={currentDate} events={events} />
        )}
      </div>
    </div>
  );
};

