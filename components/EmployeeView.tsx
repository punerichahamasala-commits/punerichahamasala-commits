import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Employee, Status, Analysis, ActionPlan, ActionStep, User, UserRole } from '../types';
import { MOCK_EMPLOYEES } from '../constants';
import ProficiencyChart from './ProficiencyChart';
import StatusIndicator from './StatusIndicator';
import AnalysisCard from './AnalysisCard';
import { generateProficiencyAnalysis } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import QuestionnaireDetails from './QuestionnaireDetails';
import ActionPlanCard from './ActionPlanCard';
import EditableStarRating from './EditableStarRating';

interface EmployeeViewProps {
    employeeId: number;
    currentUserRole: UserRole;
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

// Simple in-memory cache for analysis
const analysisCache = new Map<number, Analysis | null>();

const EmployeeView: React.FC<EmployeeViewProps> = ({ employeeId, currentUserRole }) => {
    const employeeData = useMemo(() => 
        MOCK_EMPLOYEES.find(e => e.id === employeeId),
        [employeeId]
    );

    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // In a real app, the action plan would be fetched, not stored in local state.
    // This is a mock to show the read-only functionality.
    const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);

    const overallScore = useMemo(() => employeeData ? calculateOverallScore(employeeData) : 0, [employeeData]);
    const status = useMemo(() => getStatus(overallScore), [overallScore]);

    const fetchAnalysis = useCallback(async (employee: Employee, score: number, empStatus: Status) => {
        if (analysisCache.has(employee.id)) {
            setAnalysis(analysisCache.get(employee.id) || null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const result = await generateProficiencyAnalysis(employee, score, empStatus);
            setAnalysis(result);
            analysisCache.set(employee.id, result);

            // This is a mock: In a real app, you would fetch a saved action plan.
            // For this demo, we'll create a dummy one if analysis is successful.
            if (result) {
                 setActionPlan({
                    employeeId: employee.id,
                    goal: "Continuously improve skills based on feedback.",
                    actionSteps: [
                        { step: "Review analysis with manager", owner: "Employee", timeline: "Next week", resources: "Meeting invite", status: "Not Started"},
                        { step: "Focus on identified gap areas during projects", owner: "Employee", timeline: "Next 30 days", resources: "Project tasks", status: "Not Started"},
                    ]
                 });
            }
        } catch (err: any) {
            setError(err.message);
            analysisCache.set(employee.id, null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (employeeData) {
            fetchAnalysis(employeeData, overallScore, status);
        }
    }, [employeeData, fetchAnalysis, overallScore, status]);


    if (!employeeData) {
        return <div>Could not find your employee data.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Chart and Status */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{employeeData.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{employeeData.role}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Department: <span className="font-semibold">{employeeData.department}</span></p>
                        <hr className="my-3 border-slate-200 dark:border-slate-700" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Training: <span className="font-semibold">{employeeData.training}</span></p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Trainer: <span className="font-semibold">{employeeData.trainerName || 'N/A'}</span></p>
                         <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Training Effectiveness Rating:</p>
                            <div className="mt-1">
                                <EditableStarRating 
                                    score={employeeData.trainingEffectiveness || 0}
                                    onScoreChange={() => {}} // no-op
                                    isReadOnly={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-center mb-4">My Proficiency</h3>
                        <div className="h-72 sm:h-80">
                            <ProficiencyChart data={employeeData.proficiency} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <div className="flex flex-col items-center">
                            <p className="text-slate-500 dark:text-slate-400">Overall Proficiency Score</p>
                            <p className="text-6xl font-bold text-brand-primary my-2">{overallScore}<span className="text-3xl text-slate-400">/100</span></p>
                            <StatusIndicator status={status} />
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Analysis & Action Plan */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg min-h-[400px]">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
                            My Gap & Strength Analysis
                        </h3>
                        {isLoading && <div className="flex justify-center items-center h-full min-h-[300px]"><LoadingSpinner /></div>}
                        {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}
                        {analysis && !isLoading && <AnalysisCard analysis={analysis} currentUserRole={currentUserRole} />}
                    </div>
                    
                    {actionPlan && !isLoading && (
                        <ActionPlanCard 
                          actionPlan={actionPlan} 
                          onUpdateStepStatus={() => {}} // No-op for employee
                          isReadOnly={true}
                        />
                    )}
                </div>
            </div>
            <QuestionnaireDetails employee={employeeData} />
        </div>
    );
};

export default EmployeeView;
