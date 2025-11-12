
import React from 'react';
import { Analysis, UserRole } from '../types';

interface AnalysisCardProps {
  analysis: Analysis;
  currentUserRole: UserRole;
}

const icons = {
    manager: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
        </svg>
    ),
    employee: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
        </svg>
    ),
    hr: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 dark:text-pink-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
        </svg>
    )
};

const RecommendationSection: React.FC<{ title: string; items: string[]; iconType: 'manager' | 'employee' | 'hr' }> = ({ title, items, iconType }) => {
    if (items.length === 0) return null;
    
    const colorClasses = {
        manager: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50',
        employee: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50',
        hr: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800/50',
    };

    return (
        <div className={`p-4 rounded-lg border ${colorClasses[iconType]}`}>
            <h4 className="font-semibold text-md text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-3">
                {icons[iconType]}
                {title}
            </h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 pl-9">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};


const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis, currentUserRole }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-brand-primary">{analysis.analysisTitle}</h3>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{analysis.message}</p>
      </div>
      
      {analysis.rootCause && (
        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
           <h4 className="font-semibold text-md text-slate-700 dark:text-slate-300 mb-1">Root Cause Analysis</h4>
           <p className="text-slate-600 dark:text-slate-400">{analysis.rootCause}</p>
        </div>
      )}

      <div className="space-y-4">
        {currentUserRole === 'Manager' && (
          <RecommendationSection title="For the Manager" items={analysis.recommendations.manager} iconType="manager" />
        )}
        {(currentUserRole === 'Manager' || currentUserRole === 'Employee') && (
          <RecommendationSection title="For the Employee" items={analysis.recommendations.employee} iconType="employee" />
        )}
        {(currentUserRole === 'Manager' || currentUserRole === 'HR') && (
          <RecommendationSection title="For HR" items={analysis.recommendations.hr} iconType="hr" />
        )}
      </div>
    </div>
  );
};

export default AnalysisCard;
