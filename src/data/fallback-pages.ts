/**
 * Static page content when Mongo has no row yet (before `pnpm seed`)
 * or when a slug is missing. Keeps the marketing site usable on first run.
 */
import type { PublicPageView } from "@/lib/content/pages";
import type { PageSection } from "@/types/section";

function sid(slug: string, type: string, order: number): string {
  return `fb-${slug}-${type}-${order}`;
}

const heroData = {
  badge: "Premier UAE Free Zone Operations",
  title: ["Comprehensive", "Trading,", "Investment, and", "Corporate Solutions"],
  description:
    "Empowering global commerce through premium strategic consulting and operational excellence within the UAE's elite economic zones.",
  primaryAction: { label: "Request Consultation", href: "/contact" },
  secondaryAction: { label: "Explore Services", href: "/services" },
  backgroundImage: "/home/hero-bg.jpg",
};

const introData = {
  eyebrow: "About Us",
  title: ["Diverse UAE Free Zone", "Strategic Operations"],
  description:
    "One World Trade Centre FZE operates at the intersection of global trade and innovation. We provide seamless corporate solutions from our professional headquarters, leveraging the unique economic advantages of the UAE to scale international businesses.",
  highlights: [
    "Expertise in multi-jurisdictional licensing",
    "Direct access to global trade corridors",
    "High-tier corporate governance and advisory",
  ],
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
        "End-to-end advisory for market entry, business growth, operational excellence, and long-term organizational strategy.",
      iconImage: "/home/headquarters.png",
      category: "management",
      points: [],
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
        "Exclusive membership networks that connect founders, enterprises, and investors through high-impact events and collaborations.",
      iconImage: "/home/headquarters.png",
      category: "membership",
      points: [],
    },
    {
      title: "Manpower & Placement",
      description:
        "Talent acquisition and placement support aligned to strategic workforce planning and specialized industry requirements.",
      iconImage: "/home/headquarters.png",
      category: "manpower",
      points: [],
    },
    {
      title: "Education & Training",
      description:
        "Professional learning pathways, executive programs, and hands-on workshops for business and technology leaders.",
      iconImage: "/home/headquarters.png",
      category: "education",
      points: [],
    },
  ],
};

const servicesGridData = {
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
      features: ["Private Equity", "Asset Management", "Wealth Preservation"],
      cta: "Learn More",
    },
    {
      category: "Finance",
      title: "Financial Advisory",
      icon: "BarChart",
      description:
        "Strategic financial planning, capital restructuring, and risk assessment to ensure long-term fiscal health and regulatory compliance.",
      features: ["Capital Structuring", "Risk Management", "Mergers & Acquisitions"],
      cta: "Learn More",
    },
    {
      category: "Consultancy",
      title: "Business Management",
      icon: "Briefcase",
      description:
        "Operational intelligence, market entry strategies, and organizational restructuring for modern enterprises in a globalized economy.",
      features: ["Market Entry", "Operational Efficiency", "Corporate Governance"],
      cta: "Learn More",
    },
    {
      category: "Development",
      title: "Project Development",
      icon: "Building",
      description:
        "End-to-end management of infrastructure and real estate projects, from feasibility studies to execution planning and delivery.",
      features: ["Real Estate", "Infrastructure Planning", "Feasibility Studies"],
      cta: "Learn More",
    },
    {
      category: "Technology",
      title: "Technology & Innovation",
      icon: "Monitor",
      description:
        "Driving digital transformation through fintech solutions, blockchain integration, and advanced technology consulting.",
      features: ["Fintech Solutions", "Blockchain Consulting", "Digital Strategy"],
      cta: "Learn More",
    },
    {
      category: "Specialized",
      title: "Specialized Consulting",
      icon: "FlaskConical",
      description:
        "Niche expertise in emerging markets, sustainability-focused investments, and unique cross-border trade facilitation.",
      features: ["ESG Consulting", "Emerging Markets", "Trade Facilitation"],
      cta: "Learn More",
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
      title: "Idea Validation",
      description:
        "When your ideas seem crazy, analyze market gaps, and write your unique value proposition with clarity.",
    },
    {
      number: 2,
      title: "MVP Development",
      description:
        "Build the first viable product in under 90 days with low-cost development and user-centric features.",
    },
    {
      number: 3,
      title: "Market Growth",
      description:
        "Go-to-market strategies that actually work. We connect you with first customers and help refine product-market fit.",
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
  applicationTitle: "Ready to Build Your Legacy?",
  applicationDescription:
    "We are looking for bold founders solving hard problems. Our next cohort application window is now open. Apply today and get access to the ecosystem you need to win.",
  applicationFields: [
    { label: "Full Name", placeholder: "Jane Doe" },
    { label: "Startup Name", placeholder: "Acme Inc." },
    { label: "Email Address", placeholder: "jane@startup.com" },
    {
      label: "Pitch Deck URL",
      placeholder: "https://dropbox.com/your-pitch-deck",
    },
  ],
  applicationSubmitLabel: "Submit Application",
  applicationNote:
    "Our team typically responds within 5-7 business days for initial screening.",
  image: "/home/headquarters.png",
  stat: {
    value: "250+",
    label: "Companies launched",
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
    "Our framework is built around compliance, agility, and international best practice to help businesses scale with market-leading confidence.",
  pillars: [
    {
      title: "Regulatory Integrity",
      description:
        "Develop governance and reporting systems that meet global compliance expectations while preserving growth momentum.",
    },
    {
      title: "Operational Excellence",
      description:
        "Implement efficient, repeatable processes that support cross-border trade, finance, and corporate management.",
    },
    {
      title: "Market Enablement",
      description:
        "Position your business to enter new markets with the right licensing, partnerships, and strategic go-to-market plan.",
    },
  ],
};

const whyChooseData = {
  items: [
    {
      index: "01",
      title: "UAE Licensing",
      description: "Rapid business incorporation with full regulatory support in prime zones.",
    },
    {
      index: "02",
      title: "Global Network",
      description: "Connected to key financial hubs across Europe, Asia, and the Americas.",
    },
    {
      index: "03",
      title: "Investment Alpha",
      description: "Proprietary analysis driving high-yield opportunities in emerging markets.",
    },
    {
      index: "04",
      title: "Digital Focus",
      description: "Technology-first approach to all our corporate and trading operations.",
    },
  ],
};

const investmentData = {
  id: "investment",
  heading: ["Why Partners Choose", "One World Capital"],
  items: [
    {
      icon: "✓",
      title: "Global Expertise",
      description:
        "Navigating international markets with deep-rooted regulatory and cultural knowledge.",
    },
    {
      icon: "✓",
      title: "Strategic Advisory",
      description:
        "Outcome-focused guidance that prioritizes sustainable growth and long-term value.",
    },
    {
      icon: "✓",
      title: "Risk Management",
      description:
        "Rigorous due diligence and proprietary risk assessment frameworks for every venture.",
    },
  ],
  quoteText:
    '"One World Capital provides the vision and the vehicle for international expansion that few others can match."',
  quoteAuthor: "Strategic Portfolio Insight",
  quoteRole: "Global Division",
};

const clientLogosData = {
  title: "Ready to scale your vision?",
  subtitle: "Connect with our strategic advisors for a confidential consultation.",
  action: {
    label: "PARTNER WITH US",
    href: "/contact",
  },
};

const ctaData = {
  title: "Partner with One World Trade Centre FZE for Global Trade and Investment Solutions",
  description:
    "Our advisors are ready to help you navigate the complexities of global commerce and UAE market opportunities.",
  action: { label: "Request a Strategic Consultation", href: "/contact" },
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
      category: "Business Management",
      level: "Advanced",
      title: "Executive Leadership & Strategic Management",
      description:
        "Master the complete life of modern corporate leadership and learn to drive organizational growth through strategy.",
      skills: ["Leadership", "Policy", "Conflict Resolution", "MBA"],
      weeks: "12 Weeks",
      image: "/home/headquarters.png",
    },
    {
      badge: "Intermediate",
      category: "Entrepreneurship",
      level: "Intermediate",
      title: "The Startup Catalyst: From Idea to Exit",
      description:
        "A comprehensive guide for entrepreneurs to validate business models, secure funding, and scale operations.",
      skills: ["Pitching", "Venture Capital", "MVP Dev"],
      weeks: "8 Weeks",
      image: "/home/hero-bg.jpg",
    },
    {
      badge: "Professional",
      category: "Data Analytics",
      level: "Advanced",
      title: "Certified Business Data Analyst",
      description:
        "Bridge the gap between raw data and business insights. Learn tools like SQL, Python, and Tableau for decision-making.",
      skills: ["Data Viz", "Predictive Modeling", "BI Tools"],
      weeks: "16 Weeks",
      image: "/home/headquarters.svg",
    },
    {
      badge: "Beginner",
      category: "Digital Marketing",
      level: "Beginner",
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

const aboutHeroData = {
  title: "Redefining Excellence",
  description:
    "One World Trade Centre FZE serves as the strategic bridge for global enterprises entering the dynamic UAE marketplace.",
  backgroundImage: "https://www.figma.com/api/mcp/asset/c4d803f5-67dd-4a5e-8068-fec955887a41",
};

const aboutOverviewData = {
  eyebrow: "Company Overview",
  title: "A Global Hub for Excellence",
  description:
    "Founded on the principles of innovation and inclusivity, One World Business School bridges the gap between traditional academic theory and the fast-paced reality of modern business. Based in the FZE, we serve as a nexus for international talent.",
  subDescription:
    "Our unique approach combines rigorous academic standards with a hands-on incubation environment, ensuring that our students don't just learn about business - they build them.",
  stats: [
    { value: "50+", label: "Startups Incubated" },
    { value: "15+", label: "Global Partnerships" },
  ],
  images: ["/home/hero-bg.jpg", "/home/headquarters.png"],
};

const aboutVisionMissionData = {
  cards: [
    {
      title: "Our Vision",
      description:
        "To be the global benchmark for corporate excellence and strategic consulting in the UAE free zone landscape, empowering businesses to achieve sustainable growth in a borderless economy.",
      icon: "vision",
      accentColor: "#0b3d91",
    },
    {
      title: "Our Mission",
      description:
        "To deliver integrity-driven solutions, innovative strategies, and unparalleled compliance expertise, ensuring our clients' success within the UAE's premier free zone ecosystem.",
      icon: "mission",
      accentColor: "#c8a96a",
    },
  ],
};

const aboutAdvantageData = {
  eyebrow: "From Idea to Global Scale",
  title: ["Our mission is to set", "global standards for growth"],
  description:
    "We guide ambitious founders through every stage of market entry, compliance, and international expansion with a proven pathway to borderless growth.",
  points: [
    "Setting global standards",
    "Mobilizing efficient market entry",
    "Aligning growth with compliance",
    "Scaling operations with confidence",
  ],
  image: "https://www.figma.com/api/mcp/asset/7c13b2a1-812c-497c-aa9c-cfa824418b1d",
};

const aboutValuesData = {
  title: "Our Core Values",
  items: [
    {
      title: "Professionalism",
      description: "Exhibiting the highest standards of conduct in every interaction.",
      icon: "professionalism",
    },
    {
      title: "Integrity",
      description: "Upholding honesty and ethical transparency in all services.",
      icon: "integrity",
    },
    {
      title: "Innovation",
      description: "Pioneering creative strategies for complex corporate challenges.",
      icon: "innovation",
    },
    {
      title: "Client Focus",
      description: "Placing our partners' needs at the core of our operations.",
      icon: "clientFocus",
    },
    {
      title: "Compliance",
      description: "Strict adherence to regional and international legal norms.",
      icon: "compliance",
    },
  ],
};

const aboutCtaData = {
  title: ["Ready to Explore Global Opportunities?"],
  description:
    "Connect with our advisory team in Dubai and tap into our worldwide network of investment professionals.",
  primaryAction: { label: "Join the Club", href: "/contact" },
  secondaryAction: { label: "Request a Briefing", href: "/contact" },
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

function sections(slug: string, list: { type: PageSection["type"]; order: number; data: Record<string, unknown> }[]): PageSection[] {
  return list.map((s) => ({
    id: sid(slug, s.type, s.order),
    type: s.type,
    order: s.order,
    data: s.data,
  }));
}

const FALLBACK_BY_SLUG: Record<string, PublicPageView> = {
  home: {
    slug: "home",
    title: "Home",
    status: "published",
    seoTitle: "One World Business School and Incubation Centre",
    seoDescription:
      "One World Business School and Incubation Centre - delivering business education, consultancy, and incubation support in the UAE.",
    effectiveSections: sections("home", [
      { type: "hero", order: 0, data: heroData },
      { type: "intro", order: 1, data: introData },
      { type: "services", order: 2, data: servicesData },
      { type: "homeIncubationHighlight", order: 3, data: homeIncubationHighlightData },
      { type: "globalStandards", order: 4, data: globalStandardsData },
      { type: "whyChoose", order: 5, data: whyChooseData },
      { type: "investment", order: 6, data: investmentData },
      { type: "clientLogos", order: 7, data: clientLogosData },
      { type: "cta", order: 8, data: ctaData },
    ]),
    isPreview: false,
  },
  about: {
    slug: "about",
    title: "About Us",
    status: "published",
    seoTitle: "About Us | One World Business School and Incubation Centre",
    seoDescription:
      "Learn about One World Business School and Incubation Centre and our focus on education, innovation, and entrepreneurship.",
    effectiveSections: sections("about", [
      { type: "aboutHero", order: 0, data: aboutHeroData },
      { type: "aboutOverview", order: 1, data: aboutOverviewData },
      { type: "aboutVisionMission", order: 2, data: aboutVisionMissionData },
      { type: "aboutAdvantage", order: 3, data: aboutAdvantageData },
      { type: "aboutValues", order: 4, data: aboutValuesData },
      { type: "aboutCTA", order: 5, data: aboutCtaData },
    ]),
    isPreview: false,
  },
  services: {
    slug: "services",
    title: "Services",
    status: "published",
    seoTitle: "Services | One World Business School and Incubation Centre",
    seoDescription: "Explore our education, consultancy, research, and business incubation services.",
    effectiveSections: sections("services", [
      { type: "servicesHero", order: 0, data: servicesHeroData },
      { type: "servicesAccordion", order: 1, data: servicesAccordionData },
      { type: "servicesCTA", order: 2, data: servicesCtaData },
    ]),
    isPreview: false,
  },
  incubation: {
    slug: "incubation",
    title: "Incubation",
    status: "published",
    seoTitle: "Incubation | One World Business School and Incubation Centre",
    seoDescription:
      "Explore our structured incubation roadmap, founder support ecosystem, and portfolio growth stories.",
    effectiveSections: sections("incubation", [
      { type: "incubation", order: 0, data: incubationData },
      { type: "cta", order: 1, data: ctaData },
    ]),
    isPreview: false,
  },
  research: {
    slug: "research",
    title: "Research",
    status: "published",
    seoTitle: "Research | One World Business School and Incubation Centre",
    seoDescription:
      "Explore our advanced research division, interdisciplinary labs, and funded innovation programs.",
    effectiveSections: sections("research", [{ type: "researchHub", order: 0, data: researchHubData }]),
    isPreview: false,
  },
  courses: {
    slug: "courses",
    title: "Courses",
    status: "published",
    seoTitle: "Courses | One World Business School and Incubation Centre",
    seoDescription: "Explore practical programs in leadership, startup growth, analytics, and marketing.",
    effectiveSections: sections("courses", [
      { type: "coursesCatalog", order: 0, data: coursesCatalogData },
    ]),
    isPreview: false,
  },
  contact: {
    slug: "contact",
    title: "Contact",
    status: "published",
    seoTitle: "Contact | One World Business School and Incubation Centre",
    seoDescription: "Reach our advisors for programs, consulting, and incubation support.",
    effectiveSections: sections("contact", [
      { type: "contactHero", order: 0, data: contactHeroData },
      { type: "contactInquiry", order: 1, data: contactInquiryData },
    ]),
    isPreview: false,
  },
};

export function getFallbackPageView(slug: string): PublicPageView | null {
  return FALLBACK_BY_SLUG[slug] ?? null;
}


