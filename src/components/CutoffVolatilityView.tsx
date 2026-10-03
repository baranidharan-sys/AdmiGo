import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Info,
  Users,
  Compass,
  Zap,
} from 'lucide-react';
import { College, CourseOption, StudentProfile } from '../types';
import { formatMetricValue } from '../utils/calculations';

interface CutoffVolatilityViewProps {
  college: College;
  course: CourseOption;
  student: StudentProfile;
}

export const CutoffVolatilityView: React.FC<CutoffVolatilityViewProps> = ({
  college,
  course,
  student,
}) => {
  const isRankBased = college.cutoffType === 'rank';
  const category = student.category;

  // Multi-year line chart data
  const chartData = [
    ...college.historicalCutoffs.map((h) => {
      const courseAdjusted = isRankBased
        ? h.cutoff + course.cutoffOffsetRank
        : h.cutoff + course.cutoffOffsetRank;
      return {
        year: h.year.toString(),
        cutoff: courseAdjusted,
        applicants: h.totalApplicants,
        type: 'Historic Closing Cutoff',
      };
    }),
    {
      year: `${student.targetAdmissionYear} (Est.)`,
      cutoff: isRankBased
        ? college.predictedCutoffNextYear + course.cutoffOffsetRank
        : college.predictedCutoffNextYear + course.cutoffOffsetRank,
      applicants: Math.round(
        college.historicalCutoffs[college.historicalCutoffs.length - 1]
          ?.totalApplicants * 1.08 || 200000
      ),
      type: 'Predicted Cutoff',
    },
  ];

  // Cutoff movement calculation
  const history = college.historicalCutoffs;
  const latestCutoff = history[history.length - 1]?.cutoff || 0;
  const previousCutoff = history[history.length - 2]?.cutoff || latestCutoff;
  const cutoffMovement = latestCutoff - previousCutoff;

  const volatilityBadge = {
    Stable: {
      dot: 'bg-emerald-400',
      badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-700/60',
      desc: 'Historic cutoffs show minimal year-on-year fluctuation (< 5% shift). Consistent counselling predictor.',
    },
    'Moderate Volatility': {
      dot: 'bg-amber-400',
      badge: 'bg-amber-950/50 text-amber-300 border-amber-700/60',
      desc: 'Cutoffs experience noticeable shifts between rounds depending on exam paper difficulty and state quota seat matrix changes.',
    },
    'High Volatility': {
      dot: 'bg-rose-400',
      badge: 'bg-rose-950/50 text-rose-300 border-rose-700/60',
      desc: 'High sensitivity to nationwide branch preferences (e.g. AI/Data Science surge) and rapid changes in applicant density.',
    },
  }[college.volatility];

  const studentTargetMetric = isRankBased
    ? student.expectedRank
    : student.examScore;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Cutoff Trend & Competition Risk
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${volatilityBadge.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${volatilityBadge.dot}`} />
              {college.volatility}
            </span>
          </div>
        </div>

        {/* 4 Metric Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Previous Cutoff
            </span>
            <span className="text-base font-extrabold text-white">
              {formatMetricValue(previousCutoff, isRankBased ? 'rank' : 'score')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Cycle {history[history.length - 2]?.year || 'Prior'}
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Current Est. Cutoff
            </span>
            <span className="text-base font-extrabold text-indigo-300">
              {formatMetricValue(latestCutoff, isRankBased ? 'rank' : 'score')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Cycle {history[history.length - 1]?.year || 'Current'}
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Predicted Next Cutoff
            </span>
            <span className="text-base font-extrabold text-violet-300">
              {formatMetricValue(college.predictedCutoffNextYear, isRankBased ? 'rank' : 'score')}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Cycle {student.targetAdmissionYear} (Est.)
            </span>
          </div>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Course Demand & Comp.
            </span>
            <span className="text-base font-extrabold text-white truncate block">
              {course.demandLevel}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Index: {college.competitionIndex} / 10
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
          💡 <strong>Volatility Analysis:</strong> {volatilityBadge.desc}
        </p>
      </div>

      {/* Historical Cutoff Movement Multi-Year Line Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Multi-Year Closing Cutoff Trajectory</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRankBased
                ? 'Closing ranks across past counseling cycles (Note: Lower numerical rank = Higher selectivity)'
                : 'Closing score benchmarks over past counseling cycles (Higher score = Higher selectivity)'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-violet-400 inline-block" />
              Cutoff Trend
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 border-t border-dashed inline-block" />
              Your Score / Rank ({formatMetricValue(studentTargetMetric, isRankBased ? 'rank' : 'score')})
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                domain={['auto', 'auto']}
                reversed={isRankBased} // for ranks, invert so higher ranks visually appear at the top!
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [
                  formatMetricValue(Number(val), isRankBased ? 'rank' : 'score'),
                  'Cutoff Value',
                ]}
              />
              <ReferenceLine
                y={studentTargetMetric}
                stroke="#34d399"
                strokeDasharray="4 4"
                label={{
                  value: 'Your Rank/Score',
                  fill: '#34d399',
                  position: 'top',
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="cutoff"
                stroke="#a78bfa"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-500 font-mono text-center">
          * Cutoff trends simulated based on historic JoSAA / State counselling seat metrics.
        </div>
      </div>
    </div>
  );
};
