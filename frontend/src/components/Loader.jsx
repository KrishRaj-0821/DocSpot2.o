import React from 'react';

// Full Screen Blocker Loading Spinner
export const PageLoader = () => {
  return (
    <div className="flex fixed inset-0 z-50 h-screen w-screen items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-600 border-t-transparent dark:border-primary-400"></div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 animate-pulse">
          Purnia Care is processing...
        </p>
      </div>
    </div>
  );
};

// Simple Inline Spinner
export const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    xs: 'h-3.5 w-3.5 border-2',
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary-600 border-t-transparent dark:border-primary-400',
    white: 'border-white border-t-transparent',
    accent: 'border-accent-500 border-t-transparent',
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${
        colorClasses[color] || colorClasses.primary
      }`}
    />
  );
};

// Card / Text Skeleton Loader
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (key) => {
    if (type === 'card') {
      return (
        <div
          key={key}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 h-6 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-4 flex gap-2">
            <div className="h-10 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      );
    }

    if (type === 'list') {
      return (
        <div key={key} className="flex animate-pulse items-center space-x-4 py-3">
          <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      );
    }

    // Default text/lines
    return (
      <div key={key} className="space-y-3 animate-pulse">
        <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => renderSkeleton(idx))}
    </div>
  );
};
export default Spinner;
