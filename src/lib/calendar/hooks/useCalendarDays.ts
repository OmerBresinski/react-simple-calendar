import { useMemo } from "react";
import { startOfMonth, startOfWeek, eachDayOfInterval, addDays } from "date-fns";

export const useCalendarDays = (currentDate: Date) => {
  return useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    // Always generate 42 days (6 weeks) to keep calendar height consistent
    const endDate = addDays(startDate, 41);

    return eachDayOfInterval({
      start: startDate,
      end: endDate,
    });
  }, [currentDate]);
};
