/**
 * Seed MongoDB with SiteGlobal, Pages, and an admin user.
 * Run: pnpm seed
 * Requires MONGODB_URI in .env or .env.local
 */
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { nanoid } from "nanoid";

import User from "../src/models/User";
import SiteGlobal from "../src/models/SiteGlobal";
import Page from "../src/models/Page";
import {
  defaultApplyNowModal,
  defaultFooterColumns,
  defaultFooterMeta,
  defaultNavItems,
} from "../src/data/site-defaults";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

function section(type: string, order: number, data: Record<string, unknown>) {
  return { id: nanoid(), type, order, data };
}

const navItems = defaultNavItems;
const footerColumns = defaultFooterColumns;
const footerMeta = defaultFooterMeta;

const heroData = {
  badge: "",
  title: ["Empowering Businesses & Professionals", "for a Smarter Future"],
  description:
    "Bridging the gap between academic excellence and Silicon Valley innovation. Join the next generation of global business leaders.",
  primaryAction: { label: "Explore Courses", href: "/courses" },
  secondaryAction: { label: "Book Consultancy", href: "/contact" },
  backgroundImage: "/home/hero-bg.jpg",
};

const introData = {
  eyebrow: "About Us",
  title: ["One World Business School", "& Incubation Centre FZE"],
  description:
    "One World Business School and Incubation Centre FZE provides comprehensive educational programs, professional consultancy services, and business incubation support. The company serves aspiring entrepreneurs, business owners, corporates, government agencies, and professionals seeking advanced training in management, AI, technology, and vocational skills. Through research, consultancy, and training, the company aims to drive business growth, professional excellence, and innovation in Sharjah and across the UAE. Clients include startups, SMEs, large corporations, government bodies, and individual learners seeking professional upskilling.",
  
  image: "/home/headquarters.png",
};

const servicesData = {
  title: "Premium Executive Programs",
  description:
    "Master the intersection of technology and management with our industry-led certifications.",
  backgroundImage: "",
  cards: [
    {
      title: "Digital Leadership & Transformation",
      description:
        "Master the art of leading teams through technical evolution.",
      iconImage: "/home/headquarters.png",
      category: "MANAGEMENT",
    },
    {
      title: "AI-Driven Business Analytics",
      description:
        "Utilize advanced data models to drive strategic decision making.",
      iconImage: "/home/hero-bg.jpg",
      category: "TECHNOLOGY",
    },
    {
      title: "Startup Scaleup Bootcamp",
      description:
        "Frameworks for rapid growth and sustainable operational scaling.",
      iconImage: "/home/headquarters.svg",
      category: "ENTREPRENEURSHIP",
    },
  ],
};

const servicesHeroData = {
  title: ["Our Services & Expertise"],
  description:
    "Empowering global business leaders and innovators through strategic consultancy, research-driven insights, and world-class professional training.",
  backgroundImage: "/home/hero-bg.jpg",
};

const servicesAccordionData = {
  cards: [
    {
      title: "Management & Strategic Consultancy",
      description:
        "Strategic advisory solutions that help businesses achieve sustainable growth, operational efficiency, and competitive market positioning..",
      iconImage: "/home/headquarters.png",
      category: "management",
      points: ["Business Growth & Expansion Strategy","Corporate Advisory Services","Operational Excellence Planning"],
    },
    {
      title: "Research & Innovation",
      description:
        "Our state-of-the-art AI labs and incubation facilities support startups and established firms in developing breakthrough technologies.",
      iconImage: "/home/hero-bg.jpg",
      category: "research",
      points: [
        "AI & Machine Learning Research",
        "Product Incubation & Prototyping",
        "Market Intelligence Reports",
      ],
    },
    {
      title: "Membership Organizations",
      description:
        "Professional membership networks designed to connect entrepreneurs, corporates, investors, and industry leaders through collaboration and business engagement.",
      iconImage: "/home/headquarters.png",
      category: "membership",
      points: ["Industry Networking Events","Executive & Professional Communities","Partnership & Collaboration Opportunities"],
    },
    {
      title: "Manpower & Placement",
      description:
        "Comprehensive recruitment and workforce solutions that connect organizations with skilled professionals across multiple industries.",
      iconImage: "/home/headquarters.png",
      category: "manpower",
      points: ["alent Acquisition & Recruitment","Executive Search & Placement","Internship & Career Support Programs"],
    },
    {
      title: "Education & Training",
      description:
        "Professional education and skill development programs focused on leadership, technology, business management, and career advancement.",
      iconImage: "/home/headquarters.png",
      category: "education",
      points: ["Executive & Leadership Training","AI & Technology Programs","Professional Certification Courses"],
    },
  ],
};

const incubationData = {
  badge: "ONE WORLD BUSINESS SCHOOL & INCUBATION CENTRE FZE",
  title: "Turn Your Vision into a Market-Leading Enterprise",
  description:
    "The ultimate ecosystem for founders. We provide the capital, mentorship, and global network required to scale your startup from concept to exit.",
  heroTitleLines: ["Turn Your Vision into a", "Market-Leading Enterprise"],
  heroDescription:
    "The ultimate ecosystem for founders. We provide the capital, mentorship, and global network required to scale your startup from concept to exit.",
  primaryAction: { label: "Start Your Journey", href: "/contact" },
  secondaryAction: { label: "View Portfolio", href: "/about" },
  roadmapTitle: "The Incubation Roadmap",
  roadmapSubtitle: "A structured transition from idea to global scale.",
  steps: [
    {
      number: 1,
      title: "Ideation & Validation",
      description: "Testing your core assumptions in the real market.",
    },
    {
      number: 2,
      title: "Product Development",
      description: "Building MVPs with expert technical mentorship.",
    },
    {
      number: 3,
      title: "Market Scaling",
      description: "Venture capital access and global expansion strategies.",
    },
  ],
  roadmapItems: [
    {
      title: "Idea Validation",
      description:
        "When your ideas seem crazy, analyze market gaps, and write your unique value proposition with clarity.",
      points: ["Market Research Support", "SWOT Feasibility Audit"],
      image: "/home/headquarters.png",
    },
    {
      title: "MVP Development",
      description:
        "Build the first viable product in under 90 days with low-cost development and user-centric features.",
      points: ["UI/UX Prototyping", "Packaging Resources"],
      image: "/home/hero-bg.jpg",
    },
    {
      title: "Market Growth",
      description:
        "Go-to-market strategies that actually work. We connect you with first customers and help refine product-market fit.",
      points: ["Sales Mentorship Programs", "Capital & Partner Network"],
      image: "/home/headquarters.png",
    },
  ],
  portfolioTitle: "Portfolio Highlights",
  portfolioDescription:
    "See how we've helped disruptive startups navigate the complexities of international business growth.",
  portfolioAction: { label: "View all stories ->", href: "/about" },
  portfolioCards: [
    {
      category: "FINTECH",
      title: "NexGen Payments",
      description:
        "Scaled from a local gateway to a cross-border payment powerhouse within 18 months.",
      metrics: [
        { value: "300%", label: "Growth" },
        { value: "$12M", label: "Series A" },
      ],
      image: "/home/hero-bg.jpg",
    },
    {
      category: "SUSTAINABILITY",
      title: "GreenTrace AI",
      description:
        "Using AI to optimize supply chains and reduce carbon footprints in agriculture.",
      metrics: [
        { value: "50+", label: "Partners" },
        { value: "2.4k", label: "Tons CO2 Saved" },
      ],
      image: "/home/headquarters.png",
    },
  ],
  image: "/home/incubation.jpg",
  stat: {
    value: "50+",
    label: "Startups Accelerated",
  },
};

const homeIncubationHighlightData = {
  title: "From Idea to Global Scale",
  description:
    "Our Incubation Centre provides more than just desk space. We offer a structured ecosystem designed to accelerate high-growth potential startups.",
  steps: [
    {
      number: 1,
      title: "Ideation & Validation",
      description: "Testing your core assumptions in the real market.",
    },
    {
      number: 2,
      title: "Product Development",
      description: "Building MVPs with expert technical mentorship.",
    },
    {
      number: 3,
      title: "Market Scaling",
      description: "Venture capital access and global expansion strategies.",
    },
  ],
  image: "/home/incubation.jpg",
  stat: {
    value: "50+",
    label: "Startups Accelerated",
  },
};

const globalStandardsData = {
  title: "Setting Global Standards",
  description:
    "We combine academic rigour with real-world venture expertise to deliver unmatched value.",
  pillars: [
    {
      title: "Global Faculty",
      description: "Industry experts from top-tier global institutions.",
    },
    {
      title: "Innovation Hub",
      description: "State-of-the-art facilities for research and R&D.",
    },
    {
      title: "VC Network",
      description: "Direct bridge to regional and international investors.",
    },
    {
      title: "Accreditation",
      description: "Certifications recognized by global industry boards.",
    },
  ],
};





const clientLogosData = {
  title: "Start Your Journey Today",
  subtitle:
    "Whether you are an aspiring entrepreneur or an established professional, we have the tools to help you succeed.",
  action: {
    label: "Get In Touch",
    href: "/contact",
  },
};

const servicesCtaData = {
  title: "Ready to elevate your business?",
  description:
    "Partner with us now to explore solutions that drive growth and innovation.",
  primaryAction: { label: "Email Us Today", href: "/contact" },
  secondaryAction: { label: "Download Brochure", href: "/brochure" },
};

const coursesCatalogData = {
  title: "Master the Future of Business",
  description:
    "Professional training programs designed to bridge the gap between academic knowledge and industry excellence.",
  categories: ["Business Management", "Entrepreneurship", "Digital Marketing", "Data Analytics"],
  levels: ["All Levels", "Beginner", "Intermediate", "Advanced"],
  durations: ["Any Duration", "4-8 Weeks", "8-12 Weeks", "12+ Weeks"],
  courses: [
    {
      badge: "Advanced",
      title: "Executive Leadership & Strategic Management",
      description:
        "Master the complete life of modern corporate leadership and learn to drive organizational growth through strategy.",
      skills: ["Leadership", "Policy", "Conflict Resolution", "MBA"],
      weeks: "12 Weeks",
      image: "/home/headquarters.png",
    },
    {
      badge: "Intermediate",
      title: "The Startup Catalyst: From Idea to Exit",
      description:
        "A comprehensive guide for entrepreneurs to validate business models, secure funding, and scale operations.",
      skills: ["Pitching", "Venture Capital", "MVP Dev"],
      weeks: "8 Weeks",
      image: "/home/hero-bg.jpg",
    },
    {
      badge: "Professional",
      title: "Certified Business Data Analyst",
      description:
        "Bridge the gap between raw data and business insights. Learn tools like SQL, Python, and Tableau for decision-making.",
      skills: ["Data Viz", "Predictive Modeling", "BI Tools"],
      weeks: "16 Weeks",
      image: "/home/headquarters.svg",
    },
    {
      badge: "Beginner",
      title: "Global Marketing & Brand Identity",
      description:
        "Learn how to create compelling brand stories and execute multi-channel marketing campaigns across diverse markets.",
      skills: ["Branding", "Social Media", "Analytics"],
      weeks: "6 Weeks",
      image: "/home/headquarters.png",
    },
  ],
};

const researchHubData = {
  heroBadge: "ADVANCED RESEARCH DIVISION",
  heroTitleLines: ["Architecting the", "Future", "of Global Industry."],
  heroDescription:
    "One World Business School and Incubation Centre FZE operates at the intersection of academic rigor and industrial application, driving breakthroughs in autonomous systems and sustainable frameworks.",
  heroPrimaryAction: { label: "Explore Lab Journals", href: "/contact" },
  heroSecondaryAction: { label: "Submit Proposal", href: "/contact" },
  heroImage: "/home/hero-bg.jpg",
  overviewTitle: "Pushing Boundaries Through Interdisciplinary Inquiry",
  overviewDescription:
    "Our research philosophy centers on the integration of theoretical frameworks with real-world technical implementation. We provide the infrastructure for scholars and entrepreneurs to test hypotheses in simulated and physical environments.",
  overviewPoints: [
    "Global Intellectual Property Development",
    "Incubation-Integrated Research Cycles",
    "Cross-Border Academic Partnerships",
  ],
  overviewImage: "/home/headquarters.png",
  pillarsTitle: "Core Research Pillars",
  pillars: [
    {
      icon: "innovation",
      title: "AI & Robotics",
      description:
        "Developing autonomous algorithms and kinetic hardware interfaces for industrial optimization and logistics.",
      project: "ONGOING PROJECT: PROJECT SENTINEL",
    },
    {
      icon: "vision",
      title: "AR/VR Simulation",
      description:
        "Immersive environments for complex business strategy visualization and high-risk technical training.",
      project: "ONGOING PROJECT: META-CAMPUS 2.0",
    },
    {
      icon: "compliance",
      title: "Environmental Studies",
      description:
        "Carbon sequestration models and sustainable supply chain ethics in the evolving global landscape.",
      project: "ONGOING PROJECT: ECO-SUPPLY GRAPH",
    },
  ],
  metrics: [
    { value: "124+", label: "WHITE PAPERS" },
    { value: "42", label: "PATENTS FILED" },
    { value: "15", label: "GLOBAL LABS" },
    { value: "$12M", label: "GRANT FUNDING" },
  ],
  simulationTitle: "Real-Time Impact Simulation",
  simulationDescription:
    "We leverage proprietary data models to predict the economic impact of emerging technologies. Our current research focus is on the acceleration of robotic automation in mid-market manufacturing sectors.",
  accuracyLabel: "MODEL ACCURACY",
  accuracyValue: "98.2%",
  velocityLabel: "DEPLOYMENT VELOCITY",
  velocityValue: "74.5%",
  simulationImage: "/home/hero-bg.jpg",
};

// const ctaData = {
//   title: "Partner with One World Trade Centre FZE for Global Trade and Investment Solutions",
//   description:
//     "Our advisors are ready to help you navigate the complexities of global commerce and UAE market opportunities.",
//   action: { label: "Request a Strategic Consultation", href: "/contact" },
// };

const aboutHeroData = {
  titleAccent: "Empowering the Next",
  titleMain: "Generation of Global Leaders.",
  description:
    "One World Business School and Incubation Centre FZE is more than an institution; it's a launchpad for visionary entrepreneurs and industry disruptors in a rapidly evolving global economy.",
  image: "/home/headquarters.png",
};

const aboutOverviewData = {
  eyebrow: "Company Overview",
  title: "A Global Hub for Excellence",
  description:
    "Founded on the principles of innovation and inclusivity, One World Business School bridges the gap between traditional academic theory and the fast-paced reality of modern business. Based in the FZE, we serve as a nexus for international talent.",
  subDescription:
    "Our unique approach combines rigorous academic standards with a hands-on incubation environment, ensuring that our students don't just learn about business—they build them.",
  stats: [
    { value: "50+", label: "Startups Incubated" },
    { value: "15+", label: "Global Partnerships" },
  ],
  images: ["/home/hero-bg.jpg", "/home/headquarters.png"],
};

const aboutVisionMissionData = {
  items: [
    {
      title: "Our Mission",
      description:
        "To democratize world-class business education and provide the structural support necessary for entrepreneurs to transform bold ideas into sustainable, high-impact enterprises.",
      icon: "Zap",
      accentColor: "#0b3d91",
    },
    {
      title: "Our Vision",
      description:
        "To be the premier global ecosystem where education meets execution, fostering a world where economic opportunity is limited only by one's imagination and drive.",
      icon: "Eye",
      accentColor: "#c8a96a",
    },
  ],
};

const aboutFrameworkData = {
  title: "The O.N.E Framework",
  description:
    "Our unique methodology drives everything we do, ensuring excellence from the classroom to the boardroom.",
  pillars: [
    {
      letter: "O",
      title: "Operational Excellence",
      description:
        "Streamlined processes and world-class management standards that ensure every venture and student project runs with peak efficiency and professionalism.",
    },
    {
      letter: "N",
      title: "Next-Gen Learning",
      description:
        "Moving beyond textbooks into immersive, AI-enhanced, and practical curricula designed for the complexities of the 21st-century digital economy.",
    },
    {
      letter: "E",
      title: "Entrepreneurial Growth",
      description:
        "Providing the capital, mentorship, and network required to scale ideas from the prototype stage to global market entry.",
    },
  ],
};

const aboutCtaData = {
  title: ["Ready to define your future?"],
  description:
    "Join a community of innovators, thinkers, and doers. Whether you are looking to earn a degree or launch your next startup, One World is your destination.",
  primaryAction: { label: "Join the School", href: "/courses" },
  secondaryAction: { label: "Enter the Incubator", href: "/incubation" },
};

const contactHeroData = {
  title: ["Get In Touch"],
  description:
    "Partner with One World Business School and Incubation Centre FZE for academic excellence and entrepreneurial growth.",
  stat: "Serving clients across 60+ countries",
  backgroundImage: "https://www.figma.com/api/mcp/asset/2f1e71da-1c2d-4350-ac36-c5e8bfe8168f",
};

const contactInquiryData = {
  formTitle: "Submit an Inquiry",
  formDescription: "Fill out the form below and our team will get back to you within 24-48 hours.",
  submitLabel: "Submit Inquiry",
  inquiryOptions: [
    "Business Consulting",
    "Company Formation",
    "Trade Licensing",
    "Tax Consultancy",
    "Visa Services",
  ],
  officeHeading: "Contact Details",
  officeItems: [
    {
      title: "Regional Headquarters",
      lines: [
        "Sharjah Publishing City Free Zone (SPCFZ),",
        "Office 204, Building A1,",
        "Sharjah, United Arab Emirates",
      ],
      icon: "location",
    },
    {
      title: "Phone & WhatsApp",
      lines: ["+971 6 500 0000", "+971 50 123 4567"],
      icon: "phone",
    },
    {
      title: "Email Support",
      lines: ["contact@oneworldfze.ae", "consultancy@oneworldfze.ae"],
      icon: "mail",
    },
  ],
  departmentContacts: [
    {
      title: "School",
      subtitle: "Admissions & Academic Affairs",
      email: "admissions@oneworld.edu",
    },
    {
      title: "Incubator",
      subtitle: "Startups & Mentorship",
      email: "startup@oneworld.edu",
    },
    {
      title: "Advisory",
      subtitle: "Consulting & Corporate",
      email: "advisory@oneworld.edu",
    },
  ],
  mapImage: "https://www.figma.com/api/mcp/asset/a074e368-5cf1-401a-97eb-9bcbce33e4c2",
  mapLabelTitle: "SPCFZ, Sharjah",
  mapLabelSubtitle: "United Arab Emirates",
};

const homeSections = [
  section("hero", 0, heroData),
  section("intro", 1, introData),
  section("services", 2, servicesData),
  section("homeIncubationHighlight", 3, homeIncubationHighlightData),
  section("globalStandards", 4, globalStandardsData), 
  section("clientLogos", 5, clientLogosData),
];

const aboutSections = [
  section("aboutHero", 0, aboutHeroData),
  section("aboutOverview", 1, aboutOverviewData),
  section("aboutVisionMission", 2, aboutVisionMissionData),
  section("aboutFramework", 3, aboutFrameworkData),
  section("aboutCTA", 4, aboutCtaData),
];

const servicesPageSections = [
  section("servicesHero", 0, servicesHeroData),
  section("servicesAccordion", 1, servicesAccordionData),
  section("servicesCTA", 2, servicesCtaData),
];

const coursesPageSections = [section("coursesCatalog", 0, coursesCatalogData)];
const incubationPageSections = [section("incubation", 0, incubationData)];
const researchPageSections = [section("researchHub", 0, researchHubData)];

const contactPageSections = [
  section("contactHero", 0, contactHeroData),
  section("contactInquiry", 1, contactInquiryData),
];

async function main() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI");
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "AdminChangeMe!", 12);
  await User.findOneAndUpdate(
    { email: "admin@owtc-fze.com" },
    { $set: { email: "admin@owtc-fze.com", passwordHash } },
    { upsert: true },
  );
  console.log("Admin user: admin@owtc-fze.com /", process.env.ADMIN_PASSWORD ?? "AdminChangeMe!");

  await SiteGlobal.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        key: "default",
        navItems,
        footerColumns,
        footerMeta,
        logoSrc: "/home/logo.png",
        featureFlags: { clientLogos: true },
        applyNowModal: defaultApplyNowModal,
        seoDefaults: {
          defaultTitle: "One World Business School and Incubation Centre",
          defaultDescription:
            "One World Business School and Incubation Centre - delivering business education, consultancy, and incubation support in the UAE.",
        },
      },
    },
    { upsert: true },
  );
  console.log("SiteGlobal seeded");

  const pages = [
    {
      slug: "home",
      title: "Home",
      sections: homeSections,
      seoTitle: "One World Business School and Incubation Centre",
      seoDescription:
        "One World Business School and Incubation Centre - delivering business education, consultancy, and incubation support in the UAE.",
    },
    {
      slug: "about",
      title: "About Us",
      sections: aboutSections,
      seoTitle: "About Us | One World Business School and Incubation Centre",
      seoDescription: "Learn about One World Business School and Incubation Centre and our focus on education, innovation, and entrepreneurship.",
    },
    {
      slug: "services",
      title: "Services",
      sections: servicesPageSections,
      seoTitle: "Services | One World Business School and Incubation Centre",
      seoDescription: "Explore our education, consultancy, research, and business incubation services.",
    },
    {
      slug: "contact",
      title: "Contact",
      sections: contactPageSections,
      seoTitle: "Contact | One World Business School and Incubation Centre",
      seoDescription: "Reach our advisors for programs, consulting, and incubation support.",
    },
    {
      slug: "courses",
      title: "Courses",
      sections: coursesPageSections,
      seoTitle: "Courses | One World Business School and Incubation Centre",
      seoDescription: "Explore practical programs in leadership, startup growth, analytics, and marketing.",
    },
    {
      slug: "incubation",
      title: "Incubation",
      sections: incubationPageSections,
      seoTitle: "Incubation | One World Business School and Incubation Centre",
      seoDescription:
        "Explore our structured incubation roadmap, founder support ecosystem, and portfolio growth stories.",
    },
    {
      slug: "research",
      title: "Research",
      sections: researchPageSections,
      seoTitle: "Research | One World Business School and Incubation Centre",
      seoDescription:
        "Explore our advanced research division, interdisciplinary labs, and funded innovation programs.",
    },
  ];

  for (const p of pages) {
    const published = structuredClone(p.sections);
    await Page.findOneAndUpdate(
      { slug: p.slug },
      {
        $set: {
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
    console.log("Page seeded:", p.slug);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


