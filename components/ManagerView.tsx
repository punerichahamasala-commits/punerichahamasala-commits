import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Employee, Status, Analysis, ActionPlan, ActionStep, User } from '../types';
import { MOCK_EMPLOYEES, ROLES } from '../constants';
import ProficiencyChart from './ProficiencyChart';
import StatusIndicator from './StatusIndicator';
import AnalysisCard from './AnalysisCard';
import { generateProficiencyAnalysis, generateActionPlan } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import QuestionnaireDetails from './QuestionnaireDetails';
import ComparisonView from './ComparisonView';
import { exportToCSV } from '../utils/csvExporter';
import ActionPlanCard from './ActionPlanCard';

interface ManagerViewProps {
    currentUser: User;
}

const calculateOverallScore = (employee: Employee): number => {
    if (!employee.proficiency || employee.proficiency.length === 0) return 0;
    const totalScore = employee.proficiency.reduce((sum, p) => sum + p.score, 0);
    const averageScore = totalScore / employee.proficiency.length; // Average on a 1-5 scale
    return Math.round(averageScore * 20); // Convert to a 100-point scale
};

const getStatus = (score: number): Status => {
    if (score > 80) return Status.GREEN;
    if (score >= 60) return Status.YELLOW;
    return Status.RED;
};

const ManagerView: React.FC<ManagerViewProps> = ({ currentUser }) => {
    const managedEmployees = useMemo(() => 
        MOCK_EMPLOYEES.filter(e => currentUser.managesIds?.includes(e.id)),
        [currentUser.managesIds]
    );

    const managedRoles = useMemo(() => 
        [...new Set(managedEmployees.map(e => e.role))], 
        [managedEmployees]
    );

    const [viewMode, setViewMode] = useState<'single' | 'team'>('single');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee>(managedEmployees[0]);
    const [selectedRole, setSelectedRole] = useState<string>(managedRoles[0]);
    
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
    const [isActionPlanLoading, setIsActionPlanLoading] = useState<boolean>(false);
    const [actionPlanError, setActionPlanError] = useState<string | null>(null);

    // Caching states
    const [analysisCache, setAnalysisCache] = useState<Map<number, Analysis | null>>(new Map());
    const [actionPlanCache, setActionPlanCache] = useState<Map<number, ActionPlan | null>>(new Map());
    
    const fetchTimeoutRef = useRef<number | undefined>();

    const overallScore = useMemo(() => calculateOverallScore(selectedEmployee), [selectedEmployee]);
    const status = useMemo(() => getStatus(overallScore), [overallScore]);

    const employeesForComparison = useMemo(() => {
        return managedEmployees.filter(e => e.role === selectedRole);
    }, [selectedRole, managedEmployees]);

    const fetchAnalysis = useCallback(async (employee: Employee, score: number, empStatus: Status) => {
        if (analysisCache.has(employee.id)) {
            const cachedAnalysis = analysisCache.get(employee.id);
            setAnalysis(cachedAnalysis || null);
            setIsLoading(false);
            setError(null);
            if (actionPlanCache.has(employee.id)) {
                setActionPlan(actionPlanCache.get(employee.id) || null);
            }
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setActionPlan(null);
        setActionPlanError(null);
        
        try {
            const result = await generateProficiencyAnalysis(employee, score, empStatus);
            setAnalysis(result);
            setAnalysisCache(prev => new Map(prev).set(employee.id, result));
        } catch (err: any) {
            setError(err.message);
            setAnalysisCache(prev => new Map(prev).set(employee.id, null));
        } finally {
            setIsLoading(false);
        }
    }, [analysisCache, actionPlanCache]);

    useEffect(() => {
        // Reset selected employee and role if manager changes
        if (managedEmployees.length > 0) {
            setSelectedEmployee(managedEmployees[0]);
            setSelectedRole(managedRoles[0]);
        }
    }, [managedEmployees, managedRoles]);

    useEffect(() => {
        if (viewMode === 'single' && selectedEmployee) {
            clearTimeout(fetchTimeoutRef.current);
            setIsLoading(true);
            setAnalysis(null);
            setActionPlan(null);
            setError(null);

            fetchTimeoutRef.current = window.setTimeout(() => {
                fetchAnalysis(selectedEmployee, overallScore, status);
            }, 500); // 500ms debounce delay
        }
        return () => clearTimeout(fetchTimeoutRef.current);
    }, [selectedEmployee, viewMode, overallScore, status, fetchAnalysis]);

    const handleEmployeeChange = (employee: Employee) => {
        setSelectedEmployee(employee);
    };

    const handleGenerateActionPlan = useCallback(async () => {
        if (!analysis || !selectedEmployee) return;

        if (actionPlanCache.has(selectedEmployee.id)) {
            setActionPlan(actionPlanCache.get(selectedEmployee.id) || null);
            return;
        }

        setIsActionPlanLoading(true);
        setActionPlanError(null);
        try {
            const result = await generateActionPlan(selectedEmployee, analysis);
            setActionPlan(result);
            setActionPlanCache(prev => new Map(prev).set(selectedEmployee.id, result));
        } catch (err: any) {
            setActionPlanError(err.message);
            setActionPlanCache(prev => new Map(prev).set(selectedEmployee.id, null));
        } finally {
            setIsActionPlanLoading(false);
        }
    }, [analysis, selectedEmployee, actionPlanCache]);

    const handleUpdateActionStepStatus = (stepIndex: number, newStatus: ActionStep['status']) => {
        if (!actionPlan) return;
        
        const updatedSteps = [...actionPlan.actionSteps];
        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], status: newStatus };
        
        setActionPlan({
            ...actionPlan,
            actionSteps: updatedSteps,
        });
    };
    
    const handleExport = () => {
        if (viewMode === 'single') {
            const fileName = `proficiency-report-${selectedEmployee.name.replace(/\s/g, '_')}.csv`;
            exportToCSV([selectedEmployee], fileName);
        } else {
            const fileName = `team-comparison-${selectedRole.replace(/\s/g, '_')}.csv`;
            exportToCSV(employeesForComparison, fileName);
        }
    };
    
    const ViewSwitcher: React.FC = () => (
      <div className="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
        <button 
          onClick={() => setViewMode('single')} 
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${viewMode === 'single' ? 'bg-white dark:bg-slate-800 text-brand-primary shadow' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Individual Snapshot
        </button>
        <button 
          onClick={() => setViewMode('team')} 
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${viewMode === 'team' ? 'bg-white dark:bg-slate-800 text-brand-primary shadow' : 'text-slate-600 dark:text-slate-300'}`}
        >
          Team Comparison
        </button>
      </div>
    );
    
    if (managedEmployees.length === 0) {
        return <div>You do not manage any employees.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <ViewSwitcher />
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-white dark:bg-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  aria-label="Export data to CSV"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </button>
              </div>
              {viewMode === 'single' ? (
                <div className="flex gap-2 flex-wrap justify-center">
                   {managedEmployees.map(employee => (
                       <button 
                        key={employee.id}
                        onClick={() => handleEmployeeChange(employee)} 
                        className={`px-3 py-1 text-sm rounded-md ${selectedEmployee.id === employee.id ? 'bg-brand-primary text-white' : 'bg-white dark:bg-slate-700'}`}
                       >
                        {employee.name}
                       </button>
                   ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                    <label htmlFor="role-select" className="text-sm font-medium text-slate-600 dark:text-slate-300">Role:</label>
                    <select 
                      id="role-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
                    >
                      {managedRoles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                </div>
              )}
            </div>

            {viewMode === 'single' ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Chart and Status */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEmployee.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.role}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Training: <span className="font-semibold">{selectedEmployee.training}</span></p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                            <h3 className="text-lg font-semibold text-center mb-4">Employee Proficiency</h3>
                            <div className="h-72 sm:h-80">
                                <ProficiencyChart data={selectedEmployee.proficiency} />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                            <div className="flex flex-col items-center">
                                <p className="text-slate-500 dark:text-slate-400">Overall Proficiency Score</p>
                                <p className="text-6xl font-bold text-brand-primary my-2">{overallScore}<span className="text-3xl text-slate-400">/100</span></p>
                                <StatusIndicator status={status} />
                                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                    <button
                                        onClick={handleGenerateActionPlan}
                                        className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 flex items-center justify-center disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed"
                                        disabled={!analysis || isLoading || isActionPlanLoading}
                                    >
                                        {isActionPlanLoading ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        {isActionPlanLoading ? 'Generating...' : 'Generate Action Plan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI Analysis & Action Plan */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg min-h-[500px]">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
                                Gap & Strength Analysis
                            </h3>
                            {isLoading && <div className="flex justify-center items-center h-full min-h-[400px]"><LoadingSpinner /></div>}
                            {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}
                            {analysis && !isLoading && <AnalysisCard analysis={analysis} currentUserRole="Manager" />}
                        </div>
                        
                        {isActionPlanLoading && (
                            <div className="flex justify-center items-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg min-h-[200px]">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                                    <p className="text-slate-500 dark:text-slate-400">Generating Action Plan...</p>
                                </div>
                            </div>
                        )}
                        {actionPlanError && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{actionPlanError}</div>}
                        {actionPlan && !isActionPlanLoading && (
                            <ActionPlanCard actionPlan={actionPlan} onUpdateStepStatus={handleUpdateActionStepStatus} />
                        )}
                    </div>
                </div>
                <QuestionnaireDetails employee={selectedEmployee} />
              </>
            ) : (
                <ComparisonView employees={employeesForComparison} />
            )}
        </div>
    );
};

export default ManagerView;