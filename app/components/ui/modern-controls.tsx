'use client';

import React from 'react';
import { Search, X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';

// Modern Checkbox Component
interface ModernCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'indigo';
  disabled?: boolean;
}

export function ModernCheckbox({
  checked,
  onChange,
  label,
  color = 'purple',
  disabled = false
}: ModernCheckboxProps) {
  const colorClasses = {
    purple: 'border-purple-400/70 bg-purple-500/20 text-purple-400 shadow-purple-500/20',
    green: 'border-green-400/70 bg-green-500/20 text-green-400 shadow-green-500/20',
    blue: 'border-blue-400/70 bg-blue-500/20 text-blue-400 shadow-blue-500/20',
    amber: 'border-amber-400/70 bg-amber-500/20 text-amber-400 shadow-amber-500/20',
    indigo: 'border-indigo-400/70 bg-indigo-500/20 text-indigo-400 shadow-indigo-500/20'
  };

  const checkedBgClasses = {
    purple: 'bg-purple-500/10 border-purple-400/60',
    green: 'bg-green-500/10 border-green-400/60',
    blue: 'bg-blue-500/10 border-blue-400/60',
    amber: 'bg-amber-500/10 border-amber-400/60',
    indigo: 'bg-indigo-500/10 border-indigo-400/60'
  };

  return (
    <label className={cn(
      "group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border",
      checked
        ? `${checkedBgClasses[color]} shadow-sm`
        : "border-transparent hover:bg-gray-700/40 hover:border-gray-500/30",
      disabled && "opacity-50 cursor-not-allowed",
      "hover:scale-[1.01] active:scale-[0.99]"
    )}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div className={cn(
          "w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center",
          checked
            ? `${colorClasses[color]} shadow-sm`
            : "border-gray-500 bg-gray-700/50 group-hover:border-gray-400"
        )}>
          {checked && (
            <Check size={12} className="text-current transition-all duration-200" />
          )}
        </div>
      </div>
      <span className={cn(
        "text-sm transition-colors duration-200 select-none font-medium flex-1",
        checked ? "text-white" : "text-gray-200 group-hover:text-white"
      )}>
        {label}
      </span>
    </label>
  );
}

// Modern Radio Button Component
interface ModernRadioProps {
  selected: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'indigo';
  disabled?: boolean;
}

export function ModernRadio({
  selected,
  onChange,
  label,
  description,
  color = 'purple',
  disabled = false
}: ModernRadioProps) {
  const colorClasses = {
    purple: 'border-purple-400 bg-purple-500/20',
    green: 'border-green-400 bg-green-500/20',
    blue: 'border-blue-400 bg-blue-500/20',
    amber: 'border-amber-400 bg-amber-500/20',
    indigo: 'border-indigo-400 bg-indigo-500/20'
  };

  const selectedBgClasses = {
    purple: 'bg-purple-500/10 border-purple-400/60',
    green: 'bg-green-500/10 border-green-400/60',
    blue: 'bg-blue-500/10 border-blue-400/60',
    amber: 'bg-amber-500/10 border-amber-400/60',
    indigo: 'bg-indigo-500/10 border-indigo-400/60'
  };

  return (
    <label className={cn(
      "group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border",
      selected
        ? `${selectedBgClasses[color]} shadow-sm`
        : "border-transparent hover:bg-gray-700/40 hover:border-gray-500/30",
      disabled && "opacity-50 cursor-not-allowed",
      "hover:scale-[1.01] active:scale-[0.99]"
    )}>
      <div className="relative">
        <input
          type="radio"
          checked={selected}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        <div className={cn(
          "w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
          selected
            ? colorClasses[color]
            : "border-gray-500 bg-gray-700/50 group-hover:border-gray-400"
        )}>
          {selected && (
            <div className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              color === 'purple' && "bg-purple-400",
              color === 'green' && "bg-green-400",
              color === 'blue' && "bg-blue-400",
              color === 'amber' && "bg-amber-400",
              color === 'indigo' && "bg-indigo-400"
            )} />
          )}
        </div>
      </div>
      <div className="flex-1">
        <span className={cn(
          "text-sm transition-colors duration-200 select-none font-medium",
          selected ? "text-white" : "text-gray-200 group-hover:text-white"
        )}>
          {label}
        </span>
        {description && (
          <p className={cn(
            "text-xs mt-0.5 transition-colors duration-200",
            selected ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300"
          )}>
            {description}
          </p>
        )}
      </div>
    </label>
  );
}

// Improved Modern Search Input Component
interface ModernSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export function ModernSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className
}: ModernSearchInputProps) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200">
        <Search size={16} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-3 bg-gray-700/60 border border-gray-500/60 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:bg-gray-700 transition-all duration-200 text-sm hover:border-gray-400/70"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200 hover:bg-gray-600/50 rounded-full p-1"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// Modern Select Component
interface ModernSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function ModernSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className
}: ModernSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-700/60 border border-gray-500/60 rounded-xl text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm appearance-none pr-10 hover:border-gray-400/70"
      >
        {placeholder && (
          <option value="" disabled className="text-gray-400">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-700 text-gray-100">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <ChevronDown size={16} />
      </div>
    </div>
  );
}

// Modern Button Component
interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function ModernButton({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className
}: ModernButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 border border-gray-600/50 hover:border-gray-500",
    ghost: "hover:bg-gray-700/30 text-gray-300 hover:text-white",
    danger: "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/50"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        "hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
    >
      {children}
    </button>
  );
}

// Modern Range Slider Component
interface ModernRangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'indigo';
  className?: string;
}

export function ModernRangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  color = 'purple',
  className
}: ModernRangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const colorClasses = {
    purple: '#a78bfa',
    green: '#4ade80',
    blue: '#60a5fa',
    amber: '#fbbf24',
    indigo: '#818cf8'
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, ${colorClasses[color]} 0%, ${colorClasses[color]} ${percentage}%, #374151 ${percentage}%, #374151 100%)`
        }}
      />
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${colorClasses[color]};
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: ${colorClasses[color]};
          cursor: pointer;
          border: 2px solid #1e293b;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

// Modern Card Component
interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  solid?: boolean; // Add option for solid background
}

export function ModernCard({ children, className, hover = true, solid = false }: ModernCardProps) {
  return (
    <div className={cn(
      solid
        ? "bg-gray-800/95 border border-gray-600/60 rounded-2xl shadow-2xl"
        : "bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg",
      hover && "transition-all duration-200 hover:shadow-xl hover:border-gray-500/70",
      className
    )}>
      {children}
    </div>
  );
}

// Modern Badge Component
interface ModernBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function ModernBadge({
  children,
  variant = 'default',
  size = 'sm',
  className
}: ModernBadgeProps) {
  const variantClasses = {
    default: "bg-slate-700/50 text-slate-300 border-slate-600/50",
    success: "bg-green-500/20 text-green-400 border-green-500/50",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/50",
    error: "bg-red-500/20 text-red-400 border-red-500/50",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/50"
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm"
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium",
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
} 