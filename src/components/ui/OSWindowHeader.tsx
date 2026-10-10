import React from 'react';

interface OSWindowHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}

export const OSWindowHeader: React.FC<OSWindowHeaderProps> = ({
  title,
  subtitle,
  badge,
  onClose,
  onMinimize,
  onMaximize,
  className = '',
}) => {
  return (
    <div
      className={`px-4 py-3 flex items-center justify-between border-b border-electric-teal/15 bg-midnight-900/80 backdrop-blur-md select-none rounded-t-2xl ${className}`}
    >
      {/* Traffic Light Micro-Buttons */}
      <div className="flex items-center gap-2 group/dots">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close window"
          title="Close window"
          className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-400 border border-rose-600/60 shadow-sm transition-transform hover:scale-110 flex items-center justify-center text-[8px] text-rose-950 font-bold opacity-90 group-hover/dots:opacity-100"
        >
          <span className="opacity-0 hover:opacity-100 leading-none">×</span>
        </button>
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Minimize window"
          title="Minimize window"
          className="w-3 h-3 rounded-full bg-amber-400 hover:bg-amber-300 border border-amber-500/60 shadow-sm transition-transform hover:scale-110 flex items-center justify-center text-[8px] text-amber-950 font-bold opacity-90 group-hover/dots:opacity-100"
        >
          <span className="opacity-0 hover:opacity-100 leading-none">−</span>
        </button>
        <button
          type="button"
          onClick={onMaximize}
          aria-label="Maximize window"
          title="Expand window"
          className="w-3 h-3 rounded-full bg-emerald-neon hover:bg-emerald-400 border border-emerald-500/60 shadow-sm transition-transform hover:scale-110 flex items-center justify-center text-[8px] text-emerald-950 font-bold opacity-90 group-hover/dots:opacity-100"
        >
          <span className="opacity-0 hover:opacity-100 leading-none">+</span>
        </button>
      </div>

      {/* Center Title & Status */}
      <div className="flex items-center gap-2 text-center min-w-0 px-2">
        <span className="text-xs font-bold text-slate-200 tracking-wide truncate">
          {title}
        </span>
        {subtitle && (
          <span className="hidden sm:inline-block text-[11px] text-slate-400 font-mono">
            — {subtitle}
          </span>
        )}
      </div>

      {/* Right Badge / Enclave indicator */}
      <div className="flex items-center gap-1.5">
        {badge ? (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-electric-teal/10 text-electric-teal border border-electric-teal/30">
            {badge}
          </span>
        ) : (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-neon/90 bg-emerald-neon/10 px-2 py-0.5 rounded-full border border-emerald-neon/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-neon animate-pulse" />
            <span className="hidden sm:inline">SECURE</span>
          </div>
        )}
      </div>
    </div>
  );
};
