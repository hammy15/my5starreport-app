/**
 * Skeleton Loading Components
 *
 * Provides loading placeholder UI with shimmer animation.
 * Matches the neumorphic design system with dark mode support.
 */

'use client';

import { ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animate?: boolean;
}

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

interface SkeletonRatingProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

interface SkeletonChartProps {
  type?: 'bar' | 'line' | 'pie' | 'area';
  height?: string | number;
  className?: string;
}

interface SkeletonTextProps {
  lines?: number;
  lastLineWidth?: string;
  className?: string;
}

interface SkeletonMetricProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showTrend?: boolean;
  className?: string;
}

// ============================================================================
// Base Skeleton Component
// ============================================================================

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  animate = true,
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        relative overflow-hidden
        bg-[var(--background)] dark:bg-slate-700/50
        ${roundedClasses[rounded]}
        ${animate ? 'skeleton-shimmer' : ''}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    >
      {/* Shimmer overlay */}
      {animate && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
      )}
    </div>
  );
}

// ============================================================================
// Skeleton Card - For facility cards
// ============================================================================

/**
 * Skeleton placeholder for facility/content cards
 */
export function SkeletonCard({
  className = '',
  showImage = false,
  lines = 3,
}: SkeletonCardProps) {
  return (
    <div
      className={`
        card-neumorphic p-6 space-y-4
        ${className}
      `}
      aria-hidden="true"
    >
      {/* Optional image placeholder */}
      {showImage && (
        <Skeleton height={160} rounded="lg" className="w-full" />
      )}

      {/* Header with star rating placeholder */}
      <div className="flex items-center justify-between">
        <Skeleton width={200} height={24} rounded="md" />
        <Skeleton width={100} height={24} rounded="full" />
      </div>

      {/* Text lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={16}
            rounded="sm"
            className={i === lines - 1 ? 'w-3/4' : 'w-full'}
          />
        ))}
      </div>

      {/* Footer/action area */}
      <div className="flex items-center justify-between pt-2">
        <Skeleton width={80} height={32} rounded="lg" />
        <Skeleton width={100} height={32} rounded="lg" />
      </div>
    </div>
  );
}

// ============================================================================
// Skeleton Table - For data tables
// ============================================================================

/**
 * Skeleton placeholder for data tables
 */
export function SkeletonTable({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = '',
}: SkeletonTableProps) {
  return (
    <div
      className={`card-neumorphic overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          {showHeader && (
            <thead className="bg-[var(--background)]">
              <tr>
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="px-6 py-4 text-left">
                    <Skeleton
                      width={80 + Math.random() * 40}
                      height={16}
                      rounded="sm"
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Body rows */}
          <tbody className="divide-y divide-[var(--border-color)]">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton
                      width={colIndex === 0 ? 150 : 60 + Math.random() * 60}
                      height={16}
                      rounded="sm"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// Skeleton Rating - For star rating display
// ============================================================================

/**
 * Skeleton placeholder for star ratings
 */
export function SkeletonRating({
  size = 'md',
  showLabel = false,
  className = '',
}: SkeletonRatingProps) {
  const sizeClasses = {
    sm: { star: 16, gap: 2 },
    md: { star: 20, gap: 4 },
    lg: { star: 24, gap: 4 },
  };

  const { star, gap } = sizeClasses[size];

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: `${gap}px` }}
      aria-hidden="true"
    >
      {/* Five star placeholders */}
      <div className="flex" style={{ gap: `${gap / 2}px` }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            width={star}
            height={star}
            rounded="sm"
          />
        ))}
      </div>

      {/* Optional label */}
      {showLabel && (
        <Skeleton
          width={60}
          height={size === 'sm' ? 20 : 24}
          rounded="full"
        />
      )}
    </div>
  );
}

// ============================================================================
// Skeleton Chart - For chart placeholders
// ============================================================================

/**
 * Skeleton placeholder for charts
 */
export function SkeletonChart({
  type = 'bar',
  height = 300,
  className = '',
}: SkeletonChartProps) {
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`card-neumorphic p-6 ${className}`}
      style={{ height: heightValue }}
      aria-hidden="true"
    >
      {/* Chart title */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton width={150} height={20} rounded="md" />
        <Skeleton width={100} height={32} rounded="lg" />
      </div>

      {/* Chart area */}
      <div className="relative h-[calc(100%-60px)]">
        {type === 'bar' && <SkeletonBarChart />}
        {type === 'line' && <SkeletonLineChart />}
        {type === 'pie' && <SkeletonPieChart />}
        {type === 'area' && <SkeletonAreaChart />}
      </div>
    </div>
  );
}

function SkeletonBarChart() {
  const bars = [60, 80, 45, 90, 70, 55, 85];
  return (
    <div className="flex items-end justify-between h-full gap-3 px-4">
      {bars.map((height, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <Skeleton
            className="w-full"
            height={`${height}%`}
            rounded="sm"
          />
          <Skeleton width={20} height={12} rounded="sm" />
        </div>
      ))}
    </div>
  );
}

function SkeletonLineChart() {
  return (
    <div className="h-full flex flex-col justify-between">
      {/* Y-axis lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton width={30} height={12} rounded="sm" />
          <div className="flex-1 h-px bg-[var(--border-color)]" />
        </div>
      ))}
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 pt-2 border-t border-[var(--border-color)]">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} width={30} height={12} rounded="sm" />
        ))}
      </div>
    </div>
  );
}

function SkeletonPieChart() {
  return (
    <div className="h-full flex items-center justify-center gap-8">
      <Skeleton width={180} height={180} rounded="full" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton width={12} height={12} rounded="sm" />
            <Skeleton width={60 + Math.random() * 40} height={14} rounded="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonAreaChart() {
  return (
    <div className="h-full relative">
      {/* Simulated area shape */}
      <div className="absolute inset-0 flex items-end">
        <Skeleton className="w-full h-3/4" rounded="none" />
      </div>
      {/* X-axis */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} width={40} height={12} rounded="sm" />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Skeleton Text - For text lines
// ============================================================================

/**
 * Skeleton placeholder for text content
 */
export function SkeletonText({
  lines = 3,
  lastLineWidth = '75%',
  className = '',
}: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          rounded="sm"
          className={i === lines - 1 ? '' : 'w-full'}
          width={i === lines - 1 ? lastLineWidth : undefined}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Skeleton Metric - For metric cards with number + label
// ============================================================================

/**
 * Skeleton placeholder for metric/stat cards
 */
export function SkeletonMetric({
  size = 'md',
  showIcon = false,
  showTrend = false,
  className = '',
}: SkeletonMetricProps) {
  const sizeConfig = {
    sm: { number: 24, label: 12, icon: 24, padding: 'p-3' },
    md: { number: 32, label: 14, icon: 32, padding: 'p-4' },
    lg: { number: 40, label: 16, icon: 40, padding: 'p-6' },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`card-neumorphic ${config.padding} ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          {/* Label */}
          <Skeleton
            width={80}
            height={config.label}
            rounded="sm"
          />

          {/* Number */}
          <Skeleton
            width={120}
            height={config.number}
            rounded="md"
          />

          {/* Trend indicator */}
          {showTrend && (
            <div className="flex items-center gap-2 mt-2">
              <Skeleton width={40} height={16} rounded="sm" />
              <Skeleton width={60} height={12} rounded="sm" />
            </div>
          )}
        </div>

        {/* Icon */}
        {showIcon && (
          <Skeleton
            width={config.icon}
            height={config.icon}
            rounded="lg"
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Skeleton Wrapper - For custom layouts
// ============================================================================

interface SkeletonWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  fallback?: ReactNode;
}

/**
 * Wrapper component that shows skeleton fallback while loading
 */
export function SkeletonWrapper({
  children,
  isLoading,
  fallback,
}: SkeletonWrapperProps) {
  if (isLoading) {
    return <>{fallback || <Skeleton className="w-full h-full min-h-[40px]" />}</>;
  }
  return <>{children}</>;
}

// ============================================================================
// CSS Keyframes (add to globals.css or use inline)
// ============================================================================

// Note: Add this to your globals.css:
/*
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.skeleton-shimmer {
  box-shadow: var(--shadow-neumorphic-inset);
}
*/

export default Skeleton;
