/**
 * Star Rating Display Component
 *
 * Displays 1-5 stars with visual indicators.
 * Used throughout the app to show facility ratings.
 */

'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;           // 1-5 star rating
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;      // Show "X Stars" text
  label?: string;           // Optional custom label
  className?: string;
}

export function StarRating({
  rating,
  size = 'md',
  showLabel = false,
  label,
  className = '',
}: StarRatingProps) {
  // Ensure rating is between 1-5
  const validRating = Math.min(5, Math.max(1, Math.round(rating)));

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Color based on rating
  const getStarColor = (starPosition: number) => {
    if (starPosition > validRating) {
      return 'text-gray-300'; // Empty star
    }
    // Filled star color based on rating
    if (validRating >= 4) return 'text-green-500';
    if (validRating === 3) return 'text-yellow-500';
    if (validRating === 2) return 'text-orange-500';
    return 'text-red-500';
  };

  // Background color for rating badge
  const getBadgeColor = () => {
    if (validRating >= 4) return 'bg-green-100 text-green-800 border-green-200';
    if (validRating === 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (validRating === 2) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Star icons */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starNum) => (
          <Star
            key={starNum}
            className={`${sizeClasses[size]} ${getStarColor(starNum)} ${
              starNum <= validRating ? 'fill-current' : ''
            }`}
          />
        ))}
      </div>

      {/* Optional label */}
      {showLabel && (
        <span className={`text-sm font-medium px-2 py-0.5 rounded-full border ${getBadgeColor()}`}>
          {label || `${validRating} Star${validRating !== 1 ? 's' : ''}`}
        </span>
      )}
    </div>
  );
}

/**
 * Compact star rating for tables/lists
 */
export function StarRatingCompact({ rating, className = '' }: { rating: number; className?: string }) {
  const validRating = Math.min(5, Math.max(1, Math.round(rating)));

  const getColor = () => {
    if (validRating >= 4) return 'bg-green-500';
    if (validRating === 3) return 'bg-yellow-500';
    if (validRating === 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className={`w-6 h-6 rounded-full ${getColor()} flex items-center justify-center`}>
        <span className="text-white text-sm font-bold">{validRating}</span>
      </div>
      <Star className="w-4 h-4 text-gray-400 fill-gray-400" />
    </div>
  );
}

/**
 * Rating comparison component - shows before/after
 */
export function StarRatingComparison({
  current,
  potential,
  className = '',
}: {
  current: number;
  potential: number;
  className?: string;
}) {
  const improvement = potential - current;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <StarRating rating={current} size="md" />
      {improvement > 0 && (
        <>
          <span className="text-gray-400">→</span>
          <StarRating rating={potential} size="md" />
          <span className="text-green-600 font-medium text-sm">
            +{improvement.toFixed(1)} potential
          </span>
        </>
      )}
    </div>
  );
}

export default StarRating;
