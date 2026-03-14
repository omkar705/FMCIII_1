export interface StartupMockProfile {
  founder: string;
  email: string;
  phone: string;
  fundingStage: string;
  mentors: string[];
  applicationStatus: string;
  createdDate: string;
  teamSize: number;
  location: string;
  website?: string;
  scorecard: {
    innovation: number;
    marketPotential: number;
    teamStrength: number;
    execution: number;
    overall: number;
  };
}

/** Keyed by startup name (case-sensitive). Used to enrich API data with mock profile details. */
export const startupMockProfiles: Record<string, StartupMockProfile> = {
  TechNova: {
    founder: "Arjun Sharma",
    email: "arjun@technova.in",
    phone: "+91 98765 43210",
    fundingStage: "Seed",
    mentors: ["Dr. Ravi Kumar", "Priya Nair"],
    applicationStatus: "Selected",
    createdDate: "2023-04-15",
    teamSize: 8,
    location: "Pune, Maharashtra",
    website: "https://technova.in",
    scorecard: {
      innovation: 85,
      marketPotential: 78,
      teamStrength: 82,
      execution: 79,
      overall: 81,
    },
  },
  EcoGrow: {
    founder: "Meera Patil",
    email: "meera@ecogrow.org",
    phone: "+91 87654 32109",
    fundingStage: "Pre-Seed",
    mentors: ["Suresh Joshi"],
    applicationStatus: "Interview",
    createdDate: "2023-07-20",
    teamSize: 5,
    location: "Nashik, Maharashtra",
    website: "https://ecogrow.org",
    scorecard: {
      innovation: 90,
      marketPotential: 88,
      teamStrength: 75,
      execution: 72,
      overall: 81,
    },
  },
  MY_Company: {
    founder: "Rahul Deshmukh",
    email: "rahul@mycompany.io",
    phone: "+91 76543 21098",
    fundingStage: "Bootstrapped",
    mentors: ["Anita Kulkarni", "Vijay More"],
    applicationStatus: "Applied",
    createdDate: "2024-01-10",
    teamSize: 3,
    location: "Aurangabad, Maharashtra",
    website: "https://mycompany.io",
    scorecard: {
      innovation: 70,
      marketPotential: 65,
      teamStrength: 68,
      execution: 60,
      overall: 66,
    },
  },
  Boat: {
    founder: "Sameer Mehta",
    email: "sameer@boatstartup.com",
    phone: "+91 65432 10987",
    fundingStage: "Series A",
    mentors: ["Dr. Pradeep Singh", "Kavita Reddy", "Rohit Verma"],
    applicationStatus: "Selected",
    createdDate: "2022-11-05",
    teamSize: 20,
    location: "Mumbai, Maharashtra",
    website: "https://boatstartup.com",
    scorecard: {
      innovation: 92,
      marketPotential: 95,
      teamStrength: 90,
      execution: 88,
      overall: 91,
    },
  },
  "MMCOE EXAM CENTRE": {
    founder: "Dr. Sunil Babar",
    email: "sunil@mmcoe.edu.in",
    phone: "+91 54321 09876",
    fundingStage: "Grant",
    mentors: ["Prof. Arun Wagh"],
    applicationStatus: "Interview",
    createdDate: "2024-03-01",
    teamSize: 12,
    location: "Pune, Maharashtra",
    website: "https://mmcoe.edu.in",
    scorecard: {
      innovation: 75,
      marketPotential: 72,
      teamStrength: 80,
      execution: 77,
      overall: 76,
    },
  },
};
