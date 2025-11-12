
import React from 'react';
import { TeamAnalysis } from '../types';

interface TeamAnalysisCardProps {
  analysis: TeamAnalysis;
}

const TeamAnalysisCard: React.FC<TeamAnalysisCardProps> = ({ analysis }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Common Strengths */}
      {analysis.commonStrengths.length > 0 && (
        <div>
          <h4 className="font-semibold text-md text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-green" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Common Strengths
          </h4>
          <div className="space-y-3">
            {analysis.commonStrengths.map((item, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.perimeter}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Gaps */}
      {analysis.commonGaps.length > 0 && (
         <div>
          <h4 className="font-semibold text-md text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-yellow" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Common Gaps
          </h4>
          <div className="space-y-3">
            {analysis.commonGaps.map((item, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{item.perimeter}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Recommendations */}
      {analysis.teamRecommendations.length > 0 && (
        <div>
            <h4 className="font-semibold text-md text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM12 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.343 5.757a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707z" />
                    <path d="M10 16a6 6 0 100-12 6 6 0 000 12z" />
                    <path d="M10 14a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
                Team Recommendations
            </h4>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                {analysis.teamRecommendations.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default TeamAnalysisCard;
