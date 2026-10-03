import React from 'react';
import {
  Building2,
  MapPin,
  GraduationCap,
  Sparkles,
  Award,
  Layers,
  IndianRupee,
  Share2,
  Calendar,
  Compass,
} from 'lucide-react';
import { College, CourseOption, StudentProfile } from '../types';
import { formatINR, formatLakh, formatMetricValue } from '../utils/calculations';

interface ActiveCollegeOverviewProps {
  college: College;
  course: CourseOption;
  student: StudentProfile;
  onOpenCollegeSearch: () => void;
  onDownloadReport?: () => void;
  onChangeCourse?: (courseId: string) => void;
}

export const ActiveCollegeOverview: React.FC<ActiveCollegeOverviewProps> = ({
  college,
  course,
  student,
  onOpenCollegeSearch,
  onDownloadReport,
  onChangeCourse,
}) => {
  const isRankBased = college.cutoffType === 'rank';
  const categoryCutoff = college.cutoffs[student.category] ?? college.cutoffs.General;
  const courseTuition = college.baseTuition + (course.tuitionOffset || 0);
  const effectiveCutoff = categoryCutoff + (course.cutoffOffsetRank || 0);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-6">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-indigo-400 font-mono uppercase tracking-wider">
              {college.type} Institution
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {college.city}, {college.state}
            </span>
            {college.nirfRank && (
              <>
                <span className="text-slate-600">·</span>
                <span className="text-amber-300 font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  NIRF #{college.nirfRank}
                </span>
              </>
            )}
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono">
              {college.counsellingBody}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Analysis for {college.name}
          </h1>

          {/* Interactive Course Switcher */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-slate-950/80 border border-indigo-500/40 shadow-sm">
              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-[11px] font-mono uppercase text-slate-400">Selected Course:</span>
              {onChangeCourse && college.courses.length > 1 ? (
                <select
                  value={course.id}
                  onChange={(e) => onChangeCourse(e.target.value)}
                  className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  title="Switch course to analyze different fees"
                >
                  {college.courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {formatINR(college.baseTuition + c.tuitionOffset)}/yr
                    </option>
                  ))}
                </select>
              ) : (
                <span className="text-xs font-bold text-white">
                  {course.name}
                </span>
              )}
            </div>

            <span className="text-xs px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              {course.degree} · {course.durationYears} Years
            </span>

            <span className={`text-[11px] px-2.5 py-1.5 rounded-xl border font-semibold ${
              course.demandLevel === 'Very High'
                ? 'bg-rose-950/40 border-rose-700/50 text-rose-300'
                : course.demandLevel === 'High'
                ? 'bg-amber-950/40 border-amber-700/50 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
            }`}>
              🔥 {course.demandLevel} Demand
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onDownloadReport && (
            <button
              onClick={onDownloadReport}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              title="Download clean printable PDF report"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Download Report (PDF)</span>
            </button>
          )}

          <button
            onClick={onOpenCollegeSearch}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all"
          >
            Change College / Course
          </button>
        </div>
      </div>

      {/* College Overview Key Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
        {/* Entrance Exam */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
            Entrance Exam
          </span>
          <span className="text-sm font-bold text-white block truncate">
            {college.entranceExam}
          </span>
          <span className="text-[10px] text-slate-400">Target: {student.targetAdmissionYear}</span>
        </div>

        {/* Expected Cutoff */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
            {student.category} Cutoff
          </span>
          <span className="text-sm font-bold text-indigo-300 font-mono block">
            {isRankBased ? 'Rank ' : 'Score '}
            {formatMetricValue(effectiveCutoff, college.cutoffType)}
          </span>
          <span className="text-[10px] text-slate-400">
            For {course.name.split(' ')[0]}
          </span>
        </div>

        {/* Course-Specific Tuition Fee */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
            Course Tuition
          </span>
          <span className="text-sm font-bold text-white block">
            {formatINR(courseTuition)}
          </span>
          <span className="text-[10px] text-slate-400">Per Year · {course.degree}</span>
        </div>

        {/* Hostel Fee */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
            Hostel & Mess
          </span>
          <span className="text-sm font-bold text-white block">
            {formatINR(college.hostelFee)}
          </span>
          <span className="text-[10px] text-slate-400">Boarding / yr</span>
        </div>

        {/* Scholarship */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
            Base Scholarship
          </span>
          <span className="text-sm font-bold text-emerald-400 block">
            {formatINR(college.baseScholarship)}
          </span>
          <span className="text-[10px] text-slate-400">Before merit/income</span>
        </div>

        {/* Average Package / Highlights */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
            Avg. Campus CTC
          </span>
          <span className="text-sm font-bold text-white block font-mono">
            {college.averagePackageLpa ? `₹${college.averagePackageLpa} LPA` : 'Govt Scale'}
          </span>
          <span className="text-[10px] text-slate-400 truncate block">
            Highest: ₹{college.highestPackageLpa || 45} LPA
          </span>
        </div>
      </div>

      {/* College Highlights bullets */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
        <span className="text-slate-500 font-medium">Institutional Highlights:</span>
        {college.highlights.map((hl, i) => (
          <span key={i} className="flex items-center gap-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span>{hl}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
