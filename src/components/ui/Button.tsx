import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'accent';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 px-4 py-2 text-sm select-none active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-cyan text-slate-950 hover:bg-cyan-400 font-bold',
    secondary: 'bg-brand-elevated border border-brand-border text-slate-200 hover:bg-slate-800 hover:border-slate-600',
    danger: 'bg-status-red text-white hover:bg-red-600',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-brand-elevated/50',
    accent: 'bg-brand-lime text-slate-950 hover:bg-lime-400 font-bold'
  };

  const currentVariantClass = variants[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${currentVariantClass} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2 inline-flex" aria-hidden="true">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2 inline-flex" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
};
