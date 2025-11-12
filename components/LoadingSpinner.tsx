
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      <p className="text-slate-500 dark:text-slate-400">Generating AI Analysis...</p>
    </div>
  );
};

export default LoadingSpinner;
