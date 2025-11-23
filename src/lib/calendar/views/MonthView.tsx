import React from "react";
import { format, isSameMonth, isSameDay, isToday } from "date-fns";
import { type CalendarEvent } from "../types";
import { useCalendarDays } from "../hooks/useCalendarDays";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EventPopup } from "../components/EventPopup";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
}) => {
  const days = useCalendarDays(currentDate);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  return (
    <div className="flex flex-col h-full border-t">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-sm font-semibold text-muted-foreground border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={cn(
                "relative border-b border-r p-2 flex flex-col gap-1 transition-colors hover:bg-muted/5",
                !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                dayIdx % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                    isToday(day) && "bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <Popover key={event.id}>
                    <PopoverTrigger asChild>
                      <div
                        className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary truncate cursor-pointer hover:bg-primary/20 transition-colors border border-primary/10"
                        style={
                          event.color
                            ? {
                                backgroundColor: `${event.color}20`,
                                color: event.color,
                                borderColor: `${event.color}40`,
                              }
                            : undefined
                        }
                        onClick={(e) => e.stopPropagation()}
                      >
                        {event.title}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                      <EventPopup event={event} />
                    </PopoverContent>
                  </Popover>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-muted-foreground pl-1">
                    + {dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
