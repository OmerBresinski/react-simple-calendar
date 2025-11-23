import React from "react";
import { type CalendarEvent } from "../types";
import { format } from "date-fns";

interface EventPopupProps {
  event: CalendarEvent;
}

export const EventPopup: React.FC<EventPopupProps> = ({ event }) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          {event.color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: event.color }}
            />
          )}
          <h4 className="font-semibold text-base leading-none tracking-tight">
            {event.title}
          </h4>
        </div>
        <div className="text-xs text-muted-foreground font-medium pl-5">
          {format(event.start, "EEEE, MMMM d")}
          <br />
          {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
        </div>
      </div>
      {event.description && (
        <div className="text-sm text-foreground/90 leading-relaxed bg-muted/50 p-2 rounded-md">
          {event.description}
        </div>
      )}
    </div>
  );
};
