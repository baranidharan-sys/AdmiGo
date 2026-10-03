import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Target,
  Flame,
  IndianRupee,
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { College, PortfolioTier, StudentProfile } from '../types';
import {
  analyzeAdmissionChance,
  categorizePortfolioTier,
  formatINR,
  formatLakh,
} from '../utils/calculations';

interface PortfolioBuilderViewProps {
  colleges: College[];
  student: StudentProfile;
  activeCollege: College;
  onSelectActiveCollege: (college: College) => void;
  onUpdateApplicationBudget: (newBudget: number) => void;
}

export const PortfolioBuilderView: React.FC<PortfolioBuilderViewProps> = ({
  colleges,
  student,
  activeCollege,
  onSelectActiveCollege,
  onUpdateApplicationBudget,
}) => {
  // Saved colleges in portfolio
  const [portfolioCollegeIds, setPortfolioCollegeIds] = useState<string[]>([
    'iit-madras',
    'nit-trichy',
    'anna-university',
    'psg-tech',
    'vit-vellore',
  ]);

  const [customBudgetInput, setCustomBudgetInput] = useState<number>(
    student.applicationBudget
  );

  const portfolioColleges = portfolioCollegeIds
    .map((id) => colleges.find((c) => c.id === id))
    .filter(Boolean) as College[];

  // Auto-categorize each college into Dream, Target, Safer based on admission analysis
  const categorized = portfolioColleges.map((col) => {
    const analysis = analyzeAdmissionChance(student, col);
    const tier: PortfolioTier = categorizePortfolioTier(analysis.admissionProbability);
    return {
      college: col,
      analysis,
      tier,
    };
  });

  const dreamColleges = categorized.filter((c) => c.tier === 'Dream');
  const targetColleges = categorized.filter((c) => c.tier === 'Target');
  const saferColleges = categorized.filter((c) => c.tier === 'Safer');

  // Total application cost calculation
  const totalApplicationCost = portfolioColleges.reduce(
    (acc, col) => acc + col.applicationFee,
    0
  );

  const budgetGap = student.applicationBudget - totalApplicationCost;
  const isBudgetExceeded = budgetGap < 0;

  const handleRemoveFromPortfolio = (collegeId: string) => {
    setPortfolioCollegeIds(portfolioCollegeIds.filter((id) => id !== collegeId));
  };

  const handleAddCollegeToPortfolio = (collegeId: string) => {
    if (!portfolioCollegeIds.includes(collegeId)) {
      setPortfolioCollegeIds([...portfolioCollegeIds, collegeId]);
    }
  };

  const availableToAdd = colleges.filter(
    (c) => !portfolioCollegeIds.includes(c.id)
  );

  return (
    <div className="space-y-6">
      {/* Header and Application Budget Optimizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Admission Portfolio & Application Budget
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Balanced Dream, Target, and Safer college planning with real-time counselling application budget tracking.
            </p>
          </div>

          {/* Quick add college selector */}
          {availableToAdd.length > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddCollegeToPortfolio(e.target.value);
                  e.target.value = '';
                }
              }}
              defaultValue=""
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="" disabled>
                + Add College to Portfolio
              </option>
              {availableToAdd.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.shortName} ({formatINR(col.applicationFee)})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Application Budget Optimizer Bar */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Application / Counselling Budget Optimizer
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tracks total entrance exam registration fees and counselling portal charges.
              </p>
            </div>

            {/* Adjustable Application Budget input */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 whitespace-nowrap">
                Your Application Budget:
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  min="500"
                  max="50000"
                  value={customBudgetInput}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setCustomBudgetInput(val);
                    onUpdateApplicationBudget(val);
                  }}
                  className="w-28 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Itemized application costs pills */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Itemized Application Expenses:</span>
              <span className="text-slate-300 font-bold">
                {portfolioColleges.length} colleges selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {portfolioColleges.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200"
                >
                  <span className="font-medium">{col.shortName}</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    {formatINR(col.applicationFee)}
                  </span>
                  <button
                    onClick={() => handleRemoveFromPortfolio(col.id)}
                    className="text-slate-500 hover:text-rose-400"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Status Message */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              isBudgetExceeded
                ? 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isBudgetExceeded ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>
                {isBudgetExceeded
                  ? `Selected applications exceed your stated application budget by ${formatINR(
                      Math.abs(budgetGap)
                    )}.`
                  : `Total application fees are within budget. You have ${formatINR(
                      budgetGap
                    )} remaining buffer.`}
              </span>
            </div>

            <div className="text-right shrink-0 font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">
                Total Application Outlay
              </span>
              <span className="font-bold text-sm text-white">
                {formatINR(totalApplicationCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Columns: Dream / Target / Safer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Dream Colleges (Reach) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white">Dream Colleges</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/60 text-rose-300 font-bold">
              {dreamColleges.length}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Highly competitive choices where closing cutoffs are very demanding. Great to retain in top choice filling.
          </p>

          <div className="space-y-3">
            {dreamColleges.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                No colleges categorized as Dream
              </div>
            ) : (
              dreamColleges.map(({ college: col, analysis }) => (
                <div
                  key={col.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug">
                        {col.shortName}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {col.courses[0].name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {analysis.admissionProbability}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                    <span>Cutoff: #{analysis.effectiveCutoff}</span>
                    <span>Tuition: {formatLakh(col.baseTuition)}/yr</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectActiveCollege(col)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Analyze College →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. Target Colleges (Solid Matches) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Target Colleges</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 font-bold">
              {targetColleges.length}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Institutions where your expected rank or score is close to the predicted cutoff. High probability zone.
          </p>

          <div className="space-y-3">
            {targetColleges.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                No colleges categorized as Target
              </div>
            ) : (
              targetColleges.map(({ college: col, analysis }) => (
                <div
                  key={col.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug">
                        {col.shortName}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {col.courses[0].name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {analysis.admissionProbability}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                    <span>Cutoff: #{analysis.effectiveCutoff}</span>
                    <span>Tuition: {formatLakh(col.baseTuition)}/yr</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectActiveCollege(col)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Analyze College →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. Safer Options (Comfortable Margin) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Safer Options</h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-bold">
              {saferColleges.length}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Colleges with a larger academic buffer. Vital safeguards to prevent missing out in final counselling rounds.
          </p>

          <div className="space-y-3">
            {saferColleges.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                No colleges categorized as Safer
              </div>
            ) : (
              saferColleges.map(({ college: col, analysis }) => (
                <div
                  key={col.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs leading-snug">
                        {col.shortName}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        {col.courses[0].name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {analysis.admissionProbability}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                    <span>Cutoff: #{analysis.effectiveCutoff}</span>
                    <span>Tuition: {formatLakh(col.baseTuition)}/yr</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectActiveCollege(col)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Analyze College →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
