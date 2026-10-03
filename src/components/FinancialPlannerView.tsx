import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Info,
  Gift,
  HelpCircle,
  AlertCircle,
  Percent,
  Sliders,
  DollarSign,
  PieChart as PieIcon,
  ShieldAlert,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { College, CourseOption, FinancialAnalysisResult, StudentProfile } from '../types';
import { formatINR, formatLakh } from '../utils/calculations';

interface FinancialPlannerViewProps {
  college: College;
  course?: CourseOption;
  student: StudentProfile;
  financialAnalysis: FinancialAnalysisResult;
  inflationRate: number;
  onInflationChange: (newRate: number) => void;
  onChangeCourse?: (courseId: string) => void;
}

export const FinancialPlannerView: React.FC<FinancialPlannerViewProps> = ({
  college,
  course,
  student,
  financialAnalysis,
  inflationRate,
  onInflationChange,
  onChangeCourse,
}) => {
  const [showFormulaTooltip, setShowFormulaTooltip] = useState(false);
  const [showScholarshipNote, setShowScholarshipNote] = useState(false);

  const {
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
    affordabilityBreakdown,
  } = financialAnalysis;

  // Chart data preparation
  const chartData = projections.map((p) => ({
    name: p.label,
    YearlyCost: p.netCost,
    Tuition: p.tuition,
    Hostel: p.hostel,
    Living: p.living,
    Scholarship: p.scholarship,
    AnnualBudget: p.budget,
  }));

  const customTooltipFormatter = (value: any, name: any) => {
    return [formatINR(Number(value)), name];
  };

  return (
    <div className="space-y-6">
      {/* Top Equation Bar: Tuition + Hostel + Living - Scholarship = Net Cost */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Annual Cost Breakdown (Indian Rupees ₹)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {course && (
              <div className="flex items-center gap-2 p-1 pl-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Course:</span>
                {onChangeCourse && college.courses.length > 1 ? (
                  <select
                    value={course.id}
                    onChange={(e) => onChangeCourse(e.target.value)}
                    className="bg-transparent text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer pr-1"
                  >
                    {college.courses.map((c) => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.name} — {formatINR(college.baseTuition + c.tuitionOffset)}/yr
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs font-bold text-indigo-300">{course.name}</span>
                )}
              </div>
            )}

            <span className="text-xs text-slate-400">
              {student.hostelRequired ? 'Hosteler Profile' : 'Day Scholar Profile'}
            </span>
          </div>
        </div>

        {/* The Equation Visual Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
          {/* Tuition */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl relative">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              1. Course Tuition ({course?.degree || 'Annual'})
            </span>
            <span className="text-lg font-extrabold text-white mt-0.5 block">
              {formatINR(tuition)}
            </span>
            <span className="text-[10px] text-slate-400 truncate block">
              {course?.name || 'Academic fee / yr'}
            </span>
          </div>

          {/* Hostel & Mess */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl relative">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              2. Hostel & Mess
            </span>
            <span className="text-lg font-extrabold text-white mt-0.5 block">
              {formatINR(hostel)}
            </span>
            <span className="text-[10px] text-slate-400">
              {student.hostelRequired ? 'Campus accommodation' : 'Not opted (₹0)'}
            </span>
          </div>

          {/* Living Expenses */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl relative">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">
              3. Living & Books
            </span>
            <span className="text-lg font-extrabold text-white mt-0.5 block">
              {formatINR(living)}
            </span>
            <span className="text-[10px] text-slate-400">Books & transport</span>
          </div>

          {/* Total Estimated Scholarship */}
          <div className="p-3 bg-indigo-950/30 border border-indigo-700/50 rounded-xl relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-indigo-300 block">
                4. Est. Scholarship
              </span>
              <Gift className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-lg font-extrabold text-indigo-300 mt-0.5 block">
              -{formatINR(totalEstimatedScholarship)}
            </span>
            <span className="text-[10px] text-indigo-300/80">Fee offset</span>
          </div>

          {/* Net Annual Cost Result */}
          <div className="p-3 bg-slate-950 border border-indigo-500/50 rounded-xl shadow-lg shadow-indigo-950/50 col-span-2 md:col-span-1">
            <span className="text-[10px] uppercase font-mono text-indigo-400 block font-bold">
              = Net Annual Cost
            </span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">
              {formatINR(netAnnualCost)}
            </span>
            <span className="text-[10px] text-slate-400">Total out-of-pocket / yr</span>
          </div>
        </div>

        {/* Family Budget vs College Net Cost comparison */}
        <div className="pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                Family Annual Education Budget
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-white">
                  {formatINR(annualBudget)}
                </span>
                <span className="text-xs text-slate-400">per academic year</span>
              </div>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                Annual Gap ({isDeficit ? 'Deficit' : 'Surplus'})
              </span>
              <div className="flex items-baseline sm:justify-end gap-2">
                <span
                  className={`text-xl font-extrabold ${
                    isDeficit ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {isDeficit
                    ? `-${formatINR(Math.abs(annualBudgetGap))}`
                    : `+${formatINR(Math.abs(annualBudgetGap))}`}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  {isDeficit ? 'Requires loan / aid' : 'Well within budget'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarship Pipeline Analysis Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              Scholarship Impact & Fee Concession Model
            </h3>
          </div>
          <button
            onClick={() => setShowScholarshipNote(!showScholarshipNote)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Demonstration Model Note</span>
          </button>
        </div>

        {showScholarshipNote && (
          <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Important Tooltip:</strong> Scholarship estimates are based on the application&apos;s demonstration model and should not be treated as an official scholarship offer. Final waivers depend on actual JoSAA / Central Sector / State e-District portal verifications.
            </span>
          </div>
        )}

        {/* Pipeline Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              1. Base Scholarship
            </span>
            <span className="text-base font-extrabold text-white">
              {formatINR(baseScholarship)}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              General institutional merit assistance
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              2. Merit Adjustment
            </span>
            <span className="text-base font-extrabold text-indigo-300">
              +{formatINR(meritAdjustment)}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              {student.class12Percent >= 90
                ? `Academic booster (Class 12: ${student.class12Percent}%)`
                : 'Eligible for score-based incentives'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              3. Income / Category Waiver
            </span>
            <span className="text-base font-extrabold text-indigo-300">
              +{formatINR(incomeWaiver)}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              {college.type === 'Government' || college.type === 'NIT' || college.type === 'IIT'
                ? student.category === 'SC' || student.category === 'ST'
                  ? 'SC/ST Central 100% Tuition Waiver'
                  : student.annualFamilyIncome < 100000
                  ? 'EWS <₹1L Full Tuition Waiver'
                  : student.annualFamilyIncome <= 500000
                  ? 'Income ₹1-5L 2/3rd Tuition Waiver'
                  : 'Standard category fee'
                : 'State / Institutional fee norms'}
            </p>
          </div>

          <div className="p-3.5 bg-indigo-950/40 border border-indigo-600/60 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-indigo-300 block mb-0.5 font-bold">
              Total Estimated Relief
            </span>
            <span className="text-lg font-extrabold text-white">
              {formatINR(totalEstimatedScholarship)}
            </span>
            <p className="text-[10px] text-indigo-200 mt-1">
              Final Net Annual: {formatINR(netAnnualCost)}
            </p>
          </div>
        </div>
      </div>

      {/* 4-Year Cost Projection & Inflation Adjuster */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>4-Year Cost Projection with Indian Education Inflation</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Formula: Projected Tuition = Base Tuition × (1 + Inflation Rate) ^ Years
            </p>
          </div>

          {/* Interactive Inflation Slider */}
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 min-w-[240px]">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400 font-medium">Inflation Rate:</span>
              <span className="font-mono font-bold text-indigo-400 text-sm">
                {(inflationRate * 100).toFixed(1)}% / yr
              </span>
            </div>
            <input
              type="range"
              min="0.03"
              max="0.15"
              step="0.005"
              value={inflationRate}
              onChange={(e) => onInflationChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>3% (Low)</span>
              <span>7.5% (Default)</span>
              <span>15% (High)</span>
            </div>
          </div>
        </div>

        {/* Visual Chart with Recharts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Yearly Net Cost vs. Annual Budget Threshold</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
                Net Education Cost
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-400 border-t border-dashed inline-block" />
                Your Budget ({formatINR(annualBudget)})
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  formatter={customTooltipFormatter}
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <ReferenceLine
                  y={annualBudget}
                  stroke="#34d399"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Annual Budget',
                    fill: '#34d399',
                    position: 'top',
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="YearlyCost"
                  name="Net Yearly Cost"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#costGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4-Year Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3 text-right">Tuition</th>
                <th className="py-2.5 px-3 text-right">Hostel & Mess</th>
                <th className="py-2.5 px-3 text-right">Living Exp.</th>
                <th className="py-2.5 px-3 text-right">Scholarship</th>
                <th className="py-2.5 px-3 text-right text-indigo-300 font-bold">Net Cost</th>
                <th className="py-2.5 px-3 text-right text-slate-300">Cumulative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {projections.map((p) => (
                <tr key={p.year} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white font-sans">{p.label}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{formatINR(p.tuition)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{formatINR(p.hostel)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{formatINR(p.living)}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-300">-{formatINR(p.scholarship)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-white font-sans">
                    {formatINR(p.netCost)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-300 font-sans">
                    {formatINR(p.cumulativeCost)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-800 text-sm font-bold bg-slate-950/60">
                <td className="py-3 px-3 text-white font-sans">4-Year Total Commitment</td>
                <td colSpan={4} />
                <td className="py-3 px-3 text-right text-indigo-300 font-mono">
                  {formatINR(fourYearTotal)}
                </td>
                <td className="py-3 px-3 text-right text-emerald-400 font-mono">
                  {formatLakh(fourYearTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* College Affordability Score Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              College Affordability & Financial Fit Score
            </h3>
          </div>
          <button
            onClick={() => setShowFormulaTooltip(!showFormulaTooltip)}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How is this calculated?</span>
          </button>
        </div>

        {showFormulaTooltip && (
          <div className="p-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-300 space-y-1.5">
            <p className="font-semibold text-white">Affordability Score Formula Breakdown (0 - 100):</p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>
                <strong>Budget Match (50% weight):</strong> Evaluates whether your stated annual budget covers the net annual fee.
              </li>
              <li>
                <strong>Family Income Feasibility (30% weight):</strong> Compares annual college cost as a fraction of total annual household income.
              </li>
              <li>
                <strong>Scholarship Leverage (20% weight):</strong> Rewards institutional and government fee concessions reducing debt pressure.
              </li>
            </ul>
            <p className="text-[11px] text-amber-400/90 pt-1">
              Note: This score is an analytical indicator and does not represent an official financial rating.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Big Score Badge */}
          <div className="sm:col-span-4 p-5 bg-slate-950 rounded-xl border border-slate-800 text-center">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Financial Fit Score
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold text-white">
                {affordabilityScore}
              </span>
              <span className="text-slate-500 font-bold text-xl">/ 100</span>
            </div>
            <div className="mt-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  affordabilityScore >= 75
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80'
                    : affordabilityScore >= 50
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
                    : 'bg-rose-950/60 text-rose-300 border border-rose-800/80'
                }`}
              >
                {affordabilityLabel}
              </span>
            </div>
          </div>

          {/* Component bars */}
          <div className="sm:col-span-8 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Budget Coverage Ratio</span>
                <span className="font-mono font-bold text-indigo-300">
                  {affordabilityBreakdown.budgetMatchScore} / 50 pts
                </span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(affordabilityBreakdown.budgetMatchScore / 50) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Family Income Feasibility</span>
                <span className="font-mono font-bold text-indigo-300">
                  {affordabilityBreakdown.incomeFeasibilityScore} / 30 pts
                </span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${(affordabilityBreakdown.incomeFeasibilityScore / 30) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Scholarship & Fee Relief Impact</span>
                <span className="font-mono font-bold text-indigo-300">
                  {affordabilityBreakdown.scholarshipImpactScore} / 20 pts
                </span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(affordabilityBreakdown.scholarshipImpactScore / 20) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
