import React, { useState, useMemo, useEffect } from 'react';
import {
  GraduationCap,
  Building2,
  BarChart3,
  IndianRupee,
  Activity,
  Scale,
  Target,
  FileText,
  SlidersHorizontal,
  Search,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  AppTheme,
  College,
  CourseOption,
  GmailAccount,
  ProfileLogoConfig,
  StudentProfile,
} from './types';
import { INDIAN_COLLEGES_DATABASE } from './data/colleges';
import {
  analyzeAdmissionChance,
  calculateFinancialAnalysis,
} from './utils/calculations';
import { Navbar } from './components/Navbar';
import { LiveStatusHeader } from './components/LiveStatusHeader';
import { CollegeSelector } from './components/CollegeSelector';
import { ActiveCollegeOverview } from './components/ActiveCollegeOverview';
import { AdmissionChanceView } from './components/AdmissionChanceView';
import { FinancialPlannerView } from './components/FinancialPlannerView';
import { CutoffVolatilityView } from './components/CutoffVolatilityView';
import { PersonalizedReportView } from './components/PersonalizedReportView';
import { CollegeComparisonView } from './components/CollegeComparisonView';
import { PortfolioBuilderView } from './components/PortfolioBuilderView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { AuthPage } from './components/AuthPage';

type ActiveTab =
  | 'analyzer'
  | 'admission'
  | 'finance'
  | 'cutoff'
  | 'compare'
  | 'portfolio'
  | 'report';

export default function App() {
  // 0. Theme State (persisted with elegant default)
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('admigo_theme') || localStorage.getItem('uniportfolio_theme');
      if (saved && ['champagne-gold', 'imperial-sapphire', 'regal-emerald', 'rose-bordeaux', 'nordic-titanium', 'alabaster-light'].includes(saved)) {
        return saved as AppTheme;
      }
    } catch (e) {
      console.error(e);
    }
    return 'champagne-gold'; // Default elegant warm obsidian & champagne gold
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('admigo_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // 1. Initial State for Indian Student Profile (persisted)
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('admigo_student_profile') || localStorage.getItem('uniportfolio_student_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Karthik Raman',
      username: 'karthik_scholar',
      class10Percent: 93.5,
      class12Percent: 95.0,
      entranceExam: 'JEE Advanced',
      examScore: 240,
      expectedRank: 150,
      targetAdmissionYear: 2025,
      state: 'Tamil Nadu',
      category: 'General',
      annualFamilyIncome: 600000, // ₹6,00,000 / year
      annualEducationBudget: 200000, // ₹2,00,000 / year (Affordable fee)
      hostelRequired: true,
      preferredLocation: 'Same State',
      applicationBudget: 5000, // ₹5,000
      account: null,
      theme: 'champagne-gold',
      profileLogo: {
        icon: 'graduation-cap',
        gradient: 'from-amber-400 to-amber-600',
      },
    };
  });

  const handleUpdateProfile = (updated: StudentProfile) => {
    setStudentProfile(updated);
    try {
      localStorage.setItem('admigo_student_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Active College & Course State
  const [activeCollege, setActiveCollege] = useState<College>(
    INDIAN_COLLEGES_DATABASE[0] // IIT Madras
  );
  const [activeCourseId, setActiveCourseId] = useState<string>(
    INDIAN_COLLEGES_DATABASE[0].defaultCourseId
  );

  // 3. Navigation & Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');

  // 4. Modals and Auth Page State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCollegeSearchModalOpen, setIsCollegeSearchModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isAuthPageOpen, setIsAuthPageOpen] = useState(false);
  const [authSuccessToast, setAuthSuccessToast] = useState<string | null>(null);

  // 5. Financial Inflation Assumption (Default: 7.5% per annum)
  const [inflationRate, setInflationRate] = useState<number>(0.075);

  // Current active course object
  const activeCourse: CourseOption = useMemo(() => {
    return (
      activeCollege.courses.find((c) => c.id === activeCourseId) ||
      activeCollege.courses[0]
    );
  }, [activeCollege, activeCourseId]);

  // Handle selecting a college
  const handleSelectCollege = (college: College, courseId?: string) => {
    setActiveCollege(college);
    setActiveCourseId(courseId || college.defaultCourseId);
    // Automatically bring them to Analyzer dashboard
    setActiveTab('analyzer');
  };

  // Auth Page Success Handler
  const handleAuthSuccess = (account: GmailAccount, logo: ProfileLogoConfig) => {
    const updated: StudentProfile = {
      ...studentProfile,
      name: account.name,
      username: account.username,
      email: account.email,
      account,
      profileLogo: logo,
    };

    handleUpdateProfile(updated);
    setIsAuthPageOpen(false);
    setAuthSuccessToast(`Welcome, ${account.name}! Your admissions portfolio is securely synced.`);
    setTimeout(() => {
      setAuthSuccessToast(null);
    }, 4500);
  };

  // Calculated Real-Time Analytics
  const admissionAnalysis = useMemo(() => {
    return analyzeAdmissionChance(studentProfile, activeCollege, activeCourse.id);
  }, [studentProfile, activeCollege, activeCourse]);

  const financialAnalysis = useMemo(() => {
    return calculateFinancialAnalysis(
      studentProfile,
      activeCollege,
      activeCourse.id,
      inflationRate
    );
  }, [studentProfile, activeCollege, activeCourse, inflationRate]);

  // If user navigated to dedicated Auth Page
  if (isAuthPageOpen) {
    return (
      <AuthPage
        currentAccount={studentProfile.account}
        currentLogo={studentProfile.profileLogo}
        onSuccessAuth={handleAuthSuccess}
        onBackToDashboard={() => setIsAuthPageOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Auth Success Toast */}
      {authSuccessToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-950/90 border border-emerald-600/80 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{authSuccessToast}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        studentProfile={studentProfile}
        activeCollege={activeCollege}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenCollegeSearch={() => setIsCollegeSearchModalOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
        onOpenAuthPage={() => setIsAuthPageOpen(true)}
      />

      {/* Persistent Live Status Header */}
      <LiveStatusHeader
        college={activeCollege}
        studentProfile={studentProfile}
        admissionAnalysis={admissionAnalysis}
        financialAnalysis={financialAnalysis}
        activeCourseName={activeCourse.name}
        onOpenCollegeSearch={() => setIsCollegeSearchModalOpen(true)}
      />

      {/* Main Tab Navigation Bar */}
      <div className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-16 z-30 app-tab-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>🏠 College Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('admission')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'admission'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>📊 Admission Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'finance'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>💰 Financial Planner</span>
            </button>

            <button
              onClick={() => setActiveTab('cutoff')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'cutoff'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>📈 Cutoff & Competition</span>
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'compare'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>⚖️ College Comparison (By Affordable Fee)</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>🎯 Portfolio Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === 'report'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📄 AdmiGo Report (PDF)</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: COLLEGE ANALYZER */}
        {activeTab === 'analyzer' && (
          <div className="space-y-8">
            <ActiveCollegeOverview
              college={activeCollege}
              course={activeCourse}
              student={studentProfile}
              onOpenCollegeSearch={() => setIsCollegeSearchModalOpen(true)}
              onDownloadReport={() => setActiveTab('report')}
              onChangeCourse={setActiveCourseId}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-400" />
                    <span>Admission Diagnostic</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('admission')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>Full Breakdown</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <AdmissionChanceView
                  college={activeCollege}
                  course={activeCourse}
                  student={studentProfile}
                  admissionAnalysis={admissionAnalysis}
                  onChangeCourse={setActiveCourseId}
                />
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    <span>Financial & Cost Projection</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('finance')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>Full Planner</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <FinancialPlannerView
                  college={activeCollege}
                  student={studentProfile}
                  financialAnalysis={financialAnalysis}
                  inflationRate={inflationRate}
                  onInflationChange={setInflationRate}
                />
              </div>
            </div>

            <PersonalizedReportView
              college={activeCollege}
              course={activeCourse}
              student={studentProfile}
              admissionAnalysis={admissionAnalysis}
              financialAnalysis={financialAnalysis}
              inflationRate={inflationRate}
            />

            <div className="pt-4 border-t border-slate-800">
              <CollegeSelector
                colleges={INDIAN_COLLEGES_DATABASE}
                activeCollege={activeCollege}
                studentProfile={studentProfile}
                onSelectCollege={handleSelectCollege}
              />
            </div>
          </div>
        )}

        {/* TAB 2: ADMISSION ANALYSIS */}
        {activeTab === 'admission' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">
                Detailed Admission Analysis
              </h2>
              <p className="text-xs text-slate-400">
                Exam performance, category cutoff benchmarks, historical drift, and admission indicators for {activeCollege.name}.
              </p>
            </div>

            <AdmissionChanceView
              college={activeCollege}
              course={activeCourse}
              student={studentProfile}
              admissionAnalysis={admissionAnalysis}
              onChangeCourse={setActiveCourseId}
            />

            <CutoffVolatilityView
              college={activeCollege}
              course={activeCourse}
              student={studentProfile}
            />
          </div>
        )}

        {/* TAB 3: FINANCIAL PLANNER */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">
                Comprehensive Financial Planner (₹ Indian Rupees)
              </h2>
              <p className="text-xs text-slate-400">
                Breakdown of tuition fees, campus hostel charges, government fee waivers, and 4-year cumulative inflation models.
              </p>
            </div>

            <FinancialPlannerView
              college={activeCollege}
              course={activeCourse}
              student={studentProfile}
              financialAnalysis={financialAnalysis}
              inflationRate={inflationRate}
              onInflationChange={setInflationRate}
              onChangeCourse={setActiveCourseId}
            />
          </div>
        )}

        {/* TAB 4: CUTOFF & COMPETITION */}
        {activeTab === 'cutoff' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white">
                Cutoff Trends & Competition Volatility
              </h2>
              <p className="text-xs text-slate-400">
                Historical multi-year JoSAA / State counselling movements and applicant competition forecast.
              </p>
            </div>

            <CutoffVolatilityView
              college={activeCollege}
              course={activeCourse}
              student={studentProfile}
            />
          </div>
        )}

        {/* TAB 5: COLLEGE COMPARISON (BY AFFORDABLE FEE) */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <CollegeComparisonView
              colleges={INDIAN_COLLEGES_DATABASE}
              student={studentProfile}
              activeCollege={activeCollege}
              onSelectActiveCollege={(col) => setActiveCollege(col)}
            />
          </div>
        )}

        {/* TAB 6: PORTFOLIO BUILDER */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <PortfolioBuilderView
              colleges={INDIAN_COLLEGES_DATABASE}
              student={studentProfile}
              activeCollege={activeCollege}
              onSelectActiveCollege={(col) => {
                setActiveCollege(col);
                setActiveTab('analyzer');
              }}
              onUpdateApplicationBudget={(newBudget) => {
                const updated = {
                  ...studentProfile,
                  applicationBudget: newBudget,
                };
                handleUpdateProfile(updated);
              }}
            />
          </div>
        )}

        {/* TAB 7: REPORT */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <PersonalizedReportView
              college={activeCollege}
              course={activeCourse}
              student={studentProfile}
              admissionAnalysis={admissionAnalysis}
              financialAnalysis={financialAnalysis}
              inflationRate={inflationRate}
            />
          </div>
        )}
      </main>

      {/* Footer & Persistent Data Disclaimer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Demo Application Disclaimer</span>
            </div>
            <p>
              College fees, cutoffs, scholarships, admission indicators and projections shown in this prototype are simulated/demo data and are not official admission information. Students should verify current fees, cutoffs, counselling rules and eligibility requirements from the respective official college/admission authority.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-300 tracking-tight">AdmiGo</span>
              <span>·</span>
              <span>Indian College Admission & Financial Portfolio Analyzer</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDisclaimerModalOpen(true)}
                className="hover:text-slate-300 transition-colors"
              >
                Simulation Methodology
              </button>
              <span>·</span>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="hover:text-slate-300 transition-colors"
              >
                Change Profile
              </button>
              <span>·</span>
              <button
                onClick={() => setIsAuthPageOpen(true)}
                className="hover:text-slate-300 transition-colors"
              >
                Sign In / Register
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={studentProfile}
        currentTheme={theme}
        onSaveProfile={handleUpdateProfile}
        onThemeChange={(newTheme) => setTheme(newTheme)}
        onOpenAuthPage={() => {
          setIsProfileModalOpen(false);
          setIsAuthPageOpen(true);
        }}
      />

      <CollegeSelector
        colleges={INDIAN_COLLEGES_DATABASE}
        activeCollege={activeCollege}
        studentProfile={studentProfile}
        onSelectCollege={handleSelectCollege}
        isOpenModal={isCollegeSearchModalOpen}
        onCloseModal={() => setIsCollegeSearchModalOpen(false)}
      />

      <DisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
      />
    </div>
  );
}
