import type { PageSection } from "@/types/section";
import HeroSection from "./home/HeroSection";
import IntroSection from "./home/IntroSection";
import ServicesSection from "./services/ServicesSection";
import ServicesGridSection from "./services/ServicesGridSection";
import ServicesAccordionSection from "./services/ServicesAccordionSection";
import WhyChooseSection from "./home/WhyChooseSection";
import InvestmentSection from "./home/InvestmentSection";
import ClientLogosSection from "./home/ClientLogosSection";
import CtaSection from "./home/CtaSection";
import ContactBlockSection from "./contact/ContactBlockSection";
import AboutHeroSection from "./about/AboutHeroSection";
import AboutVisionMissionSection from "./about/AboutVisionMissionSection";
import AboutAdvantageSection from "./about/AboutAdvantageSection";
import AboutValuesSection from "./about/AboutValuesSection";
import ContactHeroSection from "./contact/ContactHeroSection";
import IncubationPageSection from "./incubation/IncubationPageSection";
import GlobalStandardsSection from "./home/Globalstandardsection";
import ContactInquirySection from "./contact/ContactInquirySection";
import AboutOverviewSection from "./about/AboutOverviewSection";
import AboutFrameworkSection from "./about/AboutFrameworkSection";
import AboutCta from "./about/AboutCta";
import ServicesSectionCta from "./services/ServicesSectionCta";
import ServicesHeroSection from "./services/ServicesHeroSection";
import CoursesCatalogSection from "./courses/CoursesCatalogSection";
import ResearchHubSection from "./research/ResearchHubSection";
import HomeIncubationHighlightSection from "./home/HomeIncubationHighlightSection";

export default function SectionRenderer({
  pageSlug,
  section,
  featureFlags,
}: {
  pageSlug: string;
  section: PageSection;
  featureFlags?: Record<string, boolean>;
}) {
  const normalizedType =
    (section.type as string) === "industrieshero"
      ? "industriesHero"
      : (section.type as string) === "industriesgrid"
        ? "industriesGrid"
        : (section.type as string) === "industriescta"
          ? "industriesCta"
            : (section.type as string) === "servicesgrid"
              ? "servicesGrid"
              : (section.type as string) === "servicesaccordion"
                ? "servicesAccordion"
              : (section.type as string) === "servicescta"
                ? "servicesCTA"
                : (section.type as string) === "aboutoverview"
                  ? "aboutOverview"
            : section.type;

  if (normalizedType === "clientLogos" && featureFlags?.clientLogos === false) {
    return null;
  }

  switch (normalizedType) {
    case "hero":
      return (
        <HeroSection
          content={section.data as never}
          anchorId={pageSlug === "home" ? "home" : undefined}
        />
      );
    case "intro":
      return (
        <IntroSection
          content={section.data as never}
          anchorId={pageSlug === "home" ? "services" : undefined}
        />
      );
    case "incubation":
      if (pageSlug === "home") {
        const data = section.data as Record<string, unknown>;
        return (
          <HomeIncubationHighlightSection
            content={
              {
                title: (data.title as string) ?? "From Idea to Global Scale",
                description:
                  (data.description as string) ??
                  "Our Incubation Centre provides more than just desk space.",
                steps: Array.isArray(data.steps)
                  ? (data.steps as unknown[])
                  : [
                      { number: 1, title: "Ideation & Validation", description: "" },
                      { number: 2, title: "Product Development", description: "" },
                      { number: 3, title: "Market Scaling", description: "" },
                    ],
                image: (data.image as string) ?? "/home/incubation.jpg",
                stat:
                  (data.stat as { value?: string; label?: string }) ??
                  { value: "50+", label: "Startups Accelerated" },
              } as never
            }
          />
        );
      }
      return <IncubationPageSection content={section.data as never} />;
    case "homeIncubationHighlight":
      return <HomeIncubationHighlightSection content={section.data as never} />;
    case "globalStandards":
      return <GlobalStandardsSection content={section.data as never} />;
    case "services":
      return <ServicesSection content={section.data as never} />;

    case "whyChoose":
      return <WhyChooseSection content={section.data as never} />;
    case "investment":
      return <InvestmentSection content={section.data as never} />;
    case "clientLogos":
      return <ClientLogosSection content={section.data as never} />;
    case "cta":
      if (pageSlug === "about") {
        return <AboutCta content={section.data as never} />;
      }
      return (
        <CtaSection
          content={section.data as never}
          anchorId={pageSlug === "contact" ? undefined : "contact"}
        />
      );
    case "contact":
      return <ContactBlockSection content={section.data as never} />;
    case "contactHero":
      return <ContactHeroSection content={section.data as never} />;
    case "contactInquiry":
      return <ContactInquirySection content={section.data as never} />;
    case "servicesHero":
      return <ServicesHeroSection content={section.data as never} />;
    case "servicesAccordion":
      return <ServicesAccordionSection content={section.data as never} />;
    case "servicesGrid":
      return <ServicesGridSection content={section.data as never} />;
    case "servicesCTA":
      return <ServicesSectionCta content={section.data as never}/>;
    case "coursesCatalog":
      return <CoursesCatalogSection content={section.data as never} />;
    case "aboutHero":
      return <AboutHeroSection content={section.data as never} />;
    case "aboutOverview":
      return <AboutOverviewSection content={section.data as never} />;
    case "aboutIntro":
      return <AboutOverviewSection content={section.data as never} />;
    case "aboutVisionMission":
      return <AboutVisionMissionSection content={section.data as never} />;
    case "aboutFramework":
      return <AboutFrameworkSection content={section.data as never} />;
    case "aboutAdvantage":
      return <AboutAdvantageSection content={section.data as never} />;
    case "aboutValues":
      return <AboutValuesSection content={section.data as never} />;
    case "aboutCTA":
      return <AboutCta content={section.data as never} />;
    case "researchHub":
      return <ResearchHubSection content={section.data as never} />;
    default:
      return null;
  }
}
