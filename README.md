# React Simple Calendar

`react-simple-calendar` is a headless calendar component built with React, TypeScript, Tailwind CSS and Shadcn UI primitives.  
It ships a single `Calendar` component that includes **month**, **week** and **day** views, cursor-aligned popovers, and fake data generation for demos.

## Installation

```bash
npm install @omerbres/react-simple-calendar
# or
yarn add @omerbres/react-simple-calendar
```

`react-simple-calendar` has two peer dependencies – `react` and `react-dom` (v18.2+). Everything else is bundled for you, including a tiny stylesheet that provides the structural CSS. Import it once at the root of your app:

```ts
import "@omerbres/react-simple-calendar/styles.css";
```

### Provide your own colors / tokens

The library reads the standard Shadcn/Tailwind CSS variables (`--background`, `--border`, `--ring`, etc.) but does **not** set them. This allows the calendar to adopt the host app’s theme automatically. If you don’t already have these tokens defined, add them to your global stylesheet:

```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --border: #e2e8f0;
  --ring: #2563eb;
  /* add any other tokens your design system requires */
}

.dark {
  --background: #0f172a;
  --foreground: #f8fafc;
  --card: #1e293b;
  --card-foreground: #f8fafc;
  --border: #1e293b;
  --ring: #60a5fa;
}
```

## Usage

```tsx
import "@omerbres/react-simple-calendar/styles.css";
import { Calendar } from "@omerbres/react-simple-calendar";

const events = [
  {
    id: "1",
    title: "Project Planning",
    start: new Date("2025-06-10T09:30:00"),
    end: new Date("2025-06-10T11:00:00"),
    description: "Roadmap review with product + design",
    color: "#2563eb",
  },
];

export function MySchedule() {
  return (
    <div className="h-[700px] rounded-xl border">
      <Calendar events={events} defaultView="month" />
    </div>
  );
}
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `events` | `CalendarEvent[]` | `[]` | List of events with `start`, `end`, `title`, optional `description`/`color`. |
| `defaultView` | `"month" \| "week" \| "day"` | `"month"` | Initial view when the component mounts. |
| `className` | `string` | `undefined` | Optional wrapper class. |

## Local development

Clone the repo if you want to iterate on the component itself:

```bash
npm install
npm run build        # bundles dist/ with tsup
```

Publishing to npm is as easy as `npm publish` once `npm run build:lib` finishes (it outputs files inside `dist/`).
