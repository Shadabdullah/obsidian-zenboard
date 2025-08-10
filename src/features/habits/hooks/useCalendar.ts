import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useHabits } from "@habits/hooks";
import { getCalendarFromHabits } from "@habits/utils";

export const useCalendar = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonthInView, setCurrentMonthInView] = useState<string>("");

  // Cache for performance
  const dayWidthCache = useRef<number | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { allHabits, allStats, shouldUpdate } = useHabits();

  // Memoize calendar data calculation - only recalculate when shouldUpdate changes
  const calendarData = useMemo(() => {
    if (!allHabits?.length || !allStats) return [];
    return getCalendarFromHabits(allHabits, allStats);
  }, [shouldUpdate, allHabits?.length, allStats]); // Only depend on shouldUpdate and data existence

  // Memoized day width calculation with caching
  const getDayWidth = useCallback(() => {
    // Return cached value if available
    if (dayWidthCache.current !== null) {
      return dayWidthCache.current;
    }

    if (scrollContainerRef.current?.firstElementChild) {
      const firstDay = scrollContainerRef.current.firstElementChild as HTMLElement;
      const computedStyle = window.getComputedStyle(firstDay);
      const width = firstDay.offsetWidth;
      const marginRight = parseInt(computedStyle.marginRight) || 0;
      const gap = 12; // gap-3 = 12px from Tailwind

      // Cache the calculated width
      dayWidthCache.current = width + gap;
      return dayWidthCache.current;
    }
    return 92; // Fallback
  }, []);

  // Clear cache when calendar data changes
  useEffect(() => {
    dayWidthCache.current = null;
  }, [calendarData.length]);

  // Optimized scroll functions with useCallback
  const scrollToToday = useCallback((animated: boolean = true) => {
    if (!scrollContainerRef.current || calendarData.length === 0) return;

    const todayIndex = calendarData.findIndex((day) => day.isToday);
    if (todayIndex === -1) return;

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;

      const dayWidth = getDayWidth();
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const scrollPosition = todayIndex * dayWidth - containerWidth / 2 + dayWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: animated ? "smooth" : "instant",
      });
    });
  }, [calendarData, getDayWidth]);

  const scrollToStart = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const startTime = performance.now();
    const startScrollLeft = scrollContainerRef.current.scrollLeft;
    const duration = Math.min(800, startScrollLeft / 2);

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScrollLeft = startScrollLeft * (1 - easeOut);

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = currentScrollLeft;
      }

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  const scrollToEnd = useCallback(() => {
    if (!scrollContainerRef.current || calendarData.length === 0) return;

    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;

      const dayWidth = getDayWidth();
      const totalWidth = calendarData.length * dayWidth;
      const containerWidth = scrollContainerRef.current.offsetWidth;
      const maxScrollLeft = Math.max(0, totalWidth - containerWidth);
      const startTime = performance.now();
      const startScrollLeft = scrollContainerRef.current.scrollLeft;
      const distance = maxScrollLeft - startScrollLeft;
      const duration = Math.min(800, Math.abs(distance) / 2);

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScrollLeft = startScrollLeft + distance * easeOut;

        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = currentScrollLeft;
        }

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    });
  }, [calendarData.length, getDayWidth]);

  const scrollCalendar = useCallback((direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const dayWidth = getDayWidth();
    const scrollAmount = dayWidth * 5;
    const currentScrollLeft = scrollContainerRef.current.scrollLeft;
    const newScrollLeft = direction === "right"
      ? currentScrollLeft + scrollAmount
      : currentScrollLeft - scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: Math.max(0, newScrollLeft),
      behavior: "smooth",
    });
  }, [getDayWidth]);

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || calendarData.length === 0) return;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Throttle scroll updates
    scrollTimeoutRef.current = setTimeout(() => {
      if (!scrollContainerRef.current) return;

      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const dayWidth = getDayWidth();
      const visibleDayIndex = Math.round(scrollLeft / dayWidth);
      const safeIndex = Math.max(0, Math.min(visibleDayIndex, calendarData.length - 1));

      if (calendarData[safeIndex]) {
        const visibleDate = calendarData[safeIndex].date;
        const monthYear = visibleDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        setCurrentMonthInView(monthYear);
      }
    }, 16); // ~60fps throttling
  }, [calendarData, getDayWidth]);

  // Auto-scroll to today when calendar data changes
  useEffect(() => {
    if (calendarData.length === 0) return;

    const timeoutId = setTimeout(() => {
      scrollToToday(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [calendarData.length, scrollToToday]); // Only depend on length, not entire array

  // Setup scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    // Initial call to set month
    const initialTimeout = setTimeout(handleScroll, 150);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      clearTimeout(initialTimeout);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  return {
    calendarData,
    selectedDate,
    currentMonthInView,
    scrollContainerRef,
    scrollCalendar,
    selectDate,
    scrollToToday,
    scrollToStart,
    scrollToEnd,
  };
};

export default useCalendar;
