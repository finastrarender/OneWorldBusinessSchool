export const SECTION_TYPES = [
  "hero",
  "intro",
  "services",
  "servicesGrid",
  "servicesAccordion",
  "servicesCTA",
  "coursesCatalog",
  "whyChoose",
  "investment",
  "clientLogos",
  "cta",
  "contact",
  "aboutHero",
  "aboutOverview",
  "aboutIntro",
  "aboutCTA",
  "aboutVisionMission",
  "aboutFramework",
  "aboutAdvantage",
  "aboutValues",
  "homeIncubationHighlight",
  "incubation",
  "globalStandards",
  "contactHero",
  "contactInquiry",
  "servicesHero",
  "industriesHero",
  "industriesGrid",
  "industriesCta",
  "researchHub",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export type PageSection = {
  id: string;
  type: SectionType;
  order: number;
  data: Record<string, unknown>;
};
