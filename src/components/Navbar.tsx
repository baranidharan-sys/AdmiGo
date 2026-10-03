import React from 'react';
import {
  GraduationCap,
  SlidersHorizontal,
  Search,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  Lock,
} from 'lucide-react';
import { College, StudentProfile } from '../types';
import { ProfileAvatar } from './ProfileAvatar';

interface NavbarProps {
  studentProfile: StudentProfile;
  activeCollege: College;
  onOpenProfile: () => void;
  onOpenCollegeSearch: () => void;
  onOpenDisclaimer: () => void;
  onOpenAuthPage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  studentProfile,
  activeCollege,
  onOpenProfile,
  onOpenCollegeSearch,
  onOpenDisclaimer,
  onOpenAuthPage,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 text-white shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight admigo-brand-title">
                  AdmiGo
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/70 border border-indigo-700/50 text-indigo-300">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  India 2025-26
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate hidden md:block">
                Indian College Admission & Financial Portfolio Analyzer
              </p>
            </div>
          </div>

          {/* Quick Active College Switcher */}
          <div className="hidden lg:flex items-center gap-2 max-w-sm">
            <button
              onClick={onOpenCollegeSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/70 text-xs text-slate-300 hover:text-white hover:border-indigo-500/50 transition-colors group text-left"
              title="Change active college"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Active College</span>
                <span className="font-medium text-slate-200 group-hover:text-indigo-200 truncate block">
                  {activeCollege.shortName}
                </span>
              </div>
            </button>
          </div>

          {/* Student Profile & Gmail Account Quick Trigger & Demo Notice */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenDisclaimer}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 hover:bg-amber-950/50 text-xs transition-colors"
              title="Important simulation disclaimer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Notice</span>
            </button>

            <button
              onClick={onOpenCollegeSearch}
              className="lg:hidden flex items-center justify-center p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Search Colleges"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* If not logged in, show dedicated Sign In / Register button */}
            {!studentProfile.account?.email && onOpenAuthPage && (
              <button
                onClick={onOpenAuthPage}
                className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            )}

            {/* Profile & Google Account Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition-all shadow-sm group"
            >
              {studentProfile.account?.email ? (
                /* Signed In Google Indicator with Customized Profile Emblem */
                <div className="flex items-center gap-2">
                  <ProfileAvatar logo={studentProfile.profileLogo} size="sm" />
                  <div className="text-left hidden sm:block">
                    <span className="text-[10px] text-emerald-400 uppercase font-mono block leading-none">
                      ● Gmail Verified
                    </span>
                    <span className="font-semibold text-white truncate max-w-[120px] block leading-snug">
                      {studentProfile.account.username || studentProfile.account.name || 'Student'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Not Signed In Indicator with Customized Profile Emblem */
                <div className="flex items-center gap-2">
                  <ProfileAvatar logo={studentProfile.profileLogo} size="sm" />
                  <div className="text-left hidden sm:block">
                    <span className="text-[10px] text-indigo-400 uppercase font-mono block leading-none">
                      Student Profile
                    </span>
                    <span className="font-semibold text-white">
                      Profile & Theme
                    </span>
                  </div>
                  <span className="sm:hidden font-medium">Profile</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
