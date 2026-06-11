import { z } from "zod";
import { SECTION_TYPES, type SectionType } from "@/types/section";

const navItemSchema = z.object({
  label: z.string(),
  href: z.string(),
  active: z.boolean().optional(),
});

const footerLinkColumnSchema = z.object({
  title: z.string(),
  links: z.array(z.object({ label: z.string(), href: z.string() })),
});

const footerContactColumnSchema = z.object({
  title: z.string(),
  contact: z.array(
    z.object({
      type: z.enum(["location", "phone", "mail"]),
      value: z.string(),
    }),
  ),
});

export const heroDataSchema = z.object({
  // badge: z.string(),
  title: z.array(z.string()),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
  backgroundImage: z.string(),
});

export const introDataSchema = z.object({
  eyebrow: z.string(),
  title: z.array(z.string()),
  description: z.string(),
  highlights: z.array(z.string()),
  image: z.string(),
  more: z.string().optional(),
  href: z.string(),
  icon: z.string().optional(),
  expcount: z.number(),
  // exptext: z.string(),
});

const serviceCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
  category: z.string().optional(),
  points: z.array(z.string()).optional(),
});

const applyNowModalSchema = z.object({
  panelTitle: z.string(),
  panelDescription: z.string(),
  panelHighlights: z.array(z.string()),
  formTitle: z.string(),
  formDescription: z.string(),
  fullNameLabel: z.string(),
  fullNamePlaceholder: z.string(),
  phoneLabel: z.string(),
  phonePlaceholder: z.string(),
  emailLabel: z.string(),
  emailPlaceholder: z.string(),
  cityLabel: z.string(),
  cityPlaceholder: z.string(),
  cityOptions: z.array(z.string()),
  experienceLabel: z.string(),
  experiencePlaceholder: z.string(),
  experienceOptions: z.array(z.string()),
  messageLabel: z.string(),
  messagePlaceholder: z.string(),
  customFields: z.array(
    z.object({
      label: z.string(),
      placeholder: z.string(),
      inputType: z.enum(["text", "email", "number"]),
    }),
  ),
  termsText: z.string(),
  marketingConsentText: z.string(),
  submitLabel: z.string(),
});

export const servicesDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  backgroundImage: z.string().optional(),
  cards: z.array(serviceCardSchema),
});

export const servicesAccordionDataSchema = z.object({
  cards: z.array(serviceCardSchema).min(1),
});

const servicesGridCardSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  cta: z.string(),
  icon: z.string().optional(),
});

export const servicesGridDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  filters: z.array(z.string()).min(1),
  cards: z.array(servicesGridCardSchema).min(1),
});

export const servicesCtaDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
});

const courseCardSchema = z.object({
  badge: z.string(),
  title: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  weeks: z.string(),
  image: z.string(),
  category: z.string().optional(),
  level: z.string().optional(),
});

export const coursesCatalogDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  levels: z.array(z.string()),
  durations: z.array(z.string()),
  courses: z.array(courseCardSchema).min(1),
});

export const whyChooseItemSchema = z.object({
  title: z.string(),
  // description: z.string().optional(),
  icon: z.string(),
});

export const whyChooseDataSchema = z.object({
  title: z.string(),
  subheading: z.string().optional(),
  items: z.array(whyChooseItemSchema),
});

const incubationStepSchema = z.object({
  number: z.number(),
  title: z.string(),
  description: z.string(),
});

export const homeIncubationHighlightDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(incubationStepSchema).length(3),
  image: z.string(),
  stat: z.object({
    value: z.string(),
    label: z.string(),
  }),
});

const incubationRoadmapItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  points: z.array(z.string()).default([]),
  image: z.string(),
});

const incubationPortfolioMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const incubationPortfolioCardSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  metrics: z.array(incubationPortfolioMetricSchema).min(1),
  image: z.string().optional(),
});

const incubationApplicationFieldSchema = z.object({
  label: z.string(),
  placeholder: z.string(),
});

export const incubationDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(incubationStepSchema).min(1),
  image: z.string(),
  stat: z.object({
    value: z.string(),
    label: z.string(),
  }),
  badge: z.string().optional(),
  heroTitleLines: z.array(z.string()).optional(),
  heroDescription: z.string().optional(),
  primaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
  secondaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
  roadmapTitle: z.string().optional(),
  roadmapSubtitle: z.string().optional(),
  roadmapItems: z.array(incubationRoadmapItemSchema).optional(),
  portfolioTitle: z.string().optional(),
  portfolioDescription: z.string().optional(),
  portfolioAction: z.object({ label: z.string(), href: z.string() }).optional(),
  portfolioCards: z.array(incubationPortfolioCardSchema).optional(),
  applicationTitle: z.string().optional(),
  applicationDescription: z.string().optional(),
  applicationFields: z.array(incubationApplicationFieldSchema).optional(),
  applicationSubmitLabel: z.string().optional(),
  applicationNote: z.string().optional(),
});

const globalStandardsPillarSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const globalStandardsDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  pillars: z.array(globalStandardsPillarSchema).min(1),
});

export const investmentDataSchema = z.object({
  id: z.string().optional(),
  heading: z.array(z.string()).min(1),
  items: z
    .array(
      z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .min(1),
  quoteText: z.string(),
  quoteAuthor: z.string(),
  quoteRole: z.string(),
});

export const clientLogosDataSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  action: z.object({ label: z.string(), href: z.string() }),
});

export const ctaDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  action: z.object({ label: z.string(), href: z.string() }),
});

export const contactDataSchema = z.object({
  headline: z.string(),
  subtext: z.string(),
});

export const contactHeroDataSchema = z.object({
  title: z.array(z.string()),
  description: z.string(),
  stat: z.string(),
  backgroundImage: z.string(),
});

export const industriesHeroDataSchema = z.object({
  badge: z.string(),
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
});

const industriesGridItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

export const industriesGridDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  items: z.array(industriesGridItemSchema).min(1),
  partnerCard: z.object({
    title: z.string(),
    description: z.string(),
    href: z.string(),
  }),
});

export const industriesCtaDataSchema = z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
});

const contactInfoItemSchema = z.object({
  title: z.string(),
  lines: z.array(z.string()),
  icon: z.string(),
});

const contactDepartmentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  email: z.string(),
});

const contactFormFieldsSchema = z.object({
  departmentHeading: z.string().optional(),
  fullNameLabel: z.string().optional(),
  fullNamePlaceholder: z.string().optional(),
  companyLabel: z.string().optional(),
  companyPlaceholder: z.string().optional(),
  workEmailLabel: z.string().optional(),
  workEmailPlaceholder: z.string().optional(),
  phoneLabel: z.string().optional(),
  phonePlaceholder: z.string().optional(),
  interestLabel: z.string().optional(),
  interestPlaceholder: z.string().optional(),
  messageLabel: z.string().optional(),
  messagePlaceholder: z.string().optional(),
  disclaimerText: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
});

export const contactInquiryDataSchema = z.object({
  formTitle: z.string(),
  formDescription: z.string(),
  submitLabel: z.string(),
  inquiryOptions: z.array(z.string()),
  officeHeading: z.string(),
  officeItems: z.array(contactInfoItemSchema),
  departmentContacts: z.array(contactDepartmentSchema).optional(),
  formFields: contactFormFieldsSchema.optional(),
  mapImage: z.string(),
  mapLabelTitle: z.string(),
  mapLabelSubtitle: z.string(),
});
export const serviceHeroDataSchema = z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  backgroundImage: z.string(),
});

export const aboutHeroDataSchema = z.object({
  titleAccent: z.string(),
  titleMain: z.string(),
  description: z.string(),
  image: z.string().optional(),
  backgroundImage: z.string().optional(),
});

const aboutHeroData = {
  titleAccent: "Empowering the Next",
  titleMain: "Generation of Global Leaders.",
  description:
    "One World Business School and Incubation Centre FZE is more than an institution; it's a launchpad for visionary entrepreneurs and industry disruptors in a rapidly evolving global economy.",
  image: "/home/headquarters.png", // use an existing image to verify layout works  // ✅ must be "image" not "backgroundImage"
};

const aboutOverviewStatSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const aboutOverviewDataSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  subDescription: z.string(),
  stats: z.array(aboutOverviewStatSchema).min(2),
  images: z.array(z.string()).min(2),
});

const aboutContentCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
  accentColor: z.string(),
});

export const aboutVisionMissionDataSchema = z.object({
  items: z.array(aboutContentCardSchema).min(1),
});

const aboutFrameworkPillarSchema = z.object({
  letter: z.string(),
  title: z.string(),
  description: z.string(),
});

export const aboutFrameworkDataSchema = z.object({
  title: z.string(),
  description: z.string(),
  pillars: z.array(aboutFrameworkPillarSchema).min(1),
});

export const aboutAdvantageDataSchema = z.object({
  eyebrow: z.string(),
  title: z.array(z.string()),
  description: z.string(),
  points: z.array(z.string()),
  image: z.string(),
});

const aboutValueItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  iconImage: z.string().optional(),
});

export const aboutValuesDataSchema = z.object({
  title: z.string(),
  items: z.array(aboutValueItemSchema).min(1),
});
export const aboutCtaDataSchema = z.object({
  title: z.array(z.string()).min(1),
  description: z.string(),
  primaryAction: z.object({ label: z.string(), href: z.string() }),
  secondaryAction: z.object({ label: z.string(), href: z.string() }).optional(),
});

const researchPillarSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
  project: z.string(),
});

const researchMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const researchHubDataSchema = z.object({
  heroBadge: z.string(),
  heroTitleLines: z.array(z.string()).min(1),
  heroDescription: z.string(),
  heroPrimaryAction: z.object({ label: z.string(), href: z.string() }),
  heroSecondaryAction: z.object({ label: z.string(), href: z.string() }),
  heroImage: z.string(),
  overviewTitle: z.string(),
  overviewDescription: z.string(),
  overviewPoints: z.array(z.string()).min(1),
  overviewImage: z.string(),
  pillarsTitle: z.string(),
  pillars: z.array(researchPillarSchema).min(3),
  metrics: z.array(researchMetricSchema).min(4),
  simulationTitle: z.string(),
  simulationDescription: z.string(),
  accuracyLabel: z.string(),
  accuracyValue: z.string(),
  velocityLabel: z.string(),
  velocityValue: z.string(),
  simulationImage: z.string(),
});

const sectionDataValidators: Record<string, z.ZodType<unknown>> = {
  hero: heroDataSchema,
  intro: introDataSchema,
  services: servicesDataSchema,
  servicesGrid: servicesGridDataSchema,
  servicesAccordion: servicesAccordionDataSchema,
  servicesCTA: servicesCtaDataSchema,
  coursesCatalog: coursesCatalogDataSchema,
  whyChoose: whyChooseDataSchema,
  investment: investmentDataSchema,
  clientLogos: clientLogosDataSchema,
  cta: ctaDataSchema,
  contact: contactDataSchema,
  contactHero: contactHeroDataSchema,
  contactInquiry: contactInquiryDataSchema,
  servicesHero: serviceHeroDataSchema,
  industriesHero: industriesHeroDataSchema,
  industriesGrid: industriesGridDataSchema,
  industriesCta: industriesCtaDataSchema,
  homeIncubationHighlight: homeIncubationHighlightDataSchema,
  incubation: incubationDataSchema,
  globalStandards: globalStandardsDataSchema,
  aboutHero: aboutHeroDataSchema,
  aboutOverview: aboutOverviewDataSchema,
  aboutIntro: aboutOverviewDataSchema,
  aboutVisionMission: aboutVisionMissionDataSchema,
  aboutFramework: aboutFrameworkDataSchema,
  aboutAdvantage: aboutAdvantageDataSchema,
  aboutValues: aboutValuesDataSchema,
  aboutCTA: aboutCtaDataSchema,
  researchHub: researchHubDataSchema,
};

export function parseSectionData(type: string, data: unknown): unknown {
  const normalizedType =
    type === "industrieshero"
      ? "industriesHero"
      : type === "industriesgrid"
        ? "industriesGrid"
        : type === "industriescta"
          ? "industriesCta"
          : type === "servicesgrid"
            ? "servicesGrid"
            : type === "servicesaccordion"
              ? "servicesAccordion"
              : type === "servicescta"
                ? "servicesCTA"
                : type === "aboutoverview"
                  ? "aboutOverview"
                  : type;
  if (!SECTION_TYPES.includes(normalizedType as SectionType)) {
    throw new Error(`Unknown section type: ${type}`);
  }
  const schema = sectionDataValidators[normalizedType];
  if (!schema) {
    throw new Error(`Unknown section type: ${type}`);
  }
  return schema.parse(data);
}

export const siteGlobalPayloadSchema = z.object({
  navItems: z.array(navItemSchema),
  footerColumns: z.array(
    z.union([footerLinkColumnSchema, footerContactColumnSchema]),
  ),
  footerMeta: z.object({
    brand: z.string(),
    description: z.string(),
    social: z.array(
      z.union([
        z.string(),
        z.object({
          label: z.string(),
          href: z.string(),
          icon: z.string().optional(),
        }),
      ]),
    ),
    copyright: z.string(),
    legal: z.array(
      z.union([z.string(), z.object({ label: z.string(), href: z.string() })]),
    ),
  }),
  logoSrc: z.string().optional(),
  featureFlags: z.record(z.string(), z.boolean()).optional(),
  seoDefaults: z
    .object({
      defaultTitle: z.string().optional(),
      defaultDescription: z.string().optional(),
    })
    .optional(),
  applyNowModal: applyNowModalSchema.optional(),
});

export type SiteGlobalPayload = z.infer<typeof siteGlobalPayloadSchema>;
