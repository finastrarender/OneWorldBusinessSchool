/** Shared defaults for seed + UI fallback when DB is empty. */
export const defaultNavItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Courses", href: "/courses" },
  { label: "Incubation", href: "/incubation" },
  { label: "Research", href: "/research" },
  { label: "Contact", href: "/contact" },
];

export const defaultFooterColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Faculty", href: "/faculty" },
      { label: "Research Papers", href: "/research" },
      { label: "Partnerships", href: "/partnerships" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "Executive MBA", href: "/programs/executive-mba" },
      { label: "Data Science for Biz", href: "/programs/data-science" },
      { label: "Innovation Strategy", href: "/programs/innovation-strategy" },
      { label: "Incubation Program", href: "/programs/incubation" },
    ],
  },
  {
    title: "Contact",
    contact: [
      { type: "location" as const, value: "Dubai, United Arab Emirates" },
      { type: "mail" as const, value: "info@oneworld.fze" },
      { type: "phone" as const, value: "+971 (0) 4 123 4567" },
    ],
  },
];

export const defaultFooterMeta = {
  brand: "ONE WORLD",
  description:
    "The nexus of business education and startup innovation. Developing leaders for the digital frontier.",
  social: [
    { icon: "facebook", label: "Facebook", href: "#" },
    { icon: "linkedin", label: "LinkedIn", href: "#" },
    { icon: "instagram", label: "Instagram", href: "#" },
  ],
  copyright:
    "© 2024 One World Business School & Incubation Centre FZE. All rights reserved.",
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export const defaultApplyNowModal = {
  panelTitle: "Unlock Your Potential",
  panelDescription:
    "Join a global community of innovators and business leaders in Dubai's premier business hub.",
  panelHighlights: ["Elite Faculty", "Global Network", "Startup Incubator"],
  formTitle: "Request Information",
  formDescription: "Fill in the details below to receive a personalized program consultation.",
  fullNameLabel: "FULL NAME",
  fullNamePlaceholder: "Enter your full name",
  phoneLabel: "PHONE NUMBER",
  phonePlaceholder: "+971      50 123 4567",
  emailLabel: "WORK EMAIL",
  emailPlaceholder: "email@company.com",
  cityLabel: "SELECT CITY",
  cityPlaceholder: "Choose City",
  cityOptions: ["Dubai", "Abu Dhabi", "Sharjah"],
  experienceLabel: "EXPERIENCE",
  experiencePlaceholder: "Years of Experience",
  experienceOptions: ["0-2 Years", "3-5 Years", "6-10 Years", "10+ Years"],
  messageLabel: "MESSAGE (OPTIONAL)",
  messagePlaceholder: "Tell us about your career goals...",
  customFields: [] as Array<{
    label: string;
    placeholder: string;
    inputType: "text" | "email" | "number";
  }>,
  termsText: "I agree to the Terms of Service and Privacy Policy.",
  marketingConsentText: "I consent to receive promotional offers and communication via email and SMS.",
  submitLabel: "ENROLL NOW",
};
