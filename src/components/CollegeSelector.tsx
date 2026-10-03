import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Building2,
  MapPin,
  Sparkles,
  ChevronRight,
  IndianRupee,
  Award,
  Filter,
  CheckCircle,
  CheckCircle2,
  X,
  GraduationCap,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  BookOpen,
} from 'lucide-react';
import { College, CourseOption, StudentProfile } from '../types';
import { formatINR, formatLakh, formatMetricValue } from '../utils/calculations';
import { ENTRANCE_EXAMS_LIST, INDIAN_STATES } from '../data/colleges';

interface CollegeSelectorProps {
  colleges: College[];
  activeCollege: College;
  studentProfile: StudentProfile;
  onSelectCollege: (college: College, courseId?: string) => void;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const CollegeSelector: React.FC<CollegeSelectorProps> = ({
  colleges,
  activeCollege,
  studentProfile,
  onSelectCollege,
  isOpenModal = false,
  onCloseModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedExam, setSelectedExam] = useState<string>('All');
  const [maxAnnualFee, setMaxAnnualFee] = useState<number>(400000);
  const [selectedDegree, setSelectedDegree] = useState<string>('All');

  // Course Selection Step Modal State
  const [courseModalCollege, setCourseModalCollege] = useState<College | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  const filteredColleges = useMemo(() => {
    return colleges.filter((col) => {
      // Search query matches college name, shortName, city, or courses
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = col.name.toLowerCase().includes(query);
        const matchesShort = col.shortName.toLowerCase().includes(query);
        const matchesCity = col.city.toLowerCase().includes(query);
        const matchesCourse = col.courses.some((c) =>
          c.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesShort && !matchesCity && !matchesCourse) {
          return false;
        }
      }

      // State filter
      if (selectedState !== 'All' && col.state !== selectedState) {
        return false;
      }

      // Type filter (Government vs Private vs Govt-Aided)
      if (selectedType !== 'All') {
        if (selectedType === 'Government') {
          if (col.type !== 'Government' && col.type !== 'NIT' && col.type !== 'IIT') {
            return false;
          }
        } else if (selectedType === 'Private') {
          if (col.type !== 'Private' && col.type !== 'Deemed') {
            return false;
          }
        } else if (col.type !== selectedType) {
          return false;
        }
      }

      // Entrance exam filter
      if (selectedExam !== 'All' && col.entranceExam !== selectedExam) {
        return false;
      }

      // Tuition budget
      if (col.baseTuition > maxAnnualFee) {
        return false;
      }

      // Course degree filter
      if (selectedDegree !== 'All') {
        const hasDegree = col.courses.some((c) => c.degree === selectedDegree);
        if (!hasDegree) return false;
      }

      return true;
    });
  }, [colleges, searchTerm, selectedState, selectedType, selectedExam, maxAnnualFee, selectedDegree]);

  const handleInitiateCourseSelection = (col: College, preferredCourseId?: string) => {
    setCourseModalCollege(col);
    setSelectedCourseId(preferredCourseId || col.defaultCourseId || col.courses[0]?.id || '');
  };

  const handleConfirmCourseSelection = () => {
    if (courseModalCollege && selectedCourseId) {
      onSelectCollege(courseModalCollege, selectedCourseId);
      setCourseModalCollege(null);
      if (onCloseModal) onCloseModal();
    }
  };

  // Currently inspected course object in the modal
  const activeCourseObj: CourseOption | undefined = useMemo(() => {
    if (!courseModalCollege) return undefined;
    return (
      courseModalCollege.courses.find((c) => c.id === selectedCourseId) ||
      courseModalCollege.courses[0]
    );
  }, [courseModalCollege, selectedCourseId]);

  // Derived financial calculation for the chosen course
  const courseTuition = courseModalCollege && activeCourseObj
    ? courseModalCollege.baseTuition + (activeCourseObj.tuitionOffset || 0)
    : 0;
  const hostelFee = courseModalCollege && studentProfile.hostelRequired ? courseModalCollege.hostelFee : 0;
  const livingExp = courseModalCollege ? courseModalCollege.estimatedLivingExpenses : 0;
  const totalAnnualOutlay = courseTuition + hostelFee + livingExp;
  const fourYearOutlay = activeCourseObj ? totalAnnualOutlay * activeCourseObj.durationYears : 0;
  const isBudgetFit = totalAnnualOutlay <= studentProfile.annualEducationBudget;
  const budgetDelta = Math.abs(studentProfile.annualEducationBudget - totalAnnualOutlay);

  const categoryCutoffForCourse = useMemo(() => {
    if (!courseModalCollege || !activeCourseObj) return 0;
    const baseCutoff = courseModalCollege.cutoffs[studentProfile.category] ?? courseModalCollege.cutoffs.General;
    return baseCutoff + (activeCourseObj.cutoffOffsetRank || 0);
  }, [courseModalCollege, activeCourseObj, studentProfile.category]);

  const content = (
    <div className="space-y-6">
      {/* Hero Question Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Which college are you interested in?
        </h1>
        <p className="text-sm text-slate-400">
          Search premier Indian colleges, explore their available branches, and analyze personalized fees and cutoffs.
        </p>
      </div>

      {/* Main Search & Fast Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm space-y-4">
        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by college name (e.g. IIT Madras, NIT Trichy, Anna University, VIT), city, or branch (CSE)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* State */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All States (India)</option>
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* College Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="Government">Government / IIT / NIT</option>
              <option value="Government-Aided">Government-Aided</option>
              <option value="Private">Private / Deemed</option>
            </select>
          </div>

          {/* Entrance Exam */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Entrance Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Entrance Exams</option>
              {ENTRANCE_EXAMS_LIST.map((exam) => (
                <option key={exam.id} value={exam.name}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Degree
            </label>
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Degrees</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.E.">B.E.</option>
            </select>
          </div>

          {/* Tuition Range Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <span>Max Tuition</span>
              <span className="text-white font-mono">{formatLakh(maxAnnualFee)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="400000"
              step="25000"
              value={maxAnnualFee}
              onChange={(e) => setMaxAnnualFee(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          <div className="text-slate-400">
            Showing <strong className="text-white">{filteredColleges.length}</strong> colleges matching your filters.
          </div>
          {(searchTerm || selectedState !== 'All' || selectedType !== 'All' || selectedExam !== 'All' || maxAnnualFee < 400000 || selectedDegree !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('All');
                setSelectedType('All');
                setSelectedExam('All');
                setMaxAnnualFee(400000);
                setSelectedDegree('All');
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* College Cards Grid */}
      <div>
        {filteredColleges.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No colleges match your criteria</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your state, maximum tuition fee, or entrance exam filters to view more institutions.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedState('All');
                setSelectedType('All');
                setSelectedExam('All');
                setMaxAnnualFee(400000);
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredColleges.map((col) => {
              const isCurrentActive = activeCollege.id === col.id;
              const categoryCutoff = col.cutoffs[studentProfile.category] ?? col.cutoffs.General;

              return (
                <div
                  key={col.id}
                  className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                    isCurrentActive
                      ? 'bg-indigo-950/20 border-indigo-500/80 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                        <span className="flex items-center gap-1 font-medium text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {col.city}, {col.state}
                        </span>
                        <span className="font-mono text-slate-400">
                          {col.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base leading-snug group-hover:text-indigo-300">
                        {col.name}
                      </h3>
                    </div>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Entrance Exam
                        </span>
                        <span className="font-semibold text-slate-200">
                          {col.entranceExam}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Expected Cutoff ({studentProfile.category})
                        </span>
                        <span className="font-semibold text-slate-200 font-mono">
                          {col.cutoffType === 'rank' ? 'Rank ' : 'Score '}
                          {categoryCutoff}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Base Tuition
                        </span>
                        <span className="font-semibold text-slate-200">
                          {formatINR(col.baseTuition)}/yr
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                          Hostel & Mess
                        </span>
                        <span className="font-semibold text-slate-200">
                          {formatINR(col.hostelFee)}/yr
                        </span>
                      </div>
                    </div>

                    {/* Available Courses list */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono uppercase text-slate-400 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Available Courses ({col.courses.length}):</span>
                        </span>
                        <span className="text-[10px] text-indigo-400">Click to Choose</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {col.courses.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInitiateCourseSelection(col, c.id);
                            }}
                            className="text-[11px] px-2 py-1 rounded-md bg-slate-950 hover:bg-indigo-950 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white transition-all text-left flex items-center gap-1"
                            title={`Select ${c.name} (${formatINR(col.baseTuition + c.tuitionOffset)}/yr)`}
                          >
                            <span className="truncate max-w-[170px]">
                              {c.name.replace('B.Tech in ', '').replace('B.E. in ', '')}
                            </span>
                            <span className="text-[10px] font-mono text-indigo-400 font-bold shrink-0">
                              {formatLakh(col.baseTuition + c.tuitionOffset)}/yr
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button: Choose Course & Analyze */}
                  <div className="pt-4 mt-3 border-t border-slate-800/70">
                    <button
                      onClick={() => handleInitiateCourseSelection(col)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isCurrentActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700/80 hover:border-transparent'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Choose Course & Analyze Fees</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DEDICATED COURSE SELECTION & FEE ANALYSIS MODAL */}
      {/* ========================================================================= */}
      {courseModalCollege && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-950/70 border border-indigo-700/50 text-indigo-300">
                    Step 2: Choose Your Course
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {courseModalCollege.city}, {courseModalCollege.state} · {courseModalCollege.entranceExam}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-white">
                  Choose Course at {courseModalCollege.shortName}
                </h2>
                <p className="text-xs text-slate-400">
                  Select an available course below to analyze its specific tuition fees, hostel, living costs, and cutoff competition.
                </p>
              </div>

              <button
                onClick={() => setCourseModalCollege(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Section 1: Course Cards */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono block">
                  Available Courses in {courseModalCollege.shortName} ({courseModalCollege.courses.length} options):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courseModalCollege.courses.map((course) => {
                    const isSelected = selectedCourseId === course.id;
                    const thisCourseTuition = courseModalCollege.baseTuition + (course.tuitionOffset || 0);
                    const baseCutoff = courseModalCollege.cutoffs[studentProfile.category] ?? courseModalCollege.cutoffs.General;
                    const effectiveThisCutoff = baseCutoff + (course.cutoffOffsetRank || 0);

                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 text-left relative ${
                          isSelected
                            ? 'bg-indigo-950/50 border-indigo-400 ring-2 ring-indigo-500/40 shadow-lg'
                            : 'bg-slate-950/60 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-slate-400 block">
                              {course.degree} · {course.durationYears} Years
                            </span>
                            <h4 className="font-bold text-sm text-white leading-snug">
                              {course.name}
                            </h4>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            {isSelected ? (
                              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                            )}
                          </div>
                        </div>

                        {/* Specs for this course */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              Annual Tuition
                            </span>
                            <span className="font-extrabold text-white text-sm">
                              {formatINR(thisCourseTuition)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {studentProfile.category} Cutoff
                            </span>
                            <span className="font-bold text-indigo-300 font-mono text-xs">
                              {courseModalCollege.cutoffType === 'rank' ? 'Rank #' : 'Score '}
                              {formatMetricValue(effectiveThisCutoff, courseModalCollege.cutoffType)}
                            </span>
                          </div>
                        </div>

                        {/* Demand tag */}
                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-md font-semibold ${
                            course.demandLevel === 'Very High'
                              ? 'bg-rose-950/50 text-rose-300 border border-rose-800/40'
                              : course.demandLevel === 'High'
                              ? 'bg-amber-950/50 text-amber-300 border border-amber-800/40'
                              : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                          }`}>
                            🔥 {course.demandLevel} Demand
                          </span>
                          <span className="text-slate-400 font-mono">
                            4-Yr Tuition: {formatLakh(thisCourseTuition * course.durationYears)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Real-time Fee Analysis for Selected Course */}
              {activeCourseObj && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-900/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-indigo-400 block">
                        Estimated Fee Structure For Selected Specialization:
                      </span>
                      <h3 className="font-bold text-base text-white">
                        {activeCourseObj.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Annual Tuition Fee:</span>
                      <span className="text-lg font-extrabold text-white font-mono">
                        {formatINR(courseTuition)}
                        <span className="text-xs text-slate-400 font-normal"> / year</span>
                      </span>
                    </div>
                  </div>

                  {/* Fee itemization table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Course Tuition
                      </span>
                      <span className="font-bold text-white block mt-0.5">
                        {formatINR(courseTuition)}/yr
                      </span>
                      <span className="text-[10px] text-slate-500">Academic fee</span>
                    </div>

                    <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Hostel & Mess
                      </span>
                      <span className="font-bold text-white block mt-0.5">
                        {studentProfile.hostelRequired ? `${formatINR(hostelFee)}/yr` : '₹0 (Day Scholar)'}
                      </span>
                      <span className="text-[10px] text-slate-500">Boarding & meals</span>
                    </div>

                    <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Annual Outlay
                      </span>
                      <span className="font-extrabold text-emerald-400 block mt-0.5">
                        {formatINR(totalAnnualOutlay)}/yr
                      </span>
                      <span className="text-[10px] text-slate-500">Incl. living expenses</span>
                    </div>

                    <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-xl">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        4-Year Commitment
                      </span>
                      <span className="font-extrabold text-indigo-300 block mt-0.5">
                        {formatLakh(fourYearOutlay)}
                      </span>
                      <span className="text-[10px] text-slate-500">{activeCourseObj.durationYears} Year Degree</span>
                    </div>
                  </div>

                  {/* Budget Fit Banner */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs gap-3 ${
                    isBudgetFit
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-800/50 text-amber-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isBudgetFit ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>
                        {isBudgetFit ? (
                          <>
                            <strong>Budget Fit:</strong> Comfortably covered within your annual education budget of <strong>{formatLakh(studentProfile.annualEducationBudget)}</strong> (Surplus: {formatINR(budgetDelta)}/yr).
                          </>
                        ) : (
                          <>
                            <strong>Budget Deficit:</strong> Annual fee exceeds your education budget by <strong>{formatINR(budgetDelta)}/yr</strong>. Consider institutional scholarships or education loans.
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/80">
              <button
                type="button"
                onClick={() => setCourseModalCollege(null)}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                ← Back to College List
              </button>

              <button
                type="button"
                onClick={handleConfirmCourseSelection}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Analyze Fees for {activeCourseObj?.name || 'Selected Course'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150">
        <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 my-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Select College to Analyze
            </h2>
            <button
              onClick={onCloseModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return content;
};
