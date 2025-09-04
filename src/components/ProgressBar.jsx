/**
 * ProgressBar Component
 *
 * Displays a progress bar with customizable percentage and styling.
 * Safely handles percentage values and provides responsive design.
 *
 * Features:
 * - Safe progress value handling (prevents NaN/invalid values)
 * - Customizable colors and styling
 * - Optional percentage text display
 * - Responsive design with Tailwind CSS
 * - Smooth animations and transitions
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {string} props.color - Optional color class (defaults to blue)
 * @param {boolean} props.showPercentage - Whether to show percentage text
 * @returns {JSX.Element} Progress bar component
 */
import React from 'react';

const ProgressBar = ({
  progress,
  color = 'bg-blue-500',
  showPercentage = false,
  className = ''
}) => {
  // Ensure progress is a valid number between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <div className={`w-full bg-gray-200 rounded-full h-4 mb-4 ${className}`}>
      <div
        className={`${color} h-4 rounded-full transition-all duration-300 relative`}
        style={{ width: `${safeProgress}%` }}
      >
        {/* Optional percentage text display */}
        {showPercentage && safeProgress > 15 && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {Math.round(safeProgress)}%
          </span>
        )}
      </div>

      {/* Fallback percentage display when bar is too small */}
      {showPercentage && safeProgress <= 15 && (
        <span className="absolute -right-8 top-0 text-sm font-medium text-gray-600">
          {Math.round(safeProgress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;