/**
 * Insert-only page seed: creates Page documents for slugs that are not in the DB yet.
 * Existing pages are never updated (no overwrite of admin edits).
 * Does not touch SiteGlobal or the admin user.
 *
 * Run: pnpm seed:pages
 *
 * Add entries to PAGES_TO_ENSURE. For rich layouts, copy section payloads from scripts/seed.ts.
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

import mongoose from "mongoose";
import { nanoid } from "nanoid";

import Page from "../src/models/Page";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

function section(type: string, order: number, data: Record<string, unknown>) {
  return { id: nanoid(), type, order, data };
}

type PageSeed = {
  slug: string;
  title: string;
  sections: ReturnType<typeof section>[];
  seoTitle: string;
  seoDescription: string;
};

/**
 * Only these slugs are considered. If a document with the same slug already exists, it is left unchanged.
 */
const PAGES_TO_ENSURE: PageSeed[] = [
  // Example — remove or duplicate this block for real pages:
{
  slug: "services",
  title: "Services",
  sections: [

    // 🔷 HERO SECTION
    section("servicesHero", 0, {
      title: "Our Comprehensive Services",
      description:
        "Expert financial advisory, investment management, and strategic consultancy services designed to empower global growth and sustainable value creation.",
      backgroundColor: "dark-blue",
    }),

    // 🔷 SERVICES (INTRO + GRID COMBINED)
    section("servicesGrid", 1, {
      title: "Strategic Solutions",
      description:
        "Explore our diverse portfolio of 90+ specialized services categorized by industry and expertise.",
      filters: ["All Services", "Investment", "Financial", "Technology"],

      cards: [
        {
          category: "Investment",
          title: "Investment Services",
          icon: "DollarSign",
          description:
            "Global asset management, private equity investments, and portfolio diversification strategies tailored for institutional and private investors.",
          features: [
            "Private Equity",
            "Asset Management",
            "Wealth Preservation",
          ],
          cta: "Learn More",
        },
        {
          category: "Finance",
          title: "Financial Advisory",
          icon: "BarChart",
          description:
            "Strategic financial planning, capital restructuring, and risk assessment to ensure long-term fiscal health and regulatory compliance.",
          features: [
            "Capital Structuring",
            "Risk Management",
            "Mergers & Acquisitions",
          ],
          cta: "Learn More",
        },
        {
          category: "Consultancy",
          title: "Business Management",
          icon: "Briefcase",
          description:
            "Operational intelligence, market entry strategies, and organizational restructuring for modern enterprises in a globalized economy.",
          features: [
            "Market Entry",
            "Operational Efficiency",
            "Corporate Governance",
          ],
          cta: "Learn More",
        },
        {
          category: "Development",
          title: "Project Development",
          icon: "Building",
          description:
            "End-to-end management of infrastructure and real estate projects, from feasibility studies to execution planning and delivery.",
          features: [
            "Real Estate",
            "Infrastructure Planning",
            "Feasibility Studies",
          ],
          cta: "Learn More",
        },
        {
          category: "Technology",
          title: "Technology & Innovation",
          icon: "Monitor",
          description:
            "Driving digital transformation through fintech solutions, blockchain integration, and advanced technology consulting.",
          features: [
            "Fintech Solutions",
            "Blockchain Consulting",
            "Digital Strategy",
          ],
          cta: "Learn More",
        },
        {
          category: "Specialized",
          title: "Specialized Consulting",
          icon: "FlaskConical",
          description:
            "Niche expertise in emerging markets, sustainability-focused investments, and unique cross-border trade facilitation.",
          features: [
            "ESG Consulting",
            "Emerging Markets",
            "Trade Facilitation",
          ],
          cta: "Learn More",
        },
      ],
    }),

    // 🔷 CTA SECTION
    section("servicesCTA", 2, {
      title: "Need a Bespoke Solution?",
      description:
        "Our experts are ready to provide tailored advice for your unique business needs. Contact us today to discuss how we can partner for your success.",
      primaryAction: {
        label: "Book a Consultation",
        href: "/contact",
      },
      secondaryAction: {
        label: "Download Brochure",
        href: "/brochure",
      },
    }),
  ],

  seoTitle: "Services | OWCC FZE",
  seoDescription:
    "Explore our comprehensive financial, investment, and strategic consultancy services designed for global growth.",
}
];

async function main() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  for (const p of PAGES_TO_ENSURE) {
    const published = structuredClone(p.sections);
    const result = await Page.updateOne(
      { slug: p.slug },
      {
        $setOnInsert: {
          slug: p.slug,
          title: p.title,
          status: "published",
          sections: p.sections,
          publishedSections: published,
          publishedAt: new Date(),
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
        },
      },
      { upsert: true },
    );

    if (result.upsertedCount > 0) {
      console.log("Created page:", p.slug);
    } else {
      console.log("Skipped (already exists):", p.slug);
    }
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
