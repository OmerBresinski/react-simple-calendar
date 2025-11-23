import { z } from "zod";

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  start: z.date(),
  end: z.date(),
  description: z.string().optional(),
  color: z.string().optional(),
});

export type CalendarEvent = z.infer<typeof EventSchema>;

export type ViewType = "month" | "week" | "day";

export interface CalendarProps {
  events: CalendarEvent[];
  defaultView?: ViewType;
  className?: string;
}

