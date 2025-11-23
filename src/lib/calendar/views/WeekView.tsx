import React, { useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  differenceInMinutes,
  isToday,
} from "date-fns";
import { type CalendarEvent } from "../types";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { EventPopup } from "../components/EventPopup";
import { calculateEventLayout } from "../layout";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const startDate = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [anchorPosition, setAnchorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleEventClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEvent(event);
    setAnchorPosition({ x: e.clientX, y: e.clientY });
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(event.start, day));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex border-b sticky top-0 bg-background z-20 shadow-sm">
        <div className="w-16 flex-shrink-0 border-r bg-muted/5" />
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={cn(
                "p-2 text-center border-r last:border-r-0 flex flex-col items-center justify-center transition-colors min-w-0",
                isToday(day) ? "bg-primary/5" : "bg-background"
              )}
            >
              <div className="text-xs font-medium text-muted-foreground uppercase mb-1">
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full transition-all",
                  isToday(day)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex min-h-[1200px] h-[1200px] relative">
          {/* Time Labels */}
          <div className="w-16 flex-shrink-0 border-r bg-background z-10 sticky left-0">
            {hours.map((hour) => (
              <div key={hour} className="h-[50px] relative">
                <span className="absolute -top-2.5 right-2 text-xs text-muted-foreground bg-background px-1 font-medium">
                  {format(new Date().setHours(hour, 0, 0, 0), "h a")}
                </span>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="flex-1 grid grid-cols-7 relative">
            {/* Horizontal Lines (Hours) */}
            <div className="absolute inset-0 grid grid-rows-[repeat(24,50px)] z-0 pointer-events-none">
              {hours.map((h) => (
                <div
                  key={h}
                  className="border-b border-border/50 w-full last:border-0"
                />
              ))}
            </div>

            {/* Vertical Lines (Days) & Events */}
            {weekDays.map((day) => {
              const dayEvents = getEventsForDay(day);
              const layoutEvents = calculateEventLayout(dayEvents);

              return (
                <div
                  key={day.toString()}
                  className="relative border-r border-border/50 last:border-r-0 h-full bg-background/50 min-w-0"
                >
                  {layoutEvents.map((event) => {
                    const durationMinutes = differenceInMinutes(
                      event.end,
                      event.start
                    );
                    const isShort = durationMinutes < 45;

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute rounded-md border border-primary/10 bg-primary/10 text-xs overflow-hidden cursor-pointer hover:brightness-95 transition-all hover:shadow-md hover:z-20 hover:scale-[1.01] flex flex-col",
                          isShort ? "justify-center px-1" : "p-1.5"
                        )}
                        style={{
                          ...event.style,
                          backgroundColor: event.color
                            ? `${event.color}20`
                            : undefined,
                          borderColor: event.color
                            ? `${event.color}40`
                            : undefined,
                          color: event.color,
                        }}
                        onClick={(e) => handleEventClick(e, event)}
                      >
                        {isShort ? (
                          <div className="flex items-center gap-1 min-w-0 w-full">
                            <div className="font-semibold truncate text-[10px]">
                              {event.title}
                            </div>
                            <div className="opacity-80 whitespace-nowrap text-[9px]">
                              {format(event.start, "h:mm")}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="font-semibold truncate leading-tight flex-shrink-0">
                              {event.title}
                            </div>
                            <div className="opacity-80 truncate text-[10px] mt-0.5 flex-shrink-0">
                              {format(event.start, "h:mm a")}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
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
