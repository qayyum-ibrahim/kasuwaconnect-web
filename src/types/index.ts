export interface Trader {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  tradeCategory: string;
  tradeDescription?: string;
  marketLocation: string;
  state: string;
  squadVirtualAccount: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  creditScore: number;
  creditTier: "unscored" | "low" | "medium" | "high";
  totalTransactions: number;
  totalVolume: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobSeeker {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  state: string;
  localGovt?: string;
  skills: string[];
  preferredCategories: string[];
  experienceLevel: "none" | "beginner" | "intermediate" | "experienced";
  languages: string[];
  marketLocation: string;
  squadVirtualAccount: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  totalEarnings: number;
  completedGigs: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface Job {
  _id: string;
  traderId: string | Trader;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  languagesRequired: string[];
  experienceLevel: string;
  payAmount: number;
  payFrequency: string;
  marketLocation: string;
  state: string;
  isOpen: boolean;
  isFilled: boolean;
  applicants: string[];
  hiredSeeker: string | null;
  createdAt: string;
}

export interface JobMatch {
  job_id: string;
  title: string;
  match_score: number;
  match_percentage: number;
  matched_skills: string[];
  score_breakdown: {
    skills_score: number;
    category_score: number;
    location_score: number;
    language_score: number;
    experience_score: number;
  };
  pay_amount: number;
  pay_frequency: string;
  state: string;
  market_location: string | null;
}

export interface Transaction {
  _id: string;
  traderId: string;
  squadTransactionRef: string;
  virtualAccountNumber: string;
  amount: number;
  amountInNaira: number;
  currency: string;
  senderName: string;
  senderBank: string;
  narration: string;
  transactionDate: string;
  isAnomaly: boolean;
}

export interface UserSession {
  id: string;
  phone: string;
  role: "trader" | "seeker";
  name: string;
}

export interface Applicant {
  _id: string;
  firstName: string;
  lastName: string;
  skills: string[];
  languages: string[];
  experienceLevel: string;
  state: string;
  marketLocation: string;
  matchPercentage: number;
  matchedSkills: string[];
  squadVirtualAccount?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}