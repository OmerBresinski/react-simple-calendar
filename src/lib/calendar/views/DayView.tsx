import React from "react";
import { format, differenceInMinutes, startOfDay, isSameDay } from "date-fns";
import { type CalendarEvent } from "../types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EventPopup } from "../components/EventPopup";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export const DayView: React.FC<DayViewProps> = ({ currentDate, events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventStyle = (event: CalendarEvent) => {
    const start = event.start;
    const end = event.end;
    const startMinutes = differenceInMinutes(start, startOfDay(start));
    const durationMinutes = differenceInMinutes(end, start);

    return {
      top: `${(startMinutes / 1440) * 100}%`,
      height: `${(durationMinutes / 1440) * 100}%`,
    };
  };

  const dayEvents = events.filter((event) => isSameDay(event.start, currentDate));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex border-b p-4 sticky top-0 bg-background z-20 shadow-sm items-center justify-center">
        <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-muted-foreground uppercase mb-1">
            {format(currentDate, "EEEE")}
            </div>
            <div className="text-2xl font-bold">
            {format(currentDate, "d")}
            </div>
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

          {/* Day Grid */}
          <div className="flex-1 relative">
             {/* Horizontal Lines (Hours) */}
             <div className="absolute inset-0 grid grid-rows-[repeat(24,50px)] z-0 pointer-events-none">
                 {hours.map((h) => (
                     <div key={h} className="border-b border-border/50 w-full last:border-0" />
                 ))}
             </div>

             {/* Events */}
             <div className="relative h-full w-full">
                {dayEvents.map((event) => (
                    <Popover key={event.id}>
                    <PopoverTrigger asChild>
                        <div
                        className="absolute inset-x-2 rounded-md border border-primary/10 bg-primary/10 p-3 text-sm overflow-hidden cursor-pointer hover:brightness-95 transition-all hover:shadow-md hover:z-20 hover:scale-[1.01]"
                        style={{
                            ...getEventStyle(event),
                            backgroundColor: event.color ? `${event.color}20` : undefined,
                            borderColor: event.color ? `${event.color}40` : undefined,
                            color: event.color
                        }}
                        onClick={(e) => e.stopPropagation()}
                        >
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="opacity-80 truncate text-xs mt-1">
                            {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                        </div>
                        {event.description && (
                             <div className="opacity-70 truncate text-xs mt-1">
                                {event.description}
                             </div>
                        )}
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" side="left" align="start">
                        <EventPopup event={event} />
                    </PopoverContent>
                    </Popover>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

