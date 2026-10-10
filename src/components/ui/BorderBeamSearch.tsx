import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Command } from 'lucide-react';
import { clsx } from 'clsx';

interface BorderBeamSearchProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
  id?: string;
}

export const BorderBeamSearch: React.FC<BorderBeamSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search requests by ID, category, or keyword...',
  isLoading = false,
  className = '',
  id = 'global-beam-search',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' or 'Cmd/Ctrl+K')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={clsx(
        'relative group rounded-xl p-[1px] transition-all duration-300 ease-out',
        isFocused ? 'scale-[1.01]' : '',
        className
      )}
    >
      {/* Animated Luminous Border Beam Effect */}
      <div
        className={clsx(
          'absolute inset-0 rounded-xl overflow-hidden pointer-events-none transition-opacity duration-300',
          isFocused ? 'opacity-100' : 'opacity-40 group-hover:opacity-75'
        )}
      >
        <div
          className="absolute -inset-[200%] bg-[conic-gradient(from_0deg,transparent_0_320deg,#14b8a6_340deg,#38bdf8_355deg,transparent_360deg)] animate-[spin_4s_linear_infinite]"
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Glass Search Input Container */}
      <div className="relative flex items-center w-full bg-white/90 dark:bg-midnight-900/90 backdrop-blur-xl rounded-[11px] px-3.5 py-2.5 shadow-sm border border-slate-200/60 dark:border-white/10 z-10">
        <Search className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mr-2.5 transition-transform group-hover:scale-110" />

        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />

        <div className="flex items-center space-x-1.5 ml-2 shrink-0">
          {isLoading && (
            <Loader2 className="w-4 h-4 text-teal-500 animate-spin mr-1" aria-label="Searching..." />
          )}

          {value && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {!value && (
            <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-midnight-800 rounded border border-slate-200 dark:border-white/10">
              <Command className="w-3 h-3" />
              <span>K</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
