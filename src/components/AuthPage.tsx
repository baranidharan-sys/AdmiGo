import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Palette,
  AlertCircle,
} from 'lucide-react';
import { GmailAccount, ProfileLogoConfig, ProfileLogoIcon } from '../types';
import { ProfileAvatar, AVATAR_ICONS, AVATAR_GRADIENTS } from './ProfileAvatar';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  currentAccount?: GmailAccount | null;
  currentLogo?: ProfileLogoConfig;
  onSuccessAuth: (account: GmailAccount, logo: ProfileLogoConfig) => void;
  onBackToDashboard: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signup',
  currentAccount,
  currentLogo,
  onSuccessAuth,
  onBackToDashboard,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form Fields
  const [username, setUsername] = useState(
    currentAccount?.username || 'karthik_scholar'
  );
  const [name, setName] = useState(currentAccount?.name || 'Karthik Raman');
  const [gmail, setGmail] = useState(
    currentAccount?.email || 'karthik.raman@gmail.com'
  );
  const [password, setPassword] = useState('pass1234');
  const [confirmPassword, setConfirmPassword] = useState('pass1234');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Logo Customization
  const [selectedIcon, setSelectedIcon] = useState<ProfileLogoIcon>(
    currentLogo?.icon || 'graduation-cap'
  );
  const [selectedGradient, setSelectedGradient] = useState<string>(
    currentLogo?.gradient || 'from-indigo-500 to-violet-600'
  );
  const [customInitials, setCustomInitials] = useState<string>(
    currentLogo?.customInitials || ''
  );

  const previewLogo: ProfileLogoConfig = {
    icon: selectedIcon,
    gradient: selectedGradient,
    customInitials: customInitials.trim() ? customInitials.trim() : undefined,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!gmail.toLowerCase().includes('@')) {
      setErrorMessage('Please enter a valid Gmail or email address (e.g. name@gmail.com).');
      return;
    }

    if (!username.trim()) {
      setErrorMessage('Please provide a valid username.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password should be at least 4 characters long.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const authenticatedAccount: GmailAccount = {
        username: username.trim(),
        name: name.trim() || username.trim(),
        email: gmail.trim().toLowerCase(),
        avatarIcon: selectedIcon,
        avatarGradient: selectedGradient,
        signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: gmail.toLowerCase().includes('gmail.com') ? 'google' : 'credentials',
        isVerified: true,
      };

      onSuccessAuth(authenticatedAccount, previewLogo);
      setIsSubmitting(false);
    }, 600);
  };

  const handleQuickGoogleSignIn = (targetEmail = 'bharanidharman@gmail.com') => {
    setIsSubmitting(true);
    setTimeout(() => {
      const authenticatedAccount: GmailAccount = {
        username: targetEmail.split('@')[0],
        name: 'Bharani Dharman',
        email: targetEmail,
        avatarIcon: 'graduation-cap',
        avatarGradient: 'from-cyan-500 to-blue-600',
        signedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'google',
        isVerified: true,
      };

      const defaultGoogleLogo: ProfileLogoConfig = {
        icon: 'graduation-cap',
        gradient: 'from-cyan-500 to-blue-600',
      };

      onSuccessAuth(authenticatedAccount, defaultGoogleLogo);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top back button */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AdmiGo Student Portal</span>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6 relative z-10">
        {/* Header with Mode Toggle */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <ProfileAvatar logo={previewLogo} size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mode === 'signup' ? 'Create Student Account' : 'Student Portal Sign In'}
          </h1>
          <p className="text-xs text-slate-400">
            Securely save and synchronize your admission chances, cutoff tracking, and fee portfolio across devices.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 mt-3">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up (New Student)
            </button>
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In (Existing)
            </button>
          </div>
        </div>

        {/* Quick Google / Gmail Auth Action */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => handleQuickGoogleSignIn('bharanidharman@gmail.com')}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-700/80 hover:border-slate-600 text-white text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-md group"
          >
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
            <span>Continue with One-Click Google (Gmail)</span>
            <span className="text-[10px] text-indigo-400 font-mono hidden sm:inline">
              (bharanidharman@gmail.com)
            </span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] uppercase font-mono text-slate-500">
              Or enter student credentials below
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* The Form: username, gmail, password, plus logo customization */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Username:
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. karthik_raman"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Gmail / Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gmail Account:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  placeholder="e.g. student@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Student Full Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Raman"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {mode === 'signup' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-end pb-1">
                <span className="text-[11px] text-slate-500">
                  Demo Auth: Credentials will be securely stored in your browser session.
                </span>
              </div>
            )}
          </div>

          {/* ========================================================
              PROFILE LOGO CUSTOMIZER (CUSTOM LOGO FEATURE)
              ======================================================== */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>Customize Your Student Profile Logo</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Shown on your admissions portfolio
              </span>
            </div>

            {/* 1. Choose Icon */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                1. Select Emblem / Mascot:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_ICONS.map(({ id, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => {
                      setSelectedIcon(id);
                      setCustomInitials('');
                    }}
                    title={label}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                      selectedIcon === id && !customInitials
                        ? 'bg-indigo-950/80 border-indigo-400 text-indigo-200 ring-2 ring-indigo-500/40'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] truncate w-full text-center">{label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Choose Color Gradient */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                2. Select Emblem Gradient:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_GRADIENTS.map(({ id, label, preview }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setSelectedGradient(id)}
                    title={label}
                    className={`h-8 rounded-xl ${preview} transition-all border ${
                      selectedGradient === id
                        ? 'ring-2 ring-white scale-105 border-white shadow-lg'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 3. Optional Custom Initials */}
            <div className="flex items-center gap-3 pt-1">
              <label className="text-[11px] text-slate-400 font-medium whitespace-nowrap">
                Or Use Custom Initials:
              </label>
              <input
                type="text"
                maxLength={3}
                value={customInitials}
                onChange={(e) => setCustomInitials(e.target.value.toUpperCase())}
                placeholder="e.g. KR"
                className="w-20 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-center text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
              />
              <span className="text-[10px] text-slate-500">
                (Replaces icon with lettermark monogram)
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Authenticating...'
                  : mode === 'signup'
                  ? 'Complete Registration & Go to Dashboard'
                  : 'Sign In to Student Dashboard'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
