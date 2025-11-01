"use client";

import { useRef, useState, useEffect, ReactNode } from "react";

interface CarouselProps {
  children: ReactNode[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
  pauseDuration?: number;
  cardWidth?: number;
  gap?: number;
  showArrows?: boolean;
  className?: string;
}

export function Carousel({
  children,
  autoScroll = true,
  autoScrollInterval = 7000,
  pauseDuration = 5000,
  cardWidth = 280,
  gap = 16,
  showArrows = true,
  className = "",
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = cardWidth + gap;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const performAutoScroll = () => {
    if (scrollContainerRef.current && !isAutoScrollPaused) {
      const container = scrollContainerRef.current;
      const totalCardWidth = cardWidth + gap;
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Calculate next scroll position
      const nextScroll =
        Math.round(currentScroll / totalCardWidth) * totalCardWidth +
        totalCardWidth;

      // If at the end, scroll back to start
      if (nextScroll >= maxScroll) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        // Scroll to next card
        container.scrollTo({
          left: nextScroll,
          behavior: "smooth",
        });
      }
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll) return;

    // Only auto-scroll on mobile
    const isMobile = window.innerWidth < 1024;

    if (isMobile && !isAutoScrollPaused) {
      autoScrollIntervalRef.current = setInterval(
        performAutoScroll,
        autoScrollInterval
      );
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoScrollPaused, autoScroll, autoScrollInterval]);

  // Check scroll position on mount and resize
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // Pause auto-scroll when user interacts
  const handleUserInteraction = () => {
    if (!autoScroll) return;

    setIsAutoScrollPaused(true);

    // Resume auto-scroll after specified duration
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    setTimeout(() => {
      setIsAutoScrollPaused(false);
    }, pauseDuration);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Scroll Buttons */}
      {showArrows && canScrollLeft && (
        <button
          onClick={() => {
            scroll("left");
            handleUserInteraction();
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          aria-label="Scroll left"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {showArrows && canScrollRight && (
        <button
          onClick={() => {
            scroll("right");
            handleUserInteraction();
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
          aria-label="Scroll right"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        onTouchStart={handleUserInteraction}
        onMouseDown={handleUserInteraction}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="snap-center shrink-0"
            style={{ width: `${cardWidth}px` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
