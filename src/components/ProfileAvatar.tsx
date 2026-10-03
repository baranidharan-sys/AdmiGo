import React from 'react';
import {
  GraduationCap,
  Rocket,
  Atom,
  Code,
  Award,
  Sparkles,
  BookOpen,
  Crown,
  User,
} from 'lucide-react';
import { ProfileLogoConfig, ProfileLogoIcon } from '../types';

interface ProfileAvatarProps {
  logo?: ProfileLogoConfig;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AVATAR_ICONS: { id: ProfileLogoIcon; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'graduation-cap', label: 'Scholar Cap', icon: GraduationCap },
  { id: 'rocket', label: 'Engineer Rocket', icon: Rocket },
  { id: 'atom', label: 'Researcher Atom', icon: Atom },
  { id: 'code', label: 'Tech Coder', icon: Code },
  { id: 'award', label: 'Honor Trophy', icon: Award },
  { id: 'sparkles', label: 'Star Achiever', icon: Sparkles },
  { id: 'book-open', label: 'Scholar Book', icon: BookOpen },
  { id: 'crown', label: 'Leader Crown', icon: Crown },
];

export const AVATAR_GRADIENTS = [
  { id: 'from-cyan-500 to-blue-600', label: 'Electric Cyan', preview: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
  { id: 'from-indigo-500 to-violet-600', label: 'Royal Violet', preview: 'bg-gradient-to-r from-indigo-500 to-violet-600' },
  { id: 'from-emerald-400 to-teal-600', label: 'Aurora Emerald', preview: 'bg-gradient-to-r from-emerald-400 to-teal-600' },
  { id: 'from-rose-500 to-amber-500', label: 'Sunset Coral', preview: 'bg-gradient-to-r from-rose-500 to-amber-500' },
  { id: 'from-purple-500 to-pink-500', label: 'Cosmic Fuchsia', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'from-amber-400 to-orange-600', label: 'Imperial Gold', preview: 'bg-gradient-to-r from-amber-400 to-orange-600' },
  { id: 'from-blue-600 to-indigo-900', label: 'Deep Sapphire', preview: 'bg-gradient-to-r from-blue-600 to-indigo-900' },
  { id: 'from-red-600 to-rose-700', label: 'Crimson Flame', preview: 'bg-gradient-to-r from-red-600 to-rose-700' },
];

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  logo,
  name = 'Student',
  size = 'md',
  className = '',
}) => {
  const iconId = logo?.icon || 'graduation-cap';
  const gradient = logo?.gradient || 'from-indigo-500 to-violet-600';
  const IconComponent = AVATAR_ICONS.find((i) => i.id === iconId)?.icon || GraduationCap;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10',
  }[size];

  if (logo?.customInitials) {
    return (
      <div
        className={`${sizeClasses} rounded-xl bg-gradient-to-br ${gradient} shadow-lg text-white font-extrabold flex items-center justify-center shrink-0 border border-white/20 select-none ${className}`}
      >
        {logo.customInitials.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-xl bg-gradient-to-br ${gradient} shadow-lg text-white flex items-center justify-center shrink-0 border border-white/20 select-none ${className}`}
    >
      <IconComponent className={iconSizes} />
    </div>
  );
};
