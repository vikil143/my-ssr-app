import React from 'react';

const toneClasses = {
  cyan:    'border-[#0052CC]/20 bg-[#DEEBFF] text-[#0052CC] dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300',
  emerald: 'border-[#00875A]/20 bg-[#E3FCEF] text-[#00875A] dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300',
  fuchsia: 'border-[#6554C0]/20 bg-[#EAE6FF] text-[#6554C0] dark:border-purple-400/30 dark:bg-purple-400/10 dark:text-purple-300',
  rose:    'border-[#DE350B]/20 bg-[#FFEBE6] text-[#DE350B] dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300',
};

export default function Badge({ children, tone = 'cyan' }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toneClasses[tone] || toneClasses.cyan}`}
    >
      {children}
    </span>
  );
}
