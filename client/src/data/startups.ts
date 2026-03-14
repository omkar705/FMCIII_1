export interface Startup {
  id: string;
  name: string;
  logoInitial: string;
  domain: string;
  tagline: string;
  description: string;
  stage: string;
  foundedYear: number;
  teamSize: number;
  location: string;
  website: string;
  email: string;
  phone: string;
  about: string;
}

/** Static sample startup profiles. Replace with API calls when backend is ready. */
export const startups: Startup[] = [
  {
    id: "technova",
    name: "TechNova",
    logoInitial: "T",
    domain: "AI / ML",
    tagline: "AI-driven analytics platform",
    description: "AI-driven analytics platform for enterprises",
    stage: "Seed",
    foundedYear: 2024,
    teamSize: 6,
    location: "Pune, India",
    website: "https://technova.ai",
    email: "contact@technova.ai",
    phone: "+91 9876543210",
    about:
      "TechNova builds intelligent analytics tools using machine learning to help enterprises make data-driven decisions.",
  },
  {
    id: "ecogrow",
    name: "EcoGrow",
    logoInitial: "E",
    domain: "AgriTech / Sustainability",
    tagline: "Sustainable farming solutions",
    description: "Innovative sustainable agriculture platform",
    stage: "Pre-Seed",
    foundedYear: 2023,
    teamSize: 5,
    location: "Nashik, India",
    website: "https://ecogrow.org",
    email: "contact@ecogrow.org",
    phone: "+91 8765432109",
    about:
      "EcoGrow develops sustainable farming solutions that help farmers reduce waste and increase yield using eco-friendly techniques.",
  },
  {
    id: "my_company",
    name: "MY_Company",
    logoInitial: "M",
    domain: "SaaS / Productivity",
    tagline: "Streamlining business workflows",
    description: "Business workflow automation platform",
    stage: "Bootstrapped",
    foundedYear: 2024,
    teamSize: 3,
    location: "Aurangabad, India",
    website: "https://mycompany.io",
    email: "hello@mycompany.io",
    phone: "+91 7654321098",
    about:
      "MY_Company provides intuitive SaaS tools that streamline day-to-day business operations and increase team productivity.",
  },
  {
    id: "boat",
    name: "Boat",
    logoInitial: "B",
    domain: "Consumer Electronics",
    tagline: "Lifestyle electronics for the modern consumer",
    description: "Premium consumer electronics startup",
    stage: "Series A",
    foundedYear: 2022,
    teamSize: 20,
    location: "Mumbai, India",
    website: "https://boatstartup.com",
    email: "contact@boatstartup.com",
    phone: "+91 6543210987",
    about:
      "Boat is a lifestyle electronics brand delivering affordable, premium-quality audio products, wearables, and accessories to Indian consumers.",
  },
  {
    id: "mmcoe_exam_centre",
    name: "MMCOE EXAM CENTRE",
    logoInitial: "M",
    domain: "EdTech / Examination",
    tagline: "Digital examination infrastructure for institutions",
    description: "Digital exam management platform",
    stage: "Grant",
    foundedYear: 2024,
    teamSize: 12,
    location: "Pune, India",
    website: "https://mmcoe.edu.in",
    email: "exams@mmcoe.edu.in",
    phone: "+91 5432109876",
    about:
      "MMCOE Exam Centre provides a comprehensive digital examination infrastructure that supports institutions in conducting secure, efficient online assessments.",
  },
];
