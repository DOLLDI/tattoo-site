import React, { forwardRef, useState } from 'react';

export interface LiquidMetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  borderWidth?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const LiquidMetalButton = forwardRef<
  HTMLButtonElement,
  LiquidMetalButtonProps
>(
  (
    {
      children,
      icon,
      borderWidth = 2,
      size = 'md',
      className = '',
      disabled,
      onMouseMove,
      ...props
    },
    ref,
  ) => {
    const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

    const sizeStyles = {
      sm: icon ? 'py-2 pl-2 pr-5 gap-2.5 text-xs' : 'py-2.5 px-5 gap-2.5 text-xs',
      md: icon ? 'py-2.5 pl-2.5 pr-6 gap-3 text-xs' : 'py-3 px-7 gap-3 text-xs',
      lg: icon ? 'py-3 pl-3 pr-8 gap-4 text-sm' : 'py-3.5 px-8 gap-3 text-sm',
    };

    const iconSizes = {
      sm: 'w-7 h-7',
      md: 'w-8 h-8',
      lg: 'w-10 h-10',
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSpotlight({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
      onMouseMove?.(e);
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        onMouseMove={handleMouseMove}
        className={`relative group inline-flex cursor-pointer border-none bg-transparent p-0 outline-none transition-transform duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8CDD4] ${className}`}
        {...props}
      >
        <div
          className="relative overflow-hidden rounded-full shadow-[0_14px_38px_-10px_rgba(0,0,0,0.85)]"
          style={{ padding: borderWidth }}
        >
          {/* Liquid mercury/chrome animated shader rim */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[320%] w-[320%] opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                'conic-gradient(from 0deg, #3b3e45 0deg, #f4f4f6 42deg, #696d76 92deg, #c8cdd4 148deg, #27292e 205deg, #ffffff 252deg, #747882 310deg, #3b3e45 360deg)',
              animation: 'liquid-metal-rotate 7s linear infinite',
            }}
          />

          {/* Interactive pointer specular sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-90"
            style={{
              background: `radial-gradient(90px circle at ${spotlight.x}% ${spotlight.y}%, rgba(244,244,246,0.55), transparent 70%)`,
            }}
          />

          {/* Inner obsidian capsule body */}
          <div
            className={`relative z-10 flex items-center rounded-full bg-[#09090B] transition-colors duration-200 group-hover:bg-[#131418] ${sizeStyles[size]}`}
          >
            {icon && (
              <span
                className={`flex items-center justify-center rounded-full border border-white/12 bg-[#141417] text-[#F4F4F6] shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] transition-transform duration-200 group-hover:scale-105 ${iconSizes[size]}`}
              >
                {icon}
              </span>
            )}
            <span className="font-semibold tracking-[0.14em] text-[#F4F4F6] uppercase">
              {children}
            </span>
          </div>
        </div>
      </button>
    );
  },
);

LiquidMetalButton.displayName = 'LiquidMetalButton';
