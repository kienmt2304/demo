import type { Page } from "@demo/shared";

export const MODAL_STATE = { fromModalNav: true } as const;

export const PAGES: Page[] = [
  {
    name: "Table",
    link: "/table",
    title: "Table",
    number: 1,
  },
  {
    name: "Onboarding Wizard",
    link: "/onboarding",
    title: "Onboarding Wizard",
    number: 2,
  },
  {
    name: "Settings",
    link: "/settings",
    title: "Settings",
    number: 3,
    mask: true,
  },
  {
    name: "File Upload",
    link: "/upload",
    title: "File Upload",
    number: 4,
  },
  {
    name: "Appointment Booking",
    link: "/booking",
    title: "Appointment Booking",
    number: 5,
  },
  {
    name: "Chat Window",
    link: "/chat",
    title: "Chat Window",
    number: 6,
  },
  {
    name: "Analytics Dashboard",
    link: "/analytics",
    title: "Analytics Dashboard",
    number: 7,
  },
  {
    name: "Infinite Scroll",
    link: "/infinite-scroll",
    title: "Infinite Scroll",
    number: 8,
  },
] as const;
