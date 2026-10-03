import React, { useState } from 'react';
import {
  Scale,
  Plus,
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Percent,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { College, StudentProfile } from '../types';
import {
  analyzeAdmissionChance,
  calculateFinancialAnalysis,
  formatINR,
  formatLakh,
  formatMetricValue,
} from '../utils/calculations';

interface CollegeComparisonViewProps {
  colleges: College[];
  student: StudentProfile;
  activeCollege: College;
  onSelectActiveCollege: (college: College) => void;
}

export const CollegeComparisonView: React.FC<CollegeComparisonViewProps> = ({
  colleges,
  student,
  activeCollege,
  onSelectActiveCollege,
}) => {
  // Allow up to 4 colleges to be compared
  const [selectedCollegeIds, setSelectedCollegeIds] = useState<string[]>([
    activeCollege.id,
    'nit-trichy',
    'anna-university',
    'vit-vellore',
  ]);

  // Interactive student affordable fee state (initialized from profile budget)
  const [affordableFee, setAffordableFee] = useState<number>(
    student.annualEducationBudget || 200000
  );

  const [filterMode, setFilterMode] = useState<'all' | 'affordable-only'>('all');
  const [addCollegeDropdownOpen, setAddCollegeDropdownOpen] = useState(false);

  const selectedColleges = selectedCollegeIds
    .map((id) => colleges.find((c) => c.id === id))
    .filter(Boolean) as College[];

  const availableToAdd = colleges.filter(
    (c) => !selectedCollegeIds.includes(c.id)
  );

  const handleAddCollege = (collegeId: string) => {
    if (selectedCollegeIds.length < 4) {
      setSelectedCollegeIds([...selectedCollegeIds, collegeId]);
    }
    setAddCollegeDropdownOpen(false);
  };

  const handleRemoveCollege = (collegeId: string) => {
    if (selectedCollegeIds.length > 1) {
      setSelectedCollegeIds(selectedCollegeIds.filter((id) => id !== collegeId));
    }
  };

  // Pre-calculate financial diagnostic per college against the student's affordable fee
  const collegeFinanceMetrics = selectedColleges.map((col) => {
    const fin = calculateFinancialAnalysis(
      { ...student, annualEducationBudget: affordableFee },
      col
    );
    const gap = affordableFee - fin.netAnnualCost;
    const isAffordable = gap >= 0;
    const coveragePercent = fin.netAnnualCost > 0
      ? Math.round((affordableFee / fin.netAnnualCost) * 100)
      : 100;
    const total4YrLoanNeeded = Math.max(0, (fin.netAnnualCost - affordableFee) * 4);

    return {
      college: col,
      fin,
      gap,
      isAffordable,
      coveragePercent,
      total4YrLoanNeeded,
    };
  });

  const affordableCollegesCount = collegeFinanceMetrics.filter((m) => m.isAffordable).length;

  return (
    <div className="space-y-6">
      {/* Header bar with Affordable Fee Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Scale className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Compare Colleges by Student Affordable Fee
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Evaluate how comfortably your annual education budget covers the tuition, hostel, and 4-year commitments across Indian colleges.
            </p>
          </div>

          {/* Add College dropdown */}
          {selectedCollegeIds.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setAddCollegeDropdownOpen(!addCollegeDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add College to Compare ({selectedCollegeIds.length}/4)</span>
              </button>

              {addCollegeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-30 max-h-64 overflow-y-auto p-1.5 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-slate-500">
                    Select a college:
                  </div>
                  {availableToAdd.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleAddCollege(col.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800 text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium truncate">{col.shortName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatLakh(col.baseTuition)}/yr
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            STUDENT AFFORDABLE FEE INTERACTIVE CONTROLLER
            ======================================================== */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-900/40 shadow-inner space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Your Affordable Annual Education Fee / Budget:
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust this budget slider to immediately see which colleges you can afford without financial strain.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {formatLakh(affordableFee)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ year</span>
            </div>
          </div>

          {/* Slider & Number Input */}
          <div className="space-y-2">
            <input
              type="range"
              min="30000"
              max="500000"
              step="10000"
              value={affordableFee}
              onChange={(e) => setAffordableFee(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹30,000 (Low / Govt Subsidized)</span>
              <span>₹1.5 Lakhs (Medium)</span>
              <span>₹3 Lakhs (NIT / Tier-1)</span>
              <span>₹5 Lakhs (Private / Deemed)</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Quick Presets:</span>
            {[60000, 100000, 150000, 200000, 250000, 350000].map((preset) => (
              <button
                key={preset}
                onClick={() => setAffordableFee(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  affordableFee === preset
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800'
                }`}
              >
                {formatLakh(preset)}
              </button>
            ))}
          </div>

          {/* Fast Summary Badge */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                At an affordable fee of <strong>{formatLakh(affordableFee)}/year</strong>,{' '}
                <strong className="text-white">{affordableCollegesCount} of {selectedColleges.length}</strong>{' '}
                compared colleges are comfortably within your budget without needing external loans.
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setFilterMode(filterMode === 'all' ? 'affordable-only' : 'all')}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  filterMode === 'affordable-only'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {filterMode === 'affordable-only' ? 'Showing: Affordable Only' : 'Show All Colleges'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="py-4 px-4 font-mono uppercase text-slate-400 text-[11px] w-52 sticky left-0 bg-slate-950 z-10">
                  Affordability Metric
                </th>
                {selectedColleges.map((col) => {
                  const isActive = activeCollege.id === col.id;
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  const isAffordable = finData?.isAffordable;

                  return (
                    <th
                      key={col.id}
                      className={`py-4 px-4 min-w-[230px] max-w-[270px] align-top ${
                        isActive ? 'bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-indigo-400 block uppercase">
                            {col.type} · {col.state}
                          </span>
                          <h4 className="font-bold text-sm text-white leading-snug">
                            {col.shortName}
                          </h4>
                        </div>
                        {selectedCollegeIds.length > 1 && (
                          <button
                            onClick={() => handleRemoveCollege(col.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Affordability Badge right on header */}
                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isAffordable
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {isAffordable ? '✓ Affordable' : '⚠ Exceeds Budget'}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectActiveCollege(col)}
                        className={`mt-2.5 w-full py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                          isActive
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        {isActive ? 'Active College' : 'Make Active'}
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {/* PRIMARY ROW 1: Student Affordable Fee */}
              <tr className="bg-emerald-950/20 hover:bg-emerald-950/30">
                <td className="py-3.5 px-4 font-bold text-emerald-300 sticky left-0 bg-slate-950 z-10">
                  Your Affordable Fee
                </td>
                {selectedColleges.map((col) => (
                  <td key={col.id} className="py-3.5 px-4 font-mono font-extrabold text-emerald-400 text-sm">
                    {formatINR(affordableFee)}/yr
                  </td>
                ))}
              </tr>

              {/* PRIMARY ROW 2: College Net Annual Cost */}
              <tr className="bg-slate-950/60 hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-bold text-white sticky left-0 bg-slate-950 z-10">
                  College Net Annual Cost
                </td>
                {selectedColleges.map((col) => {
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  return (
                    <td key={col.id} className="py-3.5 px-4 font-mono font-extrabold text-white text-sm">
                      {formatINR(finData?.fin.netAnnualCost || 0)}/yr
                    </td>
                  );
                })}
              </tr>

              {/* PRIMARY ROW 3: Annual Budget Gap (Surplus vs Deficit) */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-bold text-indigo-300 sticky left-0 bg-slate-900 z-10">
                  Annual Budget Gap
                </td>
                {selectedColleges.map((col) => {
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  const isAffordable = finData?.isAffordable;
                  const gap = finData?.gap || 0;
                  return (
                    <td key={col.id} className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {isAffordable ? (
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-400" />
                        )}
                        <span
                          className={`font-mono font-extrabold text-sm ${
                            isAffordable ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isAffordable ? `+${formatINR(gap)}` : `-${formatINR(Math.abs(gap))}`}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                        {isAffordable ? 'Annual Savings' : 'Deficit / Loan Needed'}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* PRIMARY ROW 4: Budget Coverage Progress Bar */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Budget Coverage Ratio
                </td>
                {selectedColleges.map((col) => {
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  const coverage = finData?.coveragePercent || 0;
                  return (
                    <td key={col.id} className="py-3 px-4 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono font-bold">
                        <span className={coverage >= 100 ? 'text-emerald-400' : 'text-amber-400'}>
                          {coverage}% Covered
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            coverage >= 100
                              ? 'bg-emerald-500'
                              : coverage >= 70
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, coverage)}%` }}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* PRIMARY ROW 5: 4-Year Loan Requirement */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  4-Year Loan Requirement
                </td>
                {selectedColleges.map((col) => {
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  const loan = finData?.total4YrLoanNeeded || 0;
                  return (
                    <td key={col.id} className="py-3 px-4 font-mono">
                      {loan === 0 ? (
                        <span className="text-emerald-400 font-bold">₹0 (Zero Debt)</span>
                      ) : (
                        <span className="text-rose-400 font-bold">
                          {formatLakh(loan)}
                          <span className="text-[10px] text-slate-400 block font-sans font-normal">
                            EMI: ~{formatINR(Math.round((loan * 0.012)))}/mo
                          </span>
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Course */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Primary Course
                </td>
                {selectedColleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 font-medium text-white">
                    {col.courses[0].name}
                  </td>
                ))}
              </tr>

              {/* Row: Entrance Exam */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Entrance Exam
                </td>
                {selectedColleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 font-mono text-slate-200">
                    {col.entranceExam}
                  </td>
                ))}
              </tr>

              {/* Row: Expected Cutoff */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Expected Cutoff ({student.category})
                </td>
                {selectedColleges.map((col) => {
                  const cutoff = col.cutoffs[student.category] ?? col.cutoffs.General;
                  return (
                    <td key={col.id} className="py-3 px-4 font-mono font-bold text-indigo-300">
                      {col.cutoffType === 'rank' ? 'Rank ' : 'Score '}
                      {formatMetricValue(cutoff, col.cutoffType)}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Admission Indicator */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Admission Indicator
                </td>
                {selectedColleges.map((col) => {
                  const analysis = analyzeAdmissionChance(student, col);
                  return (
                    <td key={col.id} className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            analysis.fitLevel === 'Strong Match'
                              ? 'bg-emerald-400'
                              : analysis.fitLevel === 'Competitive'
                              ? 'bg-amber-400'
                              : analysis.fitLevel === 'Difficult'
                              ? 'bg-orange-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        <span className="font-bold text-white">
                          {analysis.admissionProbability}%
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({analysis.fitLevel})
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Base Tuition */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Base Tuition / Year
                </td>
                {selectedColleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 font-mono text-white">
                    {formatINR(col.baseTuition)}
                  </td>
                ))}
              </tr>

              {/* Row: Hostel Fee */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Hostel & Mess
                </td>
                {selectedColleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 font-mono text-slate-300">
                    {student.hostelRequired ? formatINR(col.hostelFee) : '₹0 (Day Scholar)'}
                  </td>
                ))}
              </tr>

              {/* Row: Scholarship Relief */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Scholarship Offset
                </td>
                {selectedColleges.map((col) => {
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  return (
                    <td key={col.id} className="py-3 px-4 font-mono text-indigo-300">
                      -{formatINR(finData?.fin.totalEstimatedScholarship || 0)}
                    </td>
                  );
                })}
              </tr>

              {/* Row: 4-Year Projected Commitment */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  4-Year Total Commitment
                </td>
                {selectedColleges.map((col) => {
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  return (
                    <td key={col.id} className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {formatLakh(finData?.fin.fourYearTotal || 0)}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Financial Fit Score */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Financial Fit Score
                </td>
                {selectedColleges.map((col) => {
                  const finData = collegeFinanceMetrics.find((m) => m.college.id === col.id);
                  return (
                    <td key={col.id} className="py-3 px-4">
                      <span className="font-bold text-white font-mono">
                        {finData?.fin.affordabilityScore}/100
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {finData?.fin.affordabilityLabel}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Cutoff Volatility */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Cutoff Volatility
                </td>
                {selectedColleges.map((col) => (
                  <td key={col.id} className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        col.volatility === 'Stable'
                          ? 'bg-emerald-950/60 text-emerald-300'
                          : col.volatility === 'Moderate Volatility'
                          ? 'bg-amber-950/60 text-amber-300'
                          : 'bg-rose-950/60 text-rose-300'
                      }`}
                    >
                      {col.volatility}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row: Application Fee */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-4 font-semibold text-slate-400 sticky left-0 bg-slate-900 z-10">
                  Application / Exam Fee
                </td>
                {selectedColleges.map((col) => (
                  <td key={col.id} className="py-3 px-4 font-mono text-slate-300">
                    {formatINR(col.applicationFee)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
