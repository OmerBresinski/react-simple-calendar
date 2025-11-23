import { Calendar } from "@/lib/calendar";
import { addHours, startOfDay, addDays } from "date-fns";

const today = new Date();
const tomorrow = addDays(today, 1);
const yesterday = addDays(today, -1);

const events = [
  {
    id: "1",
    title: "Team Standup",
    start: addHours(startOfDay(today), 9),
    end: addHours(startOfDay(today), 9.5),
    description: "Daily sync with the engineering team.",
    color: "#2563eb", // blue
  },
  {
    id: "2",
    title: "Design Review",
    start: addHours(startOfDay(today), 10),
    end: addHours(startOfDay(today), 11.5),
    description: "Reviewing new dashboard mocks with the design team.",
    color: "#9333ea", // purple
  },
  {
    id: "3",
    title: "Lunch with Sarah",
    start: addHours(startOfDay(today), 12),
    end: addHours(startOfDay(today), 13),
    description: "Catching up at the new cafe.",
    color: "#16a34a", // green
  },
  {
    id: "4",
    title: "Client Call: Project X",
    start: addHours(startOfDay(today), 14),
    end: addHours(startOfDay(today), 15),
    description: "Discussing phase 2 requirements.",
    color: "#dc2626", // red
  },
  {
    id: "5",
    title: "Wrap Up",
    start: addHours(startOfDay(today), 16.5),
    end: addHours(startOfDay(today), 17),
    color: "#ea580c", // orange
  },
  {
    id: "6",
    title: "Code Review",
    start: addHours(startOfDay(tomorrow), 10),
    end: addHours(startOfDay(tomorrow), 12),
    description: "Reviewing PRs for the upcoming release.",
    color: "#0891b2", // cyan
  },
  {
    id: "7",
    title: "Planning Session",
    start: addHours(startOfDay(yesterday), 13),
    end: addHours(startOfDay(yesterday), 15),
    description: "Quarterly planning session.",
    color: "#4f46e5", // indigo
  },
];

function App() {
  return (
    <div className="h-screen w-full p-4 md:p-8 bg-muted/20">
        <div className="flex flex-col h-full max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Calendar Library Demo</h1>
                <p className="text-muted-foreground">
                    A fully typed, accessible calendar component built with React, Shadcn UI, and Tailwind CSS.
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
