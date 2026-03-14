export interface ScorecardSample {
  id: string;
  startupId: string;
  startupName: string;
  judgeName: string;
  score: number;
  feedback: string;
  evaluationDate: string;
}

export const scorecards: ScorecardSample[] = [
  {
    id: "sc1",
    startupId: "technova",
    startupName: "TechNova",
    judgeName: "Judge #1",
    score: 82,
    feedback: "Strong AI implementation and clear business model.",
    evaluationDate: "2025-01-10",
  },
  {
    id: "sc2",
    startupId: "ecogrow",
    startupName: "EcoGrow",
    judgeName: "Judge #2",
    score: 74,
    feedback: "Good sustainability focus but needs scalability improvements.",
    evaluationDate: "2025-01-12",
  },
  {
    id: "sc3",
    startupId: "my_company",
    startupName: "MY_Company",
    judgeName: "Judge #3",
    score: 68,
    feedback: "Solid workflow automation concept. Market differentiation needs more clarity.",
    evaluationDate: "2025-01-15",
  },
  {
    id: "sc4",
    startupId: "boat",
    startupName: "Boat",
    judgeName: "Judge #1",
    score: 91,
    feedback: "Exceptional product-market fit and strong brand recognition. Ready for next stage.",
    evaluationDate: "2025-01-18",
  },
  {
    id: "sc5",
    startupId: "mmcoe_exam_centre",
    startupName: "MMCOE EXAM CENTRE",
    judgeName: "Judge #2",
    score: 77,
    feedback: "Innovative EdTech solution with institutional backing. Expand to more institutions.",
    evaluationDate: "2025-01-20",
  },
];
