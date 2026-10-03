import {
  AdmissionAnalysisResult,
  AdmissionFitLevel,
  College,
  FinancialAnalysisResult,
  PortfolioTier,
  StudentProfile,
  YearCostProjection,
} from '../types';

/**
 * Format numbers in standard Indian Rupee representation (e.g. ₹2,65,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absStr = Math.abs(rounded).toString();

  if (absStr.length <= 3) {
    return `${isNegative ? '-' : ''}₹${absStr}`;
  }

  const lastThree = absStr.substring(absStr.length - 3);
  const otherNumbers = absStr.substring(0, absStr.length - 3);
  const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return `${isNegative ? '-' : ''}₹${formattedOthers},${lastThree}`;
}

/**
 * Format large amounts in Lakhs or Crores (e.g. ₹2.65 L, ₹1.2 Cr)
 */
export function formatLakh(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (abs >= 10000000) {
    return `${isNegative ? '-' : ''}₹${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `${isNegative ? '-' : ''}₹${(abs / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(amount);
}

/**
 * Format rank or score values nicely
 */
export function formatMetricValue(val: number, type: 'rank' | 'score'): string {
  if (type === 'rank') {
    return `#${Math.round(val).toLocaleString('en-IN')}`;
  }
  return Number.isInteger(val) ? val.toString() : val.toFixed(2);
}

/**
 * Analyzes student's admission chances against a college and course
 */
export function analyzeAdmissionChance(
  student: StudentProfile,
  college: College,
  courseId?: string
): AdmissionAnalysisResult {
  const course = college.courses.find((c) => c.id === courseId) || college.courses[0];
  const isRankBased = college.cutoffType === 'rank';

  // Base category cutoff
  const categoryCutoff = college.cutoffs[student.category] ?? college.cutoffs.General;
  const generalCutoff = college.cutoffs.General;

  // Apply course offset
  const effectiveCutoff = isRankBased
    ? categoryCutoff + (course?.cutoffOffsetRank || 0)
    : categoryCutoff + (course?.cutoffOffsetRank || 0);

  // Student's metric (rank or score)
  const studentMetric = isRankBased ? student.expectedRank : student.examScore;

  let cutoffDifference = 0;
  let probability = 50;
  let fitLevel: AdmissionFitLevel = 'Competitive';

  if (isRankBased) {
    // For ranks: lower rank is better (e.g. Rank 50 is better than Cutoff 150)
    cutoffDifference = effectiveCutoff - studentMetric;

    if (effectiveCutoff <= 0 || studentMetric <= 0) {
      probability = 30;
      fitLevel = 'Competitive';
    } else {
      const ratio = studentMetric / effectiveCutoff;
      if (ratio <= 0.6) {
        probability = Math.min(94, Math.round(92 + (1 - ratio) * 5));
        fitLevel = 'Strong Match';
      } else if (ratio <= 0.95) {
        probability = Math.round(75 + (0.95 - ratio) * 50);
        fitLevel = 'Strong Match';
      } else if (ratio <= 1.15) {
        probability = Math.round(52 + (1.15 - ratio) * 80);
        fitLevel = 'Competitive';
      } else if (ratio <= 1.5) {
        probability = Math.round(28 + (1.5 - ratio) * 50);
        fitLevel = 'Difficult';
      } else {
        probability = Math.max(5, Math.round(25 / Math.sqrt(ratio)));
        fitLevel = 'Highly Competitive';
      }
    }
  } else {
    // For scores (like TNEA out of 200, MHT CET percentile out of 100):
    // higher score is better (e.g. 199.5 vs cutoff 198.0)
    cutoffDifference = studentMetric - effectiveCutoff;

    if (cutoffDifference >= 1.5) {
      probability = 92;
      fitLevel = 'Strong Match';
    } else if (cutoffDifference >= 0) {
      probability = Math.round(70 + (cutoffDifference / 1.5) * 20);
      fitLevel = 'Strong Match';
    } else if (cutoffDifference >= -1.0) {
      probability = Math.round(48 + ((cutoffDifference + 1.0) / 1.0) * 20);
      fitLevel = 'Competitive';
    } else if (cutoffDifference >= -3.0) {
      probability = Math.round(20 + ((cutoffDifference + 3.0) / 2.0) * 25);
      fitLevel = 'Difficult';
    } else {
      probability = Math.max(4, Math.round(15 + cutoffDifference * 2));
      fitLevel = 'Highly Competitive';
    }
  }

  // Calculate historical average
  const histSum = college.historicalCutoffs.reduce((acc, h) => acc + h.cutoff, 0);
  const historicalAverage = Math.round(histSum / college.historicalCutoffs.length);

  // Category analysis message
  let categoryAnalysisMessage = '';
  if (student.category === 'General') {
    categoryAnalysisMessage = isRankBased
      ? `General (Open Category) Cutoff is Rank ${formatMetricValue(effectiveCutoff, 'rank')}. Your expected rank is ${formatMetricValue(studentMetric, 'rank')}.`
      : `General Cutoff benchmark is ${formatMetricValue(effectiveCutoff, 'score')}. Your current score is ${formatMetricValue(studentMetric, 'score')}.`;
  } else {
    if (isRankBased) {
      const isWithinCategory = studentMetric <= effectiveCutoff;
      categoryAnalysisMessage = `General Cutoff: Rank ${formatMetricValue(generalCutoff, 'rank')} · ${student.category} Cutoff: Rank ${formatMetricValue(effectiveCutoff, 'rank')}. Your expected rank is ${formatMetricValue(studentMetric, 'rank')}. ${
        isWithinCategory
          ? `Your expected rank is comfortably within the demo ${student.category} cutoff range.`
          : `Your expected rank is currently ${Math.abs(cutoffDifference)} positions outside the demo ${student.category} cutoff range.`
      }`;
    } else {
      const isWithinCategory = studentMetric >= effectiveCutoff;
      categoryAnalysisMessage = `General Cutoff: ${formatMetricValue(generalCutoff, 'score')} · ${student.category} Cutoff: ${formatMetricValue(effectiveCutoff, 'score')}. Your score: ${formatMetricValue(studentMetric, 'score')}. ${
        isWithinCategory
          ? `Your score meets or exceeds the demo ${student.category} cutoff criteria.`
          : `Your score is ${Math.abs(cutoffDifference).toFixed(2)} marks below the demo ${student.category} cutoff mark.`
      }`;
    }
  }

  // Competition change description
  const lastYear = college.historicalCutoffs[college.historicalCutoffs.length - 1];
  const prevYear = college.historicalCutoffs[college.historicalCutoffs.length - 2];
  let compText = 'Competition remains stable based on multi-year counselling trends.';
  if (lastYear && prevYear) {
    if (isRankBased) {
      if (lastYear.cutoff < prevYear.cutoff) {
        compText = `Closing rank tightened by ${prevYear.cutoff - lastYear.cutoff} ranks last year, reflecting higher applicant preference.`;
      } else {
        compText = `Closing rank relaxed slightly by ${lastYear.cutoff - prevYear.cutoff} ranks due to seat matrix expansion.`;
      }
    } else {
      if (lastYear.cutoff > prevYear.cutoff) {
        compText = `Closing score rose by ${(lastYear.cutoff - prevYear.cutoff).toFixed(2)} points due to higher average board marks.`;
      }
    }
  }

  return {
    fitLevel,
    admissionProbability: probability,
    effectiveCutoff,
    studentScoreOrRank: studentMetric,
    cutoffDifference,
    categoryAnalysisMessage,
    predictedCutoff: college.predictedCutoffNextYear,
    historicalAverage,
    competitionChangeDescription: compText,
    isRankBased,
  };
}

/**
 * Calculates complete financial breakdown including inflation, 4-year projections,
 * scholarships, and affordability scoring
 */
export function calculateFinancialAnalysis(
  student: StudentProfile,
  college: College,
  courseId?: string,
  inflationRate: number = 0.075 // 7.5% default Indian education inflation
): FinancialAnalysisResult {
  const course = college.courses.find((c) => c.id === courseId) || college.courses[0];
  const tuition = college.baseTuition + (course?.tuitionOffset || 0);
  const hostel = student.hostelRequired ? college.hostelFee : 0;
  const living = college.estimatedLivingExpenses;

  // 1. Base Scholarship
  const baseScholarship = college.baseScholarship;

  // 2. Merit / Competition Adjustment
  // Students with high academic scores or top ranks qualify for higher institutional merit assistance
  let meritAdjustment = 0;
  if (student.class12Percent >= 95 || student.expectedRank <= 1000) {
    meritAdjustment = Math.round(baseScholarship * 0.4);
  } else if (student.class12Percent >= 90 || student.expectedRank <= 5000) {
    meritAdjustment = Math.round(baseScholarship * 0.2);
  }

  // 3. Indian Government / Institutional Income-based Tuition Waiver
  // Real Indian policy demo model (e.g. Central Govt / IIT / NIT rules):
  // - SC / ST students receive 100% tuition waiver in central govt institutes
  // - Families with income < ₹1,00,000 get 100% tuition fee waiver in IITs/NITs
  // - Families with income between ₹1,00,000 and ₹5,00,000 get 66.6% tuition fee waiver
  let incomeWaiver = 0;
  if (college.type === 'Government' || college.type === 'NIT' || college.type === 'IIT') {
    if (student.category === 'SC' || student.category === 'ST') {
      incomeWaiver = tuition; // Full tuition concession
    } else if (student.annualFamilyIncome < 100000) {
      incomeWaiver = tuition; // Full tuition waiver for economically backward
    } else if (student.annualFamilyIncome <= 500000) {
      incomeWaiver = Math.round(tuition * 0.666); // 2/3rd fee waiver
    }
  } else if (college.type === 'Government-Aided' && student.annualFamilyIncome < 200000) {
    incomeWaiver = Math.round(tuition * 0.5);
  }

  const rawScholarship = baseScholarship + meritAdjustment + incomeWaiver;
  // Cap scholarship at total annual fees
  const totalEstimatedScholarship = Math.min(rawScholarship, tuition + hostel);

  // Net Annual Cost
  const netAnnualCost = Math.max(0, tuition + hostel + living - totalEstimatedScholarship);

  // Annual Budget comparison
  const annualBudget = student.annualEducationBudget;
  const annualBudgetGap = annualBudget - netAnnualCost;
  const isDeficit = annualBudgetGap < 0;

  // 4-Year Cost Projection with Inflation
  // Formula: Projected = Base * (1 + inflationRate) ^ (year - 1)
  const duration = course?.durationYears || 4;
  const projections: YearCostProjection[] = [];
  let cumulativeCost = 0;

  for (let yr = 1; yr <= duration; yr++) {
    const power = yr - 1;
    const yrTuition = Math.round(tuition * Math.pow(1 + inflationRate, power));
    const yrHostel = Math.round(hostel * Math.pow(1 + inflationRate * 0.8, power));
    const yrLiving = Math.round(living * Math.pow(1 + inflationRate * 0.9, power));
    // Scholarships often have fixed or minor escalation
    const yrScholarship = Math.round(totalEstimatedScholarship * Math.pow(1 + inflationRate * 0.3, power));
    const yrNet = Math.max(0, yrTuition + yrHostel + yrLiving - yrScholarship);
    cumulativeCost += yrNet;

    projections.push({
      year: yr,
      label: `Year ${yr}`,
      tuition: yrTuition,
      hostel: yrHostel,
      living: yrLiving,
      scholarship: yrScholarship,
      netCost: yrNet,
      cumulativeCost,
      budget: annualBudget,
    });
  }

  const fourYearTotal = cumulativeCost;

  // Affordability Score (0 to 100)
  // Factors:
  // 1. Budget coverage (50 pts): Does annual budget cover net cost?
  // 2. Family Income multiple (30 pts): Is net cost < 40% of annual family income?
  // 3. Scholarship leverage (20 pts): How effectively do scholarships reduce burden?
  let budgetMatchScore = 0;
  if (netAnnualCost === 0) {
    budgetMatchScore = 50;
  } else {
    const coverageRatio = annualBudget / netAnnualCost;
    if (coverageRatio >= 1.2) budgetMatchScore = 50;
    else if (coverageRatio >= 1.0) budgetMatchScore = 44 + Math.round((coverageRatio - 1.0) * 30);
    else if (coverageRatio >= 0.7) budgetMatchScore = 25 + Math.round((coverageRatio - 0.7) * 60);
    else budgetMatchScore = Math.max(5, Math.round(coverageRatio * 35));
  }

  let incomeFeasibilityScore = 0;
  const income = Math.max(student.annualFamilyIncome, 50000);
  const costToIncome = netAnnualCost / income;
  if (costToIncome <= 0.25) incomeFeasibilityScore = 30;
  else if (costToIncome <= 0.5) incomeFeasibilityScore = Math.round(30 - (costToIncome - 0.25) * 40);
  else if (costToIncome <= 0.8) incomeFeasibilityScore = Math.round(20 - (costToIncome - 0.5) * 35);
  else incomeFeasibilityScore = Math.max(2, Math.round(10 - costToIncome * 5));

  let scholarshipImpactScore = 0;
  const grossFee = tuition + hostel + living;
  if (grossFee > 0) {
    const reliefRatio = totalEstimatedScholarship / grossFee;
    scholarshipImpactScore = Math.min(20, Math.round(reliefRatio * 20));
  }

  const affordabilityScore = Math.min(100, Math.max(10, budgetMatchScore + incomeFeasibilityScore + scholarshipImpactScore));

  let affordabilityLabel = 'Comfortably Affordable';
  if (affordabilityScore < 50) {
    affordabilityLabel = 'High Budget Deficit';
  } else if (affordabilityScore < 75) {
    affordabilityLabel = 'Moderate Financial Stretch';
  }

  return {
    tuition,
    hostel,
    living,
    baseScholarship,
    meritAdjustment,
    incomeWaiver,
    totalEstimatedScholarship,
    netAnnualCost,
    annualBudget,
    annualBudgetGap,
    isDeficit,
    fourYearTotal,
    projections,
    affordabilityScore,
    affordabilityLabel,
    affordabilityBreakdown: {
      budgetMatchScore,
      incomeFeasibilityScore,
      scholarshipImpactScore,
    },
  };
}

/**
 * Determine automatic portfolio categorization for a college
 */
export function categorizePortfolioTier(admissionProbability: number): PortfolioTier {
  if (admissionProbability >= 75) {
    return 'Safer';
  }
  if (admissionProbability >= 45) {
    return 'Target';
  }
  return 'Dream';
}
