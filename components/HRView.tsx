import React from 'react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Employee, Status, Analysis, ActionPlan, User } from '../types';
import { MOCK_EMPLOYEES } from '../constants';
import ProficiencyChart from './ProficiencyChart';
import StatusIndicator from './StatusIndicator';
import AnalysisCard from './AnalysisCard';
import { generateProficiencyAnalysis } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import QuestionnaireDetails from './QuestionnaireDetails';
import ActionPlanCard from './ActionPlanCard';

interface HRViewProps {
    currentUser: User;
}

const calculateOverallScore = (employee: Employee): number => {
    if (!employee.proficiency || employee.proficiency.length === 0) return 0;
    const totalScore = employee.proficiency.reduce((sum, p) => sum + p.score, 0);
    const averageScore = totalScore / employee.proficiency.length;
    return Math.round(averageScore * 20);
};

const getStatus = (score: number): Status => {
    if (score > 80) return Status.GREEN;
    if (score >= 60) return Status.YELLOW;
    return Status.RED;
};

const StatCard: React.FC<{ label: string; value: string | number; colorClass: string }> = ({ label, value, colorClass }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex-1 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

// Simple in-memory cache for HR view
const analysisCache = new Map<number, Analysis | null>();

const HRView: React.FC<HRViewProps> = ({ currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
    
    const fetchTimeoutRef = useRef<number | undefined>();

    const filteredEmployees = useMemo(() =>
        MOCK_EMPLOYEES.filter(e =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.role.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm]
    );

    const overallStats = useMemo(() => {
        const total = MOCK_EMPLOYEES.length;
        if (total === 0) return { total: 0, green: 0, yellow: 0, red: 0 };
        const statuses = MOCK_EMPLOYEES.map(e => getStatus(calculateOverallScore(e)));
        return {
            total,
            green: Math.round((statuses.filter(s => s === Status.GREEN).length / total) * 100),
            yellow: Math.round((statuses.filter(s => s === Status.YELLOW).length / total) * 100),
            red: Math.round((statuses.filter(s => s === Status.RED).length / total) * 100),
        };
    }, []);
    
    const fetchAnalysis = useCallback(async (employee: Employee) => {
        if (!employee) return;
        
        if (analysisCache.has(employee.id)) {
            setAnalysis(analysisCache.get(employee.id) || null);
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setActionPlan(null); // Clear previous action plan
        
        const score = calculateOverallScore(employee);
        const status = getStatus(score);
        
        try {
            const result = await generateProficiencyAnalysis(employee, score, status);
            setAnalysis(result);
            analysisCache.set(employee.id, result);

             if (result) { // Mock action plan fetch/generation
                 setActionPlan({
                    employeeId: employee.id,
                    goal: `Develop ${employee.name}'s proficiency in ${employee.training}.`,
                    actionSteps: [
                        { step: "HR to identify and provide access to advanced " + employee.training + " workshops.", owner: "HR", timeline: "Next Quarter", resources: "Learning Management System", status: "Not Started"},
                        { step: "Manager to assign a challenging project to apply new skills.", owner: "Manager", timeline: "Next 30 Days", resources: "New Project Brief", status: "Not Started"},
                        { step: "Employee to complete a self-assessment post-project.", owner: "Employee", timeline: "End of Quarter", resources: "Performance Review Tool", status: "Not Started"},
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
        if (selectedEmployee) {
            clearTimeout(fetchTimeoutRef.current);
            setIsLoading(true);
            setAnalysis(null);
            setActionPlan(null);
            setError(null);
            
            fetchTimeoutRef.current = window.setTimeout(() => {
                 fetchAnalysis(selectedEmployee);
            }, 500); // 500ms debounce
        }
         return () => clearTimeout(fetchTimeoutRef.current);
    }, [selectedEmployee, fetchAnalysis]);

    const handleSelectEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">HR Dashboard</h2>
            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
                <StatCard label="Total Employees" value={overallStats.total} colorClass="text-brand-primary" />
                <StatCard label="Excelling" value={`${overallStats.green}%`} colorClass="text-status-green" />
                <StatCard label="Developing" value={`${overallStats.yellow}%`} colorClass="text-status-yellow" />
                <StatCard label="Needs Support" value={`${overallStats.red}%`} colorClass="text-status-red" />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Employee List */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-bold mb-4">All Employees</h3>
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 mb-4 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary"
                    />
                    <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {filteredEmployees.map(e => {
                            const score = calculateOverallScore(e);
                            const status = getStatus(score);
                            const statusColor = {
                                [Status.GREEN]: 'bg-status-green',
                                [Status.YELLOW]: 'bg-status-yellow',
                                [Status.RED]: 'bg-status-red',
                            }[status];

                            return (
                                <li key={e.id}>
                                    <button
                                        onClick={() => handleSelectEmployee(e)}
                                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${selectedEmployee?.id === e.id ? 'bg-brand-primary/10 dark:bg-brand-primary/20 ring-2 ring-brand-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                    >
                                        <span className={`w-3 h-3 rounded-full ${statusColor} shrink-0`}></span>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{e.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{e.role}</p>
                                        </div>
                                        <p className={`text-sm font-bold ${selectedEmployee?.id === e.id ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-300'}`}>{score}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Right: Selected Employee Details */}
                <div className="lg:col-span-2 space-y-6">
                    {!selectedEmployee ? (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center justify-center min-h-[500px]">
                            <p className="text-slate-500 dark:text-slate-400">Select an employee to view their details.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEmployee.name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.role}</p>
                                        <div className="mt-4">
                                            <StatusIndicator status={getStatus(calculateOverallScore(selectedEmployee))} />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 h-60">
                                        <ProficiencyChart data={selectedEmployee.proficiency} />
                                    </div>
                               </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg min-h-[300px]">
                                <h3 className="text-lg font-bold mb-4">Gap & Strength Analysis</h3>
                                {isLoading && <div className="flex justify-center items-center h-full min-h-[200px]"><LoadingSpinner /></div>}
                                {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}
                                {analysis && !isLoading && <AnalysisCard analysis={analysis} currentUserRole="HR" />}
                            </div>
                             {actionPlan && !isLoading && (
                                <ActionPlanCard 
                                    actionPlan={actionPlan} 
                                    onUpdateStepStatus={() => {}}
                                    isReadOnly={true}
                                    highlightRole="HR"
                                />
                            )}
                            <QuestionnaireDetails employee={selectedEmployee} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HRView;