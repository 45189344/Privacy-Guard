import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'teal-glow';
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  interactive = false,
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white/70 dark:bg-midnight-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-glass-sm dark:shadow-glass-md',
    elevated:
      'bg-white/85 dark:bg-midnight-850/80 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-glass-md dark:shadow-glass-lg',
    subtle:
      'bg-slate-50/60 dark:bg-midnight-950/40 backdrop-blur-md border border-slate-200/50 dark:border-white/5',
    'teal-glow':
      'bg-white/75 dark:bg-midnight-900/70 backdrop-blur-xl border border-teal-500/30 dark:border-teal-400/25 shadow-teal-glow',
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-teal-500/40 dark:hover:border-teal-400/40'
    : '';

  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-2xl overflow-hidden',
          variantStyles[variant],
          interactiveStyles,
          className
        )
      )}
      {...props}
    >
      {/* Subtle top edge liquid reflection highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
