import { type CalendarEvent } from "./types";
import { differenceInMinutes, startOfDay } from "date-fns";

export interface LayoutEvent extends CalendarEvent {
  style: React.CSSProperties;
}

export const calculateEventLayout = (events: CalendarEvent[]): LayoutEvent[] => {
  if (events.length === 0) return [];

  // 1. Sort by start time, then by duration (longest first) for better packing
  const sorted = [...events].sort((a, b) => {
    if (a.start.getTime() !== b.start.getTime()) {
      return a.start.getTime() - b.start.getTime();
    }
    return (b.end.getTime() - b.start.getTime()) - (a.end.getTime() - a.start.getTime());
  });

  type ProcessedEvent = CalendarEvent & {
    startMs: number;
    endMs: number;
    colIndex: number;
    maxCols: number;
  };

  const items: ProcessedEvent[] = sorted.map((e) => ({
    ...e,
    startMs: e.start.getTime(),
    endMs: e.end.getTime(),
    colIndex: 0,
    maxCols: 1,
  }));

  // 2. Cluster into connected groups
  const clusters: ProcessedEvent[][] = [];
  let currentCluster: ProcessedEvent[] = [];
  let clusterEnd = 0;

  for (const event of items) {
    if (currentCluster.length === 0) {
      currentCluster.push(event);
      clusterEnd = event.endMs;
    } else {
      // If event starts before the current cluster ends, it belongs to the cluster
      if (event.startMs < clusterEnd) {
        currentCluster.push(event);
        clusterEnd = Math.max(clusterEnd, event.endMs);
      } else {
        clusters.push(currentCluster);
        currentCluster = [event];
        clusterEnd = event.endMs;
      }
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  // 3. Assign Columns within clusters
  for (const cluster of clusters) {
    // Reset
    for (const e of cluster) e.colIndex = -1;

    for (let i = 0; i < cluster.length; i++) {
      const event = cluster[i];
      const existingCols = new Set<number>();

      for (let j = 0; j < i; j++) {
        const prev = cluster[j];
        // Check overlap
        if (event.startMs < prev.endMs && event.endMs > prev.startMs) {
          existingCols.add(prev.colIndex);
        }
      }

      let col = 0;
      while (existingCols.has(col)) col++;
      event.colIndex = col;
    }

    const maxCol = Math.max(...cluster.map((e) => e.colIndex));
    for (const e of cluster) e.maxCols = maxCol + 1;
  }

  // 4. Convert to CSS styles
  return items.map((event) => {
    const startMinutes = differenceInMinutes(
      event.start,
      startOfDay(event.start)
    );
    const durationMinutes = differenceInMinutes(event.end, event.start);

    const widthPercent = 100 / event.maxCols;
    const leftPercent = event.colIndex * widthPercent;

    return {
      ...event,
      style: {
        position: "absolute",
        top: `${(startMinutes / 1440) * 100}%`,
        height: `${(durationMinutes / 1440) * 100}%`,
        left: `${leftPercent}%`,
        width: `calc(${widthPercent}% + ${event.maxCols > 1 ? "1px" : "0px"})`, // Slight overlap to hide border gaps
        zIndex: 10 + event.colIndex,
        border: "1px solid white", // Ensure overlap is visible/clean
      } as React.CSSProperties,
    };
  });
};

