export type EntranceExamType = 
  | 'JEE Main'
  | 'JEE Advanced'
  | 'NEET UG'
  | 'CUET UG'
  | 'TNEA'
  | 'MHT CET'
  | 'KCET'
  | 'WBJEE'
  | 'BITSAT'
  | 'VITEEE'
  | 'SRMJEEE'
  | 'GATE'
  | 'Other';

export type StudentCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type PreferredLocation = 'Any' | 'Same State' | 'Other State';

export type CollegeType = 'Government' | 'NIT' | 'IIT' | 'Government-Aided' | 'Deemed' | 'Private';

export type AppTheme = 
  | 'champagne-gold'
  | 'imperial-sapphire'
  | 'regal-emerald'
  | 'rose-bordeaux'
  | 'nordic-titanium'
  | 'alabaster-light'
  | 'electric-cyber'
  | 'slate-dark';

export type ProfileLogoIcon = 
  | 'graduation-cap'
  | 'rocket'
  | 'atom'
  | 'code'
  | 'award'
  | 'sparkles'
  | 'book-open'
  | 'crown';

export interface ProfileLogoConfig {
  icon: ProfileLogoIcon;
  gradient: string;
  customInitials?: string;
}

export interface GmailAccount {
  username?: string;
  email: string;
  name: string;
  avatarUrl?: string;
  avatarIcon?: ProfileLogoIcon;
  avatarGradient?: string;
  signedInAt: string;
  provider: 'google' | 'credentials';
  isVerified: boolean;
}

export interface StudentProfile {
  name: string;
  username?: string;
  email?: string;
  account?: GmailAccount | null;
  theme?: AppTheme;
  profileLogo?: ProfileLogoConfig;
  class10Percent: number;
  class12Percent: number;
  entranceExam: EntranceExamType;
  examScore: number; // Percentile, marks, or raw score
  expectedRank: number;
  targetAdmissionYear: number;
  state: string;
  category: StudentCategory;
  annualFamilyIncome: number;
  annualEducationBudget: number;
  hostelRequired: boolean;
  preferredLocation: PreferredLocation;
  applicationBudget: number;
}

export interface CourseOption {
  id: string;
  name: string;
  degree: string; // e.g. B.Tech, B.E., MBBS
  durationYears: number;
  cutoffOffsetRank: number; // Offset from base cutoff
  tuitionOffset: number;
  demandLevel: 'Very High' | 'High' | 'Moderate';
}

export interface CutoffHistoryYear {
  year: number;
  cutoff: number;
  totalApplicants: number;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  type: CollegeType;
  entranceExam: EntranceExamType;
  courses: CourseOption[];
  defaultCourseId: string;
  
  // Base financial metrics (per year)
  baseTuition: number;
  hostelFee: number;
  estimatedLivingExpenses: number;
  baseScholarship: number;
  applicationFee: number;
  
  // Admission metrics
  cutoffType: 'rank' | 'score'; // 'rank' (lower is better), 'score' (higher is better)
  cutoffs: {
    General: number;
    OBC: number;
    SC: number;
    ST: number;
    EWS: number;
  };
  historicalCutoffs: CutoffHistoryYear[];
  predictedCutoffNextYear: number;
  volatility: 'Stable' | 'Moderate Volatility' | 'High Volatility';
  competitionIndex: number; // 1 to 10
  
  // Additional Indian institutional info
  nirfRank?: number;
  averagePackageLpa?: number;
  highestPackageLpa?: number;
  highlights: string[];
  counsellingBody: string; // e.g. JoSAA / CSAB / TNEA / State CET Cell
  tags: string[];
}

export type AdmissionFitLevel = 'Strong Match' | 'Competitive' | 'Difficult' | 'Highly Competitive';

export interface AdmissionAnalysisResult {
  fitLevel: AdmissionFitLevel;
  admissionProbability: number; // 0 - 100
  effectiveCutoff: number;
  studentScoreOrRank: number;
  cutoffDifference: number; // positive = better than cutoff, negative = worse
  categoryAnalysisMessage: string;
  predictedCutoff: number;
  historicalAverage: number;
  competitionChangeDescription: string;
  isRankBased: boolean;
}

export interface YearCostProjection {
  year: number;
  label: string;
  tuition: number;
  hostel: number;
  living: number;
  scholarship: number;
  netCost: number;
  cumulativeCost: number;
  budget: number;
}

export interface FinancialAnalysisResult {
  tuition: number;
  hostel: number;
  living: number;
  baseScholarship: number;
  meritAdjustment: number;
  incomeWaiver: number;
  totalEstimatedScholarship: number;
  netAnnualCost: number;
  annualBudget: number;
  annualBudgetGap: number; // positive = surplus, negative = deficit
  isDeficit: boolean;
  fourYearTotal: number;
  projections: YearCostProjection[];
  affordabilityScore: number; // 0 - 100
  affordabilityLabel: string;
  affordabilityBreakdown: {
    budgetMatchScore: number;
    incomeFeasibilityScore: number;
    scholarshipImpactScore: number;
  };
}

export type PortfolioTier = 'Dream' | 'Target' | 'Safer';

export interface PortfolioCollegeEntry {
  collegeId: string;
  courseId: string;
  tier: PortfolioTier;
  notes?: string;
  addedAt: string;
}
