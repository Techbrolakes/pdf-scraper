import { driver, DriveStep } from "driver.js";
import "driver.js/dist/driver.css";

// Helper to detect mobile
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

// Helper to get the correct element ID based on screen size
const getBillingElement = () => (isMobile() ? "#mobile-billing" : "#sidebar-billing");
const getSettingsElement = () => (isMobile() ? "#mobile-settings" : "#sidebar-settings");

export const tourSteps: DriveStep[] = [
  {
    element: "#welcome-tour",
    popover: {
      title: "👋 Welcome to ResuméAI!",
      description:
        "Let's take a quick tour to help you get started. This will only take a minute!",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#upload-zone",
    popover: {
      title: "📄 Upload Your Resume",
      description:
        "Drag and drop your PDF resume here, or click to browse. We support all standard PDF formats.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#stats-cards",
    popover: {
      title: "📊 Track Your Usage",
      description:
        "Monitor your credits, uploads, and processing status at a glance. Stay on top of your usage!",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#resume-history",
    popover: {
      title: "📚 Resume History",
      description:
        "Access all your previously uploaded resumes here. Search, filter, and view detailed results anytime.",
      side: "top",
      align: "start",
    },
  },
];

export function createProductTour(onComplete?: () => void) {
  // Build dynamic steps based on screen size
  const dynamicSteps: DriveStep[] = [
    ...tourSteps,
    // Billing step - different element and position for mobile
    {
      element: getBillingElement(),
      popover: {
        title: "💳 Manage Billing",
        description:
          "View your current plan, purchase credits, and upgrade to unlock more features. We're in test mode - use our test card details to try it out without any charges!",
        side: isMobile() ? "top" : "right",
        align: "start",
      },
    },
    // Settings step - different element and position for mobile
    {
      element: getSettingsElement(),
      popover: {
        title: "⚙️ Settings",
        description:
          "Customize your profile, update preferences, and manage your account settings.",
        side: isMobile() ? "top" : "right",
        align: "start",
      },
    },
    // Final step
    {
      popover: {
        title: "🎉 You're All Set!",
        description:
          "You're ready to start extracting data from PDF resumes. Upload your first file to get started! You can restart this tour anytime from Settings.",
      },
    },
  ];

  const driverObj = driver({
    showProgress: true,
    showButtons: ["next", "previous", "close"],
    steps: dynamicSteps,
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Get Started! 🚀",
    progressText: "{{current}} of {{total}}",
    onDestroyed: () => {
      if (onComplete) {
        onComplete();
      }
    },
  });

  return driverObj;
}
