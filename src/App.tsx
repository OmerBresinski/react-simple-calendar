import { useMemo } from "react";
import { Calendar, type CalendarEvent } from "@/lib/calendar";
import {
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  isWeekend,
  addMinutes,
} from "date-fns";

const generateEvents = () => {
  const events: CalendarEvent[] = [];
  const start = startOfYear(new Date());
  const end = endOfYear(new Date());

  const days = eachDayOfInterval({ start, end });

  const colors = [
    "#2563eb", // blue
    "#16a34a", // green
    "#dc2626", // red
    "#9333ea", // purple
    "#ea580c", // orange
    "#0891b2", // cyan
  ];

  const titles = [
    "Team Standup",
    "Design Review",
    "Client Call",
    "Code Review",
    "Lunch Break",
    "Project Planning",
    "Bug Bash",
    "Release Prep",
  ];

  days.forEach((day) => {
    if (isWeekend(day)) return;

    const numEvents = Math.floor(Math.random() * 6) + 3; // 3 to 8 events

    for (let i = 0; i < numEvents; i++) {
      const startHour = 9 + Math.floor(Math.random() * 8); // 9am to 5pm
      const startMinute = Math.random() > 0.5 ? 0 : 30;
      const duration =
        Math.random() > 0.7 ? 60 : Math.random() > 0.5 ? 30 : 15;

      const startDate = new Date(day);
      startDate.setHours(startHour, startMinute);
      const endDate = addMinutes(startDate, duration);

      events.push({
        id: crypto.randomUUID(),
        title: titles[Math.floor(Math.random() * titles.length)],
        start: startDate,
        end: endDate,
        description: "Generated event description for demonstration.",
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  });

  return events;
};

function App() {
  const events = useMemo(() => generateEvents(), []);

  return (
    <div className="h-screen w-full p-4 md:p-8 bg-muted/20">
      <div className="flex flex-col h-full max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Calendar Library Demo
          </h1>
          <p className="text-muted-foreground">
            A fully typed, accessible calendar component built with React,
            Shadcn UI, and Tailwind CSS.
          </p>
        </div>
        <div className="flex-1 bg-background shadow-xl rounded-xl overflow-hidden border">
          <Calendar events={events} defaultView="month" />
        </div>
      </div>
    </div>
  );
}

export default App;
