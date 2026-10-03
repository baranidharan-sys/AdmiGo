import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Gift,
  Activity,
  Flame,
  ChevronRight,
} from 'lucide-react';
import {
  AdmissionAnalysisResult,
  College,
  FinancialAnalysisResult,
  StudentProfile,
} from '../types';
import { formatINR, formatLakh } from '../utils/calculations';

interface LiveStatusHeaderProps {
  college: College;
  studentProfile: StudentProfile;
  admissionAnalysis: AdmissionAnalysisResult;
  financialAnalysis: FinancialAnalysisResult;
  activeCourseName: string;
  onOpenCollegeSearch: () => void;
}

export const LiveStatusHeader: React.FC<LiveStatusHeaderProps> = ({
  college,
  studentProfile,
  admissionAnalysis,
  financialAnalysis,
  activeCourseName,
  onOpenCollegeSearch,
}) => {
  // Fit indicator styling
  const fitColorConfig = {
    'Strong Match': {
      bg: 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300',
      dot: 'bg-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
    Competitive: {
      bg: 'bg-amber-950/40 border-amber-700/60 text-amber-300',
      dot: 'bg-amber-400',
      glow: 'shadow-amber-500/10',
    },
    Difficult: {
      bg: 'bg-orange-950/40 border-orange-700/60 text-orange-300',
      dot: 'bg-orange-400',
      glow: 'shadow-orange-500/10',
    },
    'Highly Competitive': {
      bg: 'bg-rose-950/40 border-rose-700/60 text-rose-300',
      dot: 'bg-rose-400',
      glow: 'shadow-rose-500/10',
    },
  }[admissionAnalysis.fitLevel];

  // Budget gap
  const isDeficit = financialAnalysis.isDeficit;
  const budgetGapFormatted = formatINR(Math.abs(financialAnalysis.annualBudgetGap));

  return (
    <div className="w-full bg-slate-900/90 border-b border-slate-800/90 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top Active Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/70">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] font-mono">
              Active College:
            </span>
            <span className="text-white font-bold text-sm tracking-tight">
              {college.name}
            </span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-indigo-300 text-xs hidden sm:inline">
              {activeCourseName}
            </span>
            <span className="text-slate-400 hidden sm:inline">·</span>
            <span className="text-slate-400 text-xs hidden md:inline">
              {college.city}, {college.state}
            </span>
          </div>

          <button
            onClick={onOpenCollegeSearch}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <span>Switch College / Course</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Live Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Admission Indicator */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Admission Fit
              </span>
              <div className={`w-2 h-2 rounded-full ${fitColorConfig.dot} animate-pulse`} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-white">
                {admissionAnalysis.admissionProbability}%
              </span>
              <span className="text-xs font-semibold text-slate-300 truncate">
                {admissionAnalysis.fitLevel}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Cutoff: {college.cutoffType === 'rank' ? '#' : ''}
              {admissionAnalysis.effectiveCutoff} · {studentProfile.category}
            </div>
          </div>

          {/* 2. 4-Year Estimated Cost */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                4-Yr Est. Cost
              </span>
              <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-base font-extrabold text-white">
              {formatLakh(financialAnalysis.fourYearTotal)}
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Incl. tuition, hostel & living
            </div>
          </div>

          {/* 3. Annual Budget Gap */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Annual Budget Gap
              </span>
              {isDeficit ? (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-base font-extrabold ${
                  isDeficit ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isDeficit ? `-${budgetGapFormatted}` : `+${budgetGapFormatted}`}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {isDeficit ? 'Deficit' : 'Surplus'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Budget: {formatLakh(studentProfile.annualEducationBudget)}/yr
            </div>
          </div>

          {/* 4. Scholarship Estimate */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Est. Scholarship
              </span>
              <Gift className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-base font-extrabold text-indigo-300">
              {formatINR(financialAnalysis.totalEstimatedScholarship)}
              <span className="text-[11px] font-normal text-slate-400">/yr</span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Base + Merit + Fee Waiver
            </div>
          </div>

          {/* 5. Cutoff Drift & Volatility */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Cutoff Volatility
              </span>
              <Activity className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  college.volatility === 'Stable'
                    ? 'bg-emerald-400'
                    : college.volatility === 'Moderate Volatility'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              <span className="text-sm font-bold text-white truncate">
                {college.volatility}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">
              Predicted: {college.cutoffType === 'rank' ? '#' : ''}
              {college.predictedCutoffNextYear}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
