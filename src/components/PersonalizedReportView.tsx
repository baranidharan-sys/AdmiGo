import React, { useState } from 'react';
import {
  FileText,
  GraduationCap,
  BarChart3,
  IndianRupee,
  TrendingUp,
  Gift,
  AlertTriangle,
  Lightbulb,
  Printer,
  Download,
  Loader2,
  CheckCircle2,
  Calendar,
  Building2,
  MapPin,
  ShieldAlert,
} from 'lucide-react';
import {
  AdmissionAnalysisResult,
  College,
  CourseOption,
  FinancialAnalysisResult,
  StudentProfile,
} from '../types';
import { formatINR, formatLakh, formatMetricValue } from '../utils/calculations';
import { generateReportPdf } from '../utils/pdfGenerator';

interface PersonalizedReportViewProps {
  college: College;
  course: CourseOption;
  student: StudentProfile;
  admissionAnalysis: AdmissionAnalysisResult;
  financialAnalysis: FinancialAnalysisResult;
  inflationRate: number;
}

export const PersonalizedReportView: React.FC<PersonalizedReportViewProps> = ({
  college,
  course,
  student,
  admissionAnalysis,
  financialAnalysis,
  inflationRate,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const isRankBased = college.cutoffType === 'rank';
  const fourYearInflationIncrease =
    financialAnalysis.fourYearTotal -
    financialAnalysis.netAnnualCost * course.durationYears;

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const reportId = `ADG-${college.shortName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4)}-${student.targetAdmissionYear}`;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      setDownloadSuccess(false);

      const filename = `AdmiGo_${college.shortName.replace(/\s+/g, '_')}_Report.pdf`;
      await generateReportPdf({
        elementId: 'printable-admigo-report',
        filename,
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // Fallback: trigger print dialog if canvas generation encounters an issue
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Interactive Report Header Card with Download & Print Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Your AdmiGo Report
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Personalized Indian Admission & Financial Diagnostic for {college.name}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Print via browser dialog"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Clean PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Report (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Student & College Metadata Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Candidate</span>
            <span className="font-semibold text-white truncate block">
              {student.name || 'Indian Applicant'}
            </span>
            <span className="text-[10px] text-indigo-400">
              {student.category} · {student.state}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Target Program</span>
            <span className="font-semibold text-white truncate block">{course.name}</span>
            <span className="text-[10px] text-slate-400">{college.shortName}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Entrance Exam</span>
            <span className="font-semibold text-white truncate block">{college.entranceExam}</span>
            <span className="text-[10px] text-slate-400">Target Year: {student.targetAdmissionYear}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Counselling Body</span>
            <span className="font-semibold text-white truncate block">{college.counsellingBody}</span>
            <span className="text-[10px] text-slate-400">{college.type} Institute</span>
          </div>
        </div>
      </div>

      {/* On-screen Dark Mode Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        {/* 1. Admission Analysis */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold border-b border-slate-800 pb-2">
            <GraduationCap className="w-4 h-4" />
            <span>🎓 Admission Indicator</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">
                {admissionAnalysis.admissionProbability}%
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                {admissionAnalysis.fitLevel}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Estimated admission probability is calculated by comparing your expected merit profile against the demo closing cutoff of {college.shortName}.
            </p>
          </div>
        </div>

        {/* 2. Academic Fit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold border-b border-slate-800 pb-2">
            <BarChart3 className="w-4 h-4" />
            <span>📊 Academic Fit</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Student Expected Metric:</span>
              <span className="font-mono font-bold text-white">
                {formatMetricValue(admissionAnalysis.studentScoreOrRank, isRankBased ? 'rank' : 'score')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Target Cutoff ({student.category}):</span>
              <span className="font-mono font-bold text-indigo-300">
                {formatMetricValue(admissionAnalysis.effectiveCutoff, isRankBased ? 'rank' : 'score')}
              </span>
            </div>
            <p className="text-xs text-slate-300 pt-1">
              {admissionAnalysis.categoryAnalysisMessage}
            </p>
          </div>
        </div>

        {/* 3. Financial Fit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold border-b border-slate-800 pb-2">
            <IndianRupee className="w-4 h-4" />
            <span>💰 Financial Fit</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Estimated Annual Net Cost:</span>
              <span className="font-mono font-bold text-white">
                {formatLakh(financialAnalysis.netAnnualCost)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Your Annual Education Budget:</span>
              <span className="font-mono font-bold text-emerald-400">
                {formatLakh(financialAnalysis.annualBudget)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Annual Gap:</span>
              <span
                className={`font-mono font-bold ${
                  financialAnalysis.isDeficit ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {financialAnalysis.isDeficit ? '-' : '+'}
                {formatINR(Math.abs(financialAnalysis.annualBudgetGap))} (
                {financialAnalysis.isDeficit ? 'Deficit' : 'Surplus'})
              </span>
            </div>
          </div>
        </div>

        {/* 4. Inflation & 4-Year Risk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold border-b border-slate-800 pb-2">
            <TrendingUp className="w-4 h-4" />
            <span>📈 Inflation & Cumulative Outlay</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">4-Year Total Projected Cost:</span>
              <span className="font-mono font-bold text-white">
                {formatLakh(financialAnalysis.fourYearTotal)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Inflation Rate Applied:</span>
              <span className="font-mono font-bold text-indigo-300">
                {(inflationRate * 100).toFixed(1)}% / yr
              </span>
            </div>
            <p className="text-xs text-slate-300 pt-1">
              Education inflation accumulates an estimated additional {formatINR(fourYearInflationIncrease)} over the 4-year undergraduate cycle.
            </p>
          </div>
        </div>
      </div>

      {/* Scholarship Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 no-print">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold border-b border-slate-800 pb-2">
          <Gift className="w-4 h-4" />
          <span>🎁 Scholarship Impact</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Base Scholarship</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {formatINR(financialAnalysis.baseScholarship)}/yr
            </span>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Income & Category Waiver</span>
            <span className="text-sm font-bold text-indigo-300 mt-0.5 block">
              +{formatINR(financialAnalysis.incomeWaiver)}/yr
            </span>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block text-[11px]">Total Estimated Relief</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
              {formatINR(financialAnalysis.totalEstimatedScholarship)}/yr
            </span>
          </div>
        </div>
      </div>

      {/* Key Risks & What You Should Consider (On-Screen) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        {/* Key Risks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold border-b border-slate-800 pb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>⚠️ Key Risks to Monitor</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>
                <strong>Cutoff Volatility:</strong> {college.shortName} closing cutoffs have a volatility status of &ldquo;{college.volatility}&rdquo;. Round 1 vs spot round cutoffs often shift.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>
                <strong>Tuition Inflation:</strong> Institutional fee revisions and mess charge hikes typically compound at 6% to 9% annually.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>
                <strong>Scholarship Renewal Uncertainty:</strong> Most state and college waivers require maintaining a minimum CGPA (often 7.5+ or 8.0+) without backlogs.
              </span>
            </li>
          </ul>
        </div>

        {/* What You Should Consider */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold border-b border-slate-800 pb-2">
            <Lightbulb className="w-4 h-4" />
            <span>💡 What You Should Consider (Data-Based Observations)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                {financialAnalysis.isDeficit
                  ? `With an annual budget deficit of ${formatINR(Math.abs(financialAnalysis.annualBudgetGap))}, check if education loan interest subsidies (such as Central Scheme for Interest Subsidy - CSIS) apply to your family income slab.`
                  : `Your annual education budget comfortably accommodates the net annual cost of ${formatINR(financialAnalysis.netAnnualCost)}.`}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                {admissionAnalysis.admissionProbability >= 70
                  ? `Your profile is positioned favorably for ${course.name}. You may consider also listing more aspirational branches or institutions in your top preference choices.`
                  : `Given the competitive cutoff margin, ensure you pair this choice with 2-3 safer backup options in your JoSAA / state choice filling sheet.`}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <span>
                Review the official {college.counsellingBody} information brochure to confirm documents required for {student.category} reservation claims before the counseling deadline.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CLEAN PRINTABLE REPORT TEMPLATE (Captured by PDF Generator & Used by Print) */}
      {/* ========================================================================= */}
      <div
        id="printable-report-wrapper"
        className="hidden print:block relative"
      >
        <div
          id="printable-admigo-report"
          className="bg-white text-slate-900 p-8 max-w-[850px] mx-auto border border-slate-200 rounded-none font-sans text-xs space-y-6 shadow-none"
          style={{ width: '850px' }}
        >
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-indigo-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-bold text-base">
                  🎓
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-indigo-950 tracking-tight">
                    AdmiGo
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Indian College Admission & Financial Portfolio Analyzer
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                Official Analysis Dossier
              </span>
              <span className="font-mono font-bold text-xs text-slate-800 block">
                {reportId}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Date: {currentDate}
              </span>
            </div>
          </div>

          {/* Candidate & Institution Meta Box */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-900 font-mono block mb-1">
                Candidate Profile
              </span>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr>
                    <td className="text-slate-500 py-0.5">Student Name:</td>
                    <td className="font-semibold text-slate-900 py-0.5">{student.name}</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 py-0.5">Category & Domicile:</td>
                    <td className="font-semibold text-slate-900 py-0.5">{student.category} · {student.state}</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 py-0.5">Board Percentages:</td>
                    <td className="font-semibold text-slate-900 py-0.5">
                      Class 10: {student.class10Percent}% · Class 12: {student.class12Percent}%
                    </td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 py-0.5">Entrance Exam & Score:</td>
                    <td className="font-semibold text-slate-900 py-0.5">
                      {student.entranceExam} · {isRankBased ? `Rank #${student.expectedRank}` : `Score ${student.examScore}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-900 font-mono block mb-1">
                Target Institution & Course
              </span>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr>
                    <td className="text-slate-500 py-0.5">College:</td>
                    <td className="font-semibold text-slate-900 py-0.5">{college.name}</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 py-0.5">Specialization:</td>
                    <td className="font-semibold text-slate-900 py-0.5">{course.name} ({course.degree})</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 py-0.5">Location & Type:</td>
                    <td className="font-semibold text-slate-900 py-0.5">{college.city}, {college.state} · {college.type}</td>
                  </tr>
                  <tr>
                    <td className="text-slate-500 py-0.5">Counselling Channel:</td>
                    <td className="font-semibold text-slate-900 py-0.5">{college.counsellingBody} (Target: {student.targetAdmissionYear})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 1: Admission Chance Diagnostic */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider font-mono border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>1. Admission Chance & Category-Aware Diagnostic</span>
              <span className="font-normal text-[10px] text-slate-500">
                Fit Level: <strong>{admissionAnalysis.fitLevel}</strong>
              </span>
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[9px] uppercase font-mono text-slate-500 block">Est. Probability</span>
                <span className="text-lg font-extrabold text-indigo-950 block">
                  {admissionAnalysis.admissionProbability}%
                </span>
                <span className="text-[9px] text-slate-500">{admissionAnalysis.fitLevel}</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[9px] uppercase font-mono text-slate-500 block">Target Cutoff ({student.category})</span>
                <span className="text-lg font-extrabold text-slate-900 block font-mono">
                  {formatMetricValue(admissionAnalysis.effectiveCutoff, isRankBased ? 'rank' : 'score')}
                </span>
                <span className="text-[9px] text-slate-500">Closing threshold</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[9px] uppercase font-mono text-slate-500 block">Student Expected</span>
                <span className="text-lg font-extrabold text-slate-900 block font-mono">
                  {formatMetricValue(admissionAnalysis.studentScoreOrRank, isRankBased ? 'rank' : 'score')}
                </span>
                <span className="text-[9px] text-slate-500">Candidate metric</span>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-[9px] uppercase font-mono text-slate-500 block">Cutoff Margin</span>
                <span className={`text-lg font-extrabold block font-mono ${admissionAnalysis.cutoffDifference >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {admissionAnalysis.cutoffDifference >= 0 ? `+${admissionAnalysis.cutoffDifference}` : admissionAnalysis.cutoffDifference}
                </span>
                <span className="text-[9px] text-slate-500">{admissionAnalysis.cutoffDifference >= 0 ? 'Comfort Buffer' : 'Deficit'}</span>
              </div>
            </div>

            <div className="p-2.5 bg-indigo-50/60 border border-indigo-100 rounded text-[11px] text-indigo-950 leading-relaxed">
              <strong>Category Quota Finding:</strong> &ldquo;{admissionAnalysis.categoryAnalysisMessage}&rdquo;
            </div>
          </div>

          {/* Section 2: Financial Assessment & 4-Year Cost Projection */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider font-mono border-b border-slate-300 pb-1 flex items-center justify-between">
              <span>2. Financial Assessment & 4-Year Outlay (₹ Indian Rupees)</span>
              <span className="font-normal text-[10px] text-slate-500">
                Annual Inflation: <strong>{(inflationRate * 100).toFixed(1)}%</strong>
              </span>
            </h3>

            {/* Annual Net Cost Table */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <table className="w-full text-[11px] border border-slate-200">
                  <thead className="bg-slate-100 text-slate-600 font-mono text-[9px] uppercase">
                    <tr>
                      <th className="py-1.5 px-2 text-left">Fee Component</th>
                      <th className="py-1.5 px-2 text-right">Annual (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Base Tuition Fee:</td>
                      <td className="py-1 px-2 text-right font-medium">{formatINR(financialAnalysis.tuition)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Hostel & Mess Accommodation:</td>
                      <td className="py-1 px-2 text-right font-medium">
                        {student.hostelRequired ? formatINR(financialAnalysis.hostel) : '₹0 (Day Scholar)'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Estimated Living & Books:</td>
                      <td className="py-1 px-2 text-right font-medium">{formatINR(financialAnalysis.living)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Less: Estimated Scholarships & Waivers:</td>
                      <td className="py-1 px-2 text-right font-medium text-indigo-900">
                        -{formatINR(financialAnalysis.totalEstimatedScholarship)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold font-sans">
                      <td className="py-1.5 px-2 text-slate-900">Net Out-of-Pocket Annual Cost:</td>
                      <td className="py-1.5 px-2 text-right text-indigo-950 font-mono">
                        {formatINR(financialAnalysis.netAnnualCost)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <table className="w-full text-[11px] border border-slate-200">
                  <thead className="bg-slate-100 text-slate-600 font-mono text-[9px] uppercase">
                    <tr>
                      <th className="py-1.5 px-2 text-left">Budget Parameter</th>
                      <th className="py-1.5 px-2 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Family Annual Income:</td>
                      <td className="py-1 px-2 text-right font-medium">{formatLakh(student.annualFamilyIncome)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Annual Education Budget:</td>
                      <td className="py-1 px-2 text-right font-medium">{formatLakh(financialAnalysis.annualBudget)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Annual Surplus / Deficit:</td>
                      <td className={`py-1 px-2 text-right font-bold ${financialAnalysis.isDeficit ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {financialAnalysis.isDeficit ? '-' : '+'}{formatINR(Math.abs(financialAnalysis.annualBudgetGap))}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 px-2 text-slate-600">Affordability Score (0-100):</td>
                      <td className="py-1 px-2 text-right font-bold text-slate-900">
                        {financialAnalysis.affordabilityScore} / 100 ({financialAnalysis.affordabilityLabel})
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold font-sans">
                      <td className="py-1.5 px-2 text-slate-900">4-Year Total Projected Cost:</td>
                      <td className="py-1.5 px-2 text-right text-emerald-800 font-mono">
                        {formatLakh(financialAnalysis.fourYearTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4-Year Inflation Projection Table */}
            <div className="pt-1">
              <table className="w-full text-[10px] border border-slate-200 text-right">
                <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[9px]">
                  <tr>
                    <th className="py-1 px-2 text-left">Academic Year</th>
                    <th className="py-1 px-2">Tuition</th>
                    <th className="py-1 px-2">Hostel</th>
                    <th className="py-1 px-2">Living</th>
                    <th className="py-1 px-2">Scholarship</th>
                    <th className="py-1 px-2 font-bold text-slate-900">Net Cost</th>
                    <th className="py-1 px-2">Cumulative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {financialAnalysis.projections.map((p) => (
                    <tr key={p.year}>
                      <td className="py-1 px-2 text-left font-sans font-semibold text-slate-800">{p.label}</td>
                      <td className="py-1 px-2">{formatINR(p.tuition)}</td>
                      <td className="py-1 px-2">{formatINR(p.hostel)}</td>
                      <td className="py-1 px-2">{formatINR(p.living)}</td>
                      <td className="py-1 px-2 text-indigo-900">-{formatINR(p.scholarship)}</td>
                      <td className="py-1 px-2 font-bold text-slate-900">{formatINR(p.netCost)}</td>
                      <td className="py-1 px-2 font-bold text-slate-700">{formatINR(p.cumulativeCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Key Risks & Strategic Advice */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider font-mono border-b border-slate-300 pb-1">
              3. Critical Risks & Strategic Counselling Observations
            </h3>

            <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-700 leading-relaxed">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="font-bold text-slate-900 block text-[11px]">⚠️ Key Risks to Monitor</span>
                <p>• <strong>Cutoff Movement:</strong> Historical volatility is {college.volatility}. Round-by-round seat allotment shifts may tighten closing cutoff.</p>
                <p>• <strong>Fee Escalation:</strong> Budget assumes an annual {(inflationRate * 100).toFixed(1)}% inflation compounding tuition and mess charges.</p>
                <p>• <strong>Scholarship Eligibility:</strong> Institutional fee waivers require active verification of family income certificates and maintaining CGPA norms.</p>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                <span className="font-bold text-slate-900 block text-[11px]">💡 Strategic Action Points</span>
                <p>• {financialAnalysis.isDeficit
                  ? `Address the annual budget deficit of ${formatINR(Math.abs(financialAnalysis.annualBudgetGap))} through education loan portals (e.g. Vidya Lakshmi).`
                  : `Net annual cost is comfortably covered by your annual budget of ${formatLakh(financialAnalysis.annualBudget)}.`}
                </p>
                <p>• {admissionAnalysis.admissionProbability >= 70
                  ? `Position this course high on your choice list, but retain 1-2 dream choices at the top.`
                  : `Ensure you add at least 2 safer backup colleges in your state/national counselling preference sheet.`}
                </p>
                <p>• Verify final category seat matrices directly on official {college.counsellingBody} notifications.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Official Statutory Disclaimer */}
          <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-500 leading-normal space-y-1">
            <p>
              <strong>Demo Application Disclaimer:</strong> College fees, cutoffs, scholarships, admission indicators and projections shown in this prototype are simulated/demo data and are not official admission information. Students should verify current fees, cutoffs, counselling rules and eligibility requirements from the respective official college/admission authority.
            </p>
            <div className="flex justify-between font-mono pt-1 text-[8px] text-slate-400">
              <span>AdmiGo · Dossier Ref: {reportId}</span>
              <span>Generated on {currentDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
