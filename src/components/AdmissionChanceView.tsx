import React from 'react';
import {
  AdmissionAnalysisResult,
  College,
  CourseOption,
  StudentProfile,
} from '../types';
import { formatMetricValue } from '../utils/calculations';
import {
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Info,
  Layers,
  Award,
  Users,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface AdmissionChanceViewProps {
  college: College;
  course: CourseOption;
  student: StudentProfile;
  admissionAnalysis: AdmissionAnalysisResult;
  onChangeCourse: (courseId: string) => void;
}

export const AdmissionChanceView: React.FC<AdmissionChanceViewProps> = ({
  college,
  course,
  student,
  admissionAnalysis,
  onChangeCourse,
}) => {
  const {
    fitLevel,
    admissionProbability,
    effectiveCutoff,
    studentScoreOrRank,
    cutoffDifference,
    categoryAnalysisMessage,
    predictedCutoff,
    historicalAverage,
    competitionChangeDescription,
    isRankBased,
  } = admissionAnalysis;

  // Colors based on fitLevel
  const fitConfig = {
    'Strong Match': {
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/60',
      stroke: '#34d399',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      description: 'Your academic score/rank strongly meets or exceeds the estimated cutoff requirements.',
    },
    Competitive: {
      text: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/60',
      stroke: '#fbbf24',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'Your score/rank is in the active cutoff zone. Admission is feasible but subject to round-by-round counselling swings.',
    },
    Difficult: {
      text: 'text-orange-400',
      bg: 'bg-orange-950/40 border-orange-800/60',
      stroke: '#fb923c',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      description: 'Your score/rank is currently trailing the predicted cutoff. High competition makes seat allotment challenging.',
    },
    'Highly Competitive': {
      text: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/60',
      stroke: '#f87171',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      description: 'Considered a stretch / reach choice based on historic closing cutoffs. Strongly recommend targeting backup colleges.',
    },
  }[fitLevel];

  // Circular gauge calculations
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (admissionProbability / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Course Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="space-y-0.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
            Selected Course Specialization
          </span>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{course.name}</span>
            <span className="text-xs px-2 py-0.5 bg-slate-800 text-indigo-300 rounded font-normal">
              {course.degree} · {course.durationYears} Years
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Change Course:</label>
          <select
            value={course.id}
            onChange={(e) => onChangeCourse(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {college.courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Admission Chances Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Probability Circular Gauge & Fit Status */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-xl">
          <div className="w-full text-left flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
              Admission Chance Estimate
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${fitConfig.badge}`}>
              {fitLevel}
            </span>
          </div>

          {/* SVG Circular Gauge */}
          <div className="relative my-6 flex items-center justify-center">
            <svg
              className="w-44 h-44 transform -rotate-90"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={fitConfig.stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {admissionProbability}%
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                Est. Probability
              </span>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <p className="text-xs text-slate-300 leading-relaxed">
              {fitConfig.description}
            </p>
            <div className="text-[10px] text-amber-400/90 bg-amber-950/20 border border-amber-800/30 p-2 rounded-lg text-left flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Estimated analytical indicator only. Seat allotment depends on final JoSAA / State counselling seat matrices and applicant demand.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Metrics & Category-Aware Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category-Aware Analysis Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">
                  Category-Aware Cutoff Analysis ({student.category} Quota)
                </h4>
              </div>
              <span className="text-xs font-mono text-indigo-300">
                {college.counsellingBody}
              </span>
            </div>

            {/* Explanation Quote Box */}
            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-700/40 text-xs text-indigo-200 leading-relaxed">
              <span className="font-semibold block text-indigo-300 mb-1">
                Personalized Category Insight:
              </span>
              &ldquo;{categoryAnalysisMessage}&rdquo;
            </div>

            {/* Side-by-side Score/Rank breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Student Expected
                </span>
                <span className="text-base font-extrabold text-white">
                  {formatMetricValue(studentScoreOrRank, isRankBased ? 'rank' : 'score')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {isRankBased ? 'Expected Rank' : 'Exam Score'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  {student.category} Cutoff
                </span>
                <span className="text-base font-extrabold text-indigo-300">
                  {formatMetricValue(effectiveCutoff, isRankBased ? 'rank' : 'score')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Target threshold
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  General Cutoff
                </span>
                <span className="text-base font-extrabold text-slate-300">
                  {formatMetricValue(college.cutoffs.General, isRankBased ? 'rank' : 'score')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Open Category
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Cutoff Margin
                </span>
                <span
                  className={`text-base font-extrabold ${
                    cutoffDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {cutoffDifference >= 0 ? `+${cutoffDifference}` : cutoffDifference}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {cutoffDifference >= 0 ? 'Comfort Margin' : 'Deficit'}
                </span>
              </div>
            </div>

            {/* Comparison Visual Meter */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Academic Fit Spectrum</span>
                <span className="font-semibold text-slate-200">
                  {isRankBased ? 'Rank Comparison' : 'Cutoff Score Comparison'}
                </span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    admissionProbability >= 75
                      ? 'bg-emerald-500'
                      : admissionProbability >= 50
                      ? 'bg-amber-500'
                      : admissionProbability >= 25
                      ? 'bg-orange-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, admissionProbability))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Highly Competitive</span>
                <span>Competitive Zone</span>
                <span>Safe Admission</span>
              </div>
            </div>
          </div>

          {/* Historical vs Predicted Trajectory */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Multi-Year Closing Cutoff Movement</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Historical Average</span>
                <span className="text-base font-bold text-white font-mono mt-0.5 block">
                  {formatMetricValue(historicalAverage, isRankBased ? 'rank' : 'score')}
                </span>
                <span className="text-[10px] text-slate-400">Past 4 counselling cycles</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Current Projected Cutoff</span>
                <span className="text-base font-bold text-indigo-300 font-mono mt-0.5 block">
                  {formatMetricValue(predictedCutoff, isRankBased ? 'rank' : 'score')}
                </span>
                <span className="text-[10px] text-slate-400">Cycle {student.targetAdmissionYear}</span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Competition Trend</span>
                <span className="text-base font-bold text-white mt-0.5 block truncate">
                  {college.volatility}
                </span>
                <span className="text-[10px] text-slate-400">Demand Level: {course.demandLevel}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
              📌 {competitionChangeDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
