"use client";

import { useEffect, useState } from "react";
import { createProductTour } from "@/lib/product-tour";
import { markTourAsCompleted } from "@/app/actions/tour-actions";

interface ProductTourProps {
  shouldShowTour: boolean;
}

export function ProductTour({ shouldShowTour }: ProductTourProps) {
  const [tourStarted, setTourStarted] = useState(false);

  useEffect(() => {
    if (shouldShowTour && !tourStarted) {
      // Small delay to ensure DOM elements are ready
      const timer = setTimeout(() => {
        const tour = createProductTour(async () => {
          // Mark tour as completed when user finishes or closes it
          await markTourAsCompleted();
        });

        tour.drive();
        setTourStarted(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldShowTour, tourStarted]);

  return null; // This component doesn't render anything
}

export function startTour() {
  const tour = createProductTour();
  tour.drive();
}
