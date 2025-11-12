import React, { useState, useEffect, useCallback } from 'react';
import { Employee, TeamAnalysis } from '../types';
import { generateTeamAnalysis } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import TeamProficiencyChart from './TeamProficiencyChart';
import TeamAnalysisCard from './TeamAnalysisCard';

interface ComparisonViewProps {
  employees: Employee[];
}

// Simple in-memory cache for team analysis
const teamAnalysisCache = new Map<string, TeamAnalysis | null>();

const ComparisonView: React.FC<ComparisonViewProps> = ({ employees }) => {
  const [analysis, setAnalysis] = useState<TeamAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamAnalysis = useCallback(async (team: Employee[]) => {
    if (team.length === 0) {
      setAnalysis(null);
      setIsLoading(false);
      return;
    }
    const cacheKey = team.map(e => e.id).sort().join(',');

    if (teamAnalysisCache.has(cacheKey)) {
      setAnalysis(teamAnalysisCache.get(cacheKey) || null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await generateTeamAnalysis(team);
      setAnalysis(result);
      teamAnalysisCache.set(cacheKey, result);
    } catch (err: any) {
      setError(err.message);
      teamAnalysisCache.set(cacheKey, null); // Cache failure to prevent retries
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeamAnalysis(employees);
  }, [employees, fetchTeamAnalysis]);
  
  const role = employees.length > 0 ? employees[0].role : 'N/A';
  const training = employees.length > 0 ? employees[0].training : 'N/A';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Chart */}
      <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team Comparison: {role}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Training: <span className="font-semibold">{training}</span></p>
        <div className="h-[400px] sm:h-[500px]">
            {employees.length > 0 ? <TeamProficiencyChart employees={employees} /> : <p>No employees in this role.</p>}
        </div>
      </div>

      {/* Right Column: AI Analysis */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Team Insights
        </h3>
        {isLoading && <div className="flex justify-center items-center h-full min-h-[400px]"><LoadingSpinner /></div>}
        {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}
        {analysis && !isLoading && <TeamAnalysisCard analysis={analysis} />}
        {!analysis && !isLoading && !error && <p>No analysis available for this team.</p>}
      </div>
    </div>
  );
};

export default ComparisonView;