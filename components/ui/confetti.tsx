"use client";

import confetti from "canvas-confetti";

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  scalar?: number;
}

/**
 * Trigger a confetti celebration animation
 * @param duration - Duration of the animation in milliseconds (default: 3000)
 * @param options - Custom confetti options
 */
export const triggerConfetti = (
  duration: number = 3000,
  options?: ConfettiOptions
) => {
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: options?.startVelocity || 30,
    spread: options?.spread || 360,
    ticks: 60,
    zIndex: 0,
    decay: options?.decay || 0.94,
    scalar: options?.scalar || 1,
  };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = (options?.particleCount || 50) * (timeLeft / duration);

    // Left side burst
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    // Right side burst
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);

  return interval;
};

/**
 * Trigger a single confetti burst from the center
 */
export const triggerConfettiBurst = (options?: ConfettiOptions) => {
  confetti({
    particleCount: options?.particleCount || 100,
    spread: options?.spread || 70,
    origin: { y: 0.6 },
    startVelocity: options?.startVelocity || 45,
    decay: options?.decay || 0.9,
    scalar: options?.scalar || 1,
  });
};

/**
 * Trigger confetti cannons from both sides
 */
export const triggerConfettiCannons = () => {
  const end = Date.now() + 1000;

  const colors = ["#6a3fdc", "#1447E6", "#0A2E8C", "#ffffff"];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

/**
 * Trigger a realistic confetti explosion
 */
export const triggerConfettiExplosion = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};
