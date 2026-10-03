import React from 'react';
import { ShieldAlert, X, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">
              Official Admission Disclaimer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs text-amber-200 leading-relaxed space-y-2">
          <p className="font-semibold text-amber-300">
            Important Notice for Students and Parents:
          </p>
          <p>
            <strong>Demo Application:</strong> College fees, cutoffs, scholarships, admission indicators and projections shown in this prototype are simulated/demo data and are not official admission information. Students should verify current fees, cutoffs, counselling rules and eligibility requirements from the respective official college/admission authority.
          </p>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <h4 className="font-semibold text-white">Recommended Verification Steps:</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>
              Visit the official counselling portals (e.g. <strong>josaa.nic.in</strong>, <strong>tneaonline.org</strong>, <strong>cetcell.mahacet.org</strong>, <strong>kea.kar.nic.in</strong>).
            </li>
            <li>
              Review the official JoSAA / CSAB Opening and Closing Ranks for category quotas (General, OBC-NCL, SC, ST, EWS).
            </li>
            <li>
              Confirm current academic year tuition and mess fees directly from the respective college website.
            </li>
          </ul>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
