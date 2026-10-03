import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  User,
  GraduationCap,
  IndianRupee,
  Home,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
  Palette,
  Mail,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import {
  AppTheme,
  EntranceExamType,
  GmailAccount,
  PreferredLocation,
  ProfileLogoConfig,
  ProfileLogoIcon,
  StudentCategory,
  StudentProfile,
} from '../types';
import { ENTRANCE_EXAMS_LIST, INDIAN_STATES } from '../data/colleges';
import { formatINR, formatLakh } from '../utils/calculations';
import { ProfileAvatar, AVATAR_ICONS, AVATAR_GRADIENTS } from './ProfileAvatar';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (updatedProfile: StudentProfile) => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onOpenAuthPage?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  currentTheme,
  onThemeChange,
  onOpenAuthPage,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [showEmailInputForm, setShowEmailInputForm] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState(profile.username || '');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const currentExamConfig =
    ENTRANCE_EXAMS_LIST.find((e) => e.id === formData.entranceExam) ||
    ENTRANCE_EXAMS_LIST[0];

  const handleExamChange = (examId: EntranceExamType) => {
    let defaultScore = formData.examScore;
    let defaultRank = formData.expectedRank;

    if (examId === 'TNEA') {
      defaultScore = 198.5;
    } else if (examId === 'MHT CET') {
      defaultScore = 99.8;
    } else if (examId === 'BITSAT') {
      defaultScore = 320;
    } else if (examId === 'JEE Advanced') {
      defaultRank = 150;
      defaultScore = 240;
    } else if (examId === 'JEE Main') {
      defaultRank = 1500;
      defaultScore = 99.85;
    }

    setFormData({
      ...formData,
      entranceExam: examId,
      examScore: defaultScore,
      expectedRank: defaultRank,
    });
  };

  // Google / Gmail Sign In Handlers
  const handleGoogleSignIn = (emailAddress?: string) => {
    setIsSigningIn(true);
    setAuthError('');

    setTimeout(() => {
      const email = emailAddress || 'bharanidharman@gmail.com';
      const name = formData.name || 'Bharanidharman';
      const account: GmailAccount = {
        email,
        name,
        username: email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f46e5`,
        signedInAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        provider: 'google',
        isVerified: true,
      };

      const updated = {
        ...formData,
        email,
        name,
        account,
      };

      setFormData(updated);
      onSaveProfile(updated);
      setIsSigningIn(false);
      setShowEmailInputForm(false);
    }, 400);
  };

  const handleCustomGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setAuthError('Please enter a valid Gmail address.');
      return;
    }
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail.includes('@gmail.com') && !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid @gmail.com address.');
      return;
    }
    handleGoogleSignIn(cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`);
  };

  const handleSignOut = () => {
    const updated: StudentProfile = {
      ...formData,
      email: undefined,
      account: null,
    };
    setFormData(updated);
    onSaveProfile(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const currentLogoConfig: ProfileLogoConfig = formData.profileLogo || {
    icon: 'graduation-cap',
    gradient: 'from-indigo-500 to-violet-600',
  };

  const themeList: {
    id: AppTheme;
    name: string;
    description: string;
    colors: [string, string, string];
  }[] = [
    {
      id: 'champagne-gold',
      name: 'Sovereign 24K Gold & Obsidian',
      description: 'Warm Obsidian, 24K Gold & Ivory (Default)',
      colors: ['#090a0f', '#12141e', '#f59e0b'],
    },
    {
      id: 'imperial-sapphire',
      name: 'Imperial Sapphire & Cyan',
      description: 'Deep Velvet Navy, Royal Cobalt & Electric Cyan',
      colors: ['#020617', '#09132b', '#38bdf8'],
    },
    {
      id: 'regal-emerald',
      name: 'Emerald Monarch & Golden Jade',
      description: 'Aristocratic Pine, Lustrous Jade & Fine Brass',
      colors: ['#02120b', '#062116', '#10b981'],
    },
    {
      id: 'rose-bordeaux',
      name: 'Sunset Crimson & Coral Flame',
      description: 'Velvet Cabernet Noir, Ruby Crimson & Coral Amber',
      colors: ['#110408', '#1e0812', '#f43f5e'],
    },
    {
      id: 'nordic-titanium',
      name: 'Cosmic Amethyst & Neon Violet',
      description: 'Galactic Obsidian, Electric Violet & Neon Cyan',
      colors: ['#090314', '#140726', '#a855f7'],
    },
    {
      id: 'alabaster-light',
      name: 'Pristine Daylight (Light Theme)',
      description: 'High-contrast clean white, deep slate & royal blue (100% visible)',
      colors: ['#f8fafc', '#ffffff', '#2563eb'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <ProfileAvatar logo={currentLogoConfig} size="md" />
            <div>
              <h2 className="text-lg font-bold text-white">AdmiGo Student Profile & Preferences</h2>
              <p className="text-xs text-slate-400">
                Customize your profile emblem, elegant themes, and academic admission criteria.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* SECTION 0: GMAIL SIGN IN & DEDICATED AUTH PAGE TRIGGER */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google / Gmail Account</span>
              </div>

              {formData.account?.email && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Gmail
                </span>
              )}
            </div>

            {formData.account?.email ? (
              /* Signed In State */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <ProfileAvatar logo={currentLogoConfig} size="md" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {formData.account.name}
                      </span>
                      {formData.account.username && (
                        <span className="text-[10px] text-indigo-400 font-mono">
                          @{formData.account.username}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-indigo-300 font-mono block">
                      {formData.account.email}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Synced on {formData.account.signedInAt} · Portfolios preserved
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenAuthPage && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAuthPage();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 text-xs font-medium transition-all"
                    >
                      Manage Account
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/60 text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Not Signed In State */
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Sign in or create an account with username, Gmail, and password to save your admission portfolio.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Button to go to dedicated Auth Page */}
                  {onOpenAuthPage && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAuthPage();
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Go to Full Sign In / Sign Up Page</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Quick Google Button */}
                  <button
                    type="button"
                    onClick={() => handleGoogleSignIn('bharanidharman@gmail.com')}
                    disabled={isSigningIn}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <span>{isSigningIn ? 'Connecting...' : 'One-Click Gmail'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEmailInputForm(!showEmailInputForm)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    {showEmailInputForm ? 'Cancel' : 'Other Email'}
                  </button>
                </div>

                {showEmailInputForm && (
                  <div className="p-3 bg-slate-900 border border-slate-700/80 rounded-xl space-y-2">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      Enter your Gmail address:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleCustomGmailSubmit}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Sign In
                      </button>
                    </div>
                    {authError && <p className="text-[11px] text-rose-400">{authError}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================
              SECTION 0.5: CUSTOMIZE PROFILE LOGO / EMBLEM
              ======================================================== */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>Customize Profile Logo / Emblem</span>
              </div>
              <ProfileAvatar logo={currentLogoConfig} size="sm" />
            </div>

            {/* Emblem selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Emblem Mascot:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_ICONS.map(({ id, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => {
                      const updatedLogo: ProfileLogoConfig = {
                        ...currentLogoConfig,
                        icon: id,
                        customInitials: undefined,
                      };
                      setFormData({ ...formData, profileLogo: updatedLogo });
                    }}
                    title={label}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      currentLogoConfig.icon === id && !currentLogoConfig.customInitials
                        ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200 ring-2 ring-indigo-500/40'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] truncate w-full text-center">{label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Emblem Gradient:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_GRADIENTS.map(({ id, label, preview }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => {
                      const updatedLogo: ProfileLogoConfig = {
                        ...currentLogoConfig,
                        gradient: id,
                      };
                      setFormData({ ...formData, profileLogo: updatedLogo });
                    }}
                    title={label}
                    className={`h-7 rounded-xl ${preview} transition-all border ${
                      currentLogoConfig.gradient === id
                        ? 'ring-2 ring-white scale-105 border-white shadow-lg'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 0.6: VIBRANT APPLICATION THEMES
              ======================================================== */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Application Theme (Elegant Color Palettes)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Active: {themeList.find((t) => t.id === currentTheme)?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {themeList.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    type="button"
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-400/80 ring-2 ring-indigo-500/40 shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          {theme.name}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {theme.description}
                      </span>
                    </div>

                    {/* Color Swatch Trio */}
                    <div className="flex items-center gap-1 shrink-0 p-1 rounded-lg bg-slate-950 border border-slate-800">
                      {theme.colors.map((c, idx) => (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded-md border border-white/20"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 1: Academic Performance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300 border-b border-slate-800/80 pb-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Academic & Entrance Exam Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Class 10 Percentage */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Class 10 Board Percentage (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  step="0.1"
                  value={formData.class10Percent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class10Percent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Class 12 Percentage */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Class 12 Board Percentage (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  step="0.1"
                  value={formData.class12Percent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      class12Percent: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Primary Entrance Exam Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Primary Entrance Exam
                </label>
                <select
                  value={formData.entranceExam}
                  onChange={(e) =>
                    handleExamChange(e.target.value as EntranceExamType)
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ENTRANCE_EXAMS_LIST.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Admission Year */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Admission Year
                </label>
                <select
                  value={formData.targetAdmissionYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetAdmissionYear: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={2025}>2025 (Current Cycle)</option>
                  <option value={2026}>2026 (Next Academic Year)</option>
                  <option value={2027}>2027</option>
                </select>
              </div>

              {/* Dynamic Exam Score / Percentile */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    {currentExamConfig.defaultMetricLabel}
                  </label>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    Max: {currentExamConfig.maxScale}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.examScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      examScore: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder={currentExamConfig.scorePlaceholder}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Expected Rank */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Expected All-India / State Merit Rank
                </label>
                <input
                  type="number"
                  min="1"
                  max="1500000"
                  value={formData.expectedRank}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedRank: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  placeholder="e.g. 1500"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Personal & Category Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300 border-b border-slate-800/80 pb-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Student & Reservation Category</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Home State */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Home State (Domicile Quota)
                </label>
                <select
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category (General, OBC, SC, ST, EWS) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reservation Category
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['General', 'OBC', 'SC', 'ST', 'EWS'] as StudentCategory[]).map(
                    (cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() =>
                          setFormData({ ...formData, category: cat })
                        }
                        className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all ${
                          formData.category === cat
                            ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Preferred Location */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Preferred College Location
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Any', 'Same State', 'Other State'] as PreferredLocation[]).map(
                    (loc) => (
                      <button
                        type="button"
                        key={loc}
                        onClick={() =>
                          setFormData({ ...formData, preferredLocation: loc })
                        }
                        className={`py-2 px-1 text-center rounded-lg text-xs font-medium transition-all ${
                          formData.preferredLocation === loc
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {loc}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Hostel Required Toggle */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hostel & Mess Accommodation Required?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, hostelRequired: true })
                    }
                    className={`py-2 px-3 text-center rounded-lg text-xs font-medium transition-all ${
                      formData.hostelRequired
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Yes (Add Hostel Fee)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, hostelRequired: false })
                    }
                    className={`py-2 px-3 text-center rounded-lg text-xs font-medium transition-all ${
                      !formData.hostelRequired
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    No (Day Scholar)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Financial & Family Budget */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-300 border-b border-slate-800/80 pb-2">
              <IndianRupee className="w-4 h-4 text-indigo-400" />
              <span>Family Income & College Budget</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Annual Family Income */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Annual Family Income
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-300">
                    {formatLakh(formData.annualFamilyIncome)}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="10000000"
                  step="25000"
                  value={formData.annualFamilyIncome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      annualFamilyIncome: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                />
              </div>

              {/* Annual Education Budget */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Annual Education Budget (Affordable Fee)
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    {formatLakh(formData.annualEducationBudget)}/yr
                  </span>
                </div>
                <input
                  type="number"
                  min="20000"
                  max="2000000"
                  step="10000"
                  value={formData.annualEducationBudget}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      annualEducationBudget: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile & Apply Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
