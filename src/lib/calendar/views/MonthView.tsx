import React, { useState } from "react";
import { format, isSameMonth, isSameDay, isToday } from "date-fns";
import { type CalendarEvent } from "../types";
import { useCalendarDays } from "../hooks/useCalendarDays";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [anchorPosition, setAnchorPosition] = useState<{ x: number; y: number } | null>(null);

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEvent(event);
    setAnchorPosition({ x: e.clientX, y: e.clientY });
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
                  <div
                    key={event.id}
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
                    onClick={(e) => handleEventClick(e, event)}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                        <div 
                            className="text-[10px] text-muted-foreground pl-1 cursor-pointer hover:underline hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            + {dayEvents.length - 3} more
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2" align="start" side="right" sideOffset={10} collisionPadding={10}>
                        <div className="text-xs font-semibold mb-2 px-2 pb-2 border-b">
                            {format(day, "MMMM d, yyyy")}
                        </div>
                        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                            {dayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className="px-2 py-1.5 text-xs rounded hover:bg-muted cursor-pointer transition-colors flex items-center gap-2"
                                    onClick={(e) => handleEventClick(e, event)}
                                >
                                    <div 
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: event.color || "currentColor" }}
                                    />
                                    <span className="font-medium text-muted-foreground whitespace-nowrap flex-shrink-0">{format(event.start, "h:mm a")}</span>
                                    <span className="truncate font-medium">{event.title}</span>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Popover
        key={selectedEvent?.id}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        {anchorPosition && (
            <PopoverAnchor
                style={{
                    position: "fixed",
                    left: anchorPosition.x,
                    top: anchorPosition.y,
                    width: 0,
                    height: 0,
                }}
            />
        )}
        <PopoverContent className="w-80" collisionPadding={10}>
          {selectedEvent && <EventPopup event={selectedEvent} />}
        </PopoverContent>
      </Popover>
    </div>
  );
};
