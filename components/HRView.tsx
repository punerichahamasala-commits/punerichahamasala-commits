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
import ComparisonView from './ComparisonView';
import EditableStarRating from './EditableStarRating';

interface HRViewProps {
    currentUser: User;
}

type HRViewTab = 'global' | 'managerial' | 'trainer';

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

const AverageRatingVisualizer: React.FC<{ score: number }> = ({ score }) => (
    <div className="flex items-center gap-1" title={`Average: ${score.toFixed(1)} / 5`}>
      {[...Array(5)].map((_, i) => {
        const fillPercentage = Math.max(0, Math.min(1, score - i));
        return (
          <div key={i} className="relative w-4 h-4">
            <svg className="absolute inset-0 w-4 h-4 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div style={{ clipPath: `inset(0 ${100 - fillPercentage * 100}% 0 0)` }}>
              <svg className="absolute inset-0 w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );

// Simple in-memory cache for HR view
const analysisCache = new Map<number, Analysis | null>();

const HRView: React.FC<HRViewProps> = ({ currentUser }) => {
    const [employeesData, setEmployeesData] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [activeTab, setActiveTab] = useState<HRViewTab>('global');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
    
    const fetchTimeoutRef = useRef<number | undefined>();

    const filteredEmployees = useMemo(() =>
        employeesData.filter(e => e.role !== 'Manager' || e.training !== "Strategic Leadership Workshop") // Exclude managers in leadership training from global view
        .filter(e =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.role.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm, employeesData]
    );

    const overallStats = useMemo(() => {
        const total = employeesData.length;
        if (total === 0) return { total: 0, green: 0, yellow: 0, red: 0 };
        const statuses = employeesData.map(e => getStatus(calculateOverallScore(e)));
        return {
            total,
            green: Math.round((statuses.filter(s => s === Status.GREEN).length / total) * 100),
            yellow: Math.round((statuses.filter(s => s === Status.YELLOW).length / total) * 100),
            red: Math.round((statuses.filter(s => s === Status.RED).length / total) * 100),
        };
    }, [employeesData]);

    const trainingEffectivenessStats = useMemo(() => {
        const stats: { [key: string]: { scores: number[], count: number, average: number } } = {};
        employeesData.forEach(employee => {
            if (employee.trainingEffectiveness !== undefined) {
                if (!stats[employee.training]) {
                    stats[employee.training] = { scores: [], count: 0, average: 0 };
                }
                stats[employee.training].scores.push(employee.trainingEffectiveness);
            }
        });
        for (const training in stats) {
            const count = stats[training].scores.length;
            const sum = stats[training].scores.reduce((a, b) => a + b, 0);
            stats[training].count = count;
            stats[training].average = count > 0 ? sum / count : 0;
        }
        return Object.entries(stats)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => a.average - b.average);
    }, [employeesData]);

    const employeesForRetraining = useMemo(() =>
        employeesData.filter(e => calculateOverallScore(e) < 60)
            .sort((a, b) => calculateOverallScore(a) - calculateOverallScore(b)),
        [employeesData]
    );

    const managerialTrainees = useMemo(() => employeesData.filter(e => e.training === "Strategic Leadership Workshop"), [employeesData]);
    
    const trainerAnalytics = useMemo(() => {
        const trainers: { [key: string]: { employees: Employee[], effectivenessScores: number[] } } = {};

        employeesData.forEach(emp => {
            if (emp.trainerName) {
                if (!trainers[emp.trainerName]) {
                    trainers[emp.trainerName] = { employees: [], effectivenessScores: [] };
                }
                trainers[emp.trainerName].employees.push(emp);
                if (emp.trainingEffectiveness !== undefined) {
                    trainers[emp.trainerName].effectivenessScores.push(emp.trainingEffectiveness);
                }
            }
        });

        return Object.entries(trainers).map(([name, data]) => {
            const avgEffectiveness = data.effectivenessScores.length > 0
                ? data.effectivenessScores.reduce((a, b) => a + b, 0) / data.effectivenessScores.length
                : 0;
            
            const trainingsConducted = [...new Set(data.employees.map(e => e.training))];

            return {
                name,
                avgEffectiveness,
                traineeCount: data.employees.length,
                trainingsConducted,
            };
        }).sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);
    }, [employeesData]);
    
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
        setActionPlan(null);
        const score = calculateOverallScore(employee);
        const status = getStatus(score);
        try {
            const result = await generateProficiencyAnalysis(employee, score, status);
            setAnalysis(result);
            analysisCache.set(employee.id, result);
             if (result) {
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
        if (selectedEmployee && activeTab === 'global') {
            clearTimeout(fetchTimeoutRef.current);
            setIsLoading(true);
            setAnalysis(null);
            setActionPlan(null);
            setError(null);
            fetchTimeoutRef.current = window.setTimeout(() => {
                 fetchAnalysis(selectedEmployee);
            }, 500);
        }
         return () => clearTimeout(fetchTimeoutRef.current);
    }, [selectedEmployee, fetchAnalysis, activeTab]);

    const handleSelectEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
    };

    const handleEffectivenessChange = (newScore: number) => {
        if (!selectedEmployee) return;
    
        const updatedEmployees = employeesData.map(emp =>
            emp.id === selectedEmployee.id
                ? { ...emp, trainingEffectiveness: newScore }
                : emp
        );
        setEmployeesData(updatedEmployees);
        
        setSelectedEmployee(prev => prev ? { ...prev, trainingEffectiveness: newScore } : null);
    };

    const TabButton: React.FC<{tabId: HRViewTab, label: string}> = ({tabId, label}) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === tabId ? 'bg-white dark:bg-slate-800 text-brand-primary shadow' : 'text-slate-600 dark:text-slate-300'}`}
        >
            {label}
        </button>
    );

    const renderGlobalDashboard = () => (
        <>
            <div className="flex flex-col sm:flex-row gap-4">
                <StatCard label="Total Employees" value={overallStats.total} colorClass="text-brand-primary" />
                <StatCard label="Excelling" value={`${overallStats.green}%`} colorClass="text-status-green" />
                <StatCard label="Developing" value={`${overallStats.yellow}%`} colorClass="text-status-yellow" />
                <StatCard label="Needs Support" value={`${overallStats.red}%`} colorClass="text-status-red" />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 12L8 14l4 2 4-2-4-2z" /></svg>
                    Training Program Effectiveness
                </h3>
                <div className="overflow-x-auto"><table className="w-full text-left table-auto"><thead className="border-b border-slate-200 dark:border-slate-700"><tr><th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Program</th><th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Participants</th><th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Avg. Rating</th></tr></thead>
                    <tbody>{trainingEffectivenessStats.map(training => { const isUnderperforming = training.average < 3; return ( <tr key={training.name} className={`border-b border-slate-100 dark:border-slate-700/50 ${isUnderperforming ? 'bg-status-red/5' : ''}`}><td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200"><div className="flex items-center gap-2">{isUnderperforming && ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-red shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" title="This program is underperforming."><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg> )}{training.name}</div></td><td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 text-center">{training.count}</td><td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400"><div className="flex items-center gap-2"><AverageRatingVisualizer score={training.average} /><span className={`font-semibold ${isUnderperforming ? 'text-status-red' : 'text-slate-800 dark:text-slate-200'}`}>{training.average.toFixed(1)}</span></div></td></tr>)})}</tbody></table></div>
            </div>
            {employeesForRetraining.length > 0 && ( <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg"><h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-status-red"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>Employees Recommended for Retraining (Score &lt; 60)</h3><div className="overflow-x-auto"><table className="w-full text-left table-auto"><thead className="border-b border-slate-200 dark:border-slate-700"><tr><th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Employee</th><th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Role</th><th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Training</th><th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 text-center">Score</th></tr></thead><tbody>{employeesForRetraining.map(employee => (<tr key={employee.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"><td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{employee.name}</td><td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{employee.role}</td><td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{employee.training}</td><td className="px-4 py-3 text-sm font-bold text-status-red text-center">{calculateOverallScore(employee)}</td></tr>))}</tbody></table></div></div>)}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg"><h3 className="text-lg font-bold mb-4">All Employees</h3><input type="text" placeholder="Search by name or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 mb-4 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-brand-primary focus:border-brand-primary" /><ul className="space-y-2 max-h-[60vh] overflow-y-auto">{filteredEmployees.map(e => { const score = calculateOverallScore(e); const status = getStatus(score); const statusColor = { [Status.GREEN]: 'bg-status-green', [Status.YELLOW]: 'bg-status-yellow', [Status.RED]: 'bg-status-red', }[status]; return ( <li key={e.id}><button onClick={() => handleSelectEmployee(e)} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${selectedEmployee?.id === e.id ? 'bg-brand-primary/10 dark:bg-brand-primary/20 ring-2 ring-brand-primary' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}><span className={`w-3 h-3 rounded-full ${statusColor} shrink-0`}></span><div className="flex-1"><p className="font-semibold text-sm">{e.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{e.role}</p></div><p className={`text-sm font-bold ${selectedEmployee?.id === e.id ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-300'}`}>{score}</p></button></li> ); })}</ul></div>
                <div className="lg:col-span-2 space-y-6">{!selectedEmployee ? ( <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center justify-center min-h-[500px]"><p className="text-slate-500 dark:text-slate-400">Select an employee to view their details.</p></div> ) : ( <> <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg"><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="md:col-span-1"><h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedEmployee.name}</h3><p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.role}</p><div className="mt-4"><StatusIndicator status={getStatus(calculateOverallScore(selectedEmployee))} /></div><div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"><label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Training Effectiveness Rating:</label><EditableStarRating score={selectedEmployee.trainingEffectiveness || 0} onScoreChange={handleEffectivenessChange} /></div></div><div className="md:col-span-2 h-60"><ProficiencyChart data={selectedEmployee.proficiency} /></div></div></div><div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg min-h-[300px]"><h3 className="text-lg font-bold mb-4">Gap & Strength Analysis</h3>{isLoading && <div className="flex justify-center items-center h-full min-h-[200px]"><LoadingSpinner /></div>}{error && <div className="text-red-500 bg-red-100 dark:bg-red-900/50 p-4 rounded-lg">{error}</div>}{analysis && !isLoading && <AnalysisCard analysis={analysis} currentUserRole="HR" />}</div>{actionPlan && !isLoading && ( <ActionPlanCard actionPlan={actionPlan} onUpdateStepStatus={() => {}} isReadOnly={true} highlightRole="HR" /> )}<QuestionnaireDetails employee={selectedEmployee} /> </> )}</div>
            </div>
        </>
    );

    const renderManagerialDashboard = () => (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Managerial Training Hub</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Analysis of managers participating in the "Strategic Leadership Workshop".</p>
        </div>
        <ComparisonView employees={managerialTrainees} />
      </div>
    );

    const renderTrainerDashboard = () => (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Trainer Analytics</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Performance overview of all trainers based on participant feedback.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainerAnalytics.map(trainer => {
                const isUnderperforming = trainer.avgEffectiveness < 3.5;
                return (
                    <div key={trainer.name} className={`p-6 rounded-xl shadow-lg flex flex-col transition-colors duration-300 ${isUnderperforming ? 'bg-status-red/10 border border-status-red/20' : 'bg-white dark:bg-slate-800'}`}>
                        <div className="flex justify-between items-start gap-2 mb-2">
                             <h4 className="font-bold text-lg text-brand-primary flex-1 flex items-center">
                                {isUnderperforming && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-red mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" title="This trainer's average rating is low.">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {trainer.name}
                            </h4>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className={`text-4xl font-bold ${isUnderperforming ? 'text-status-red' : 'text-slate-800 dark:text-slate-200'}`}>{trainer.avgEffectiveness.toFixed(1)}</p>
                            <p className="text-slate-500 dark:text-slate-400">/ 5.0 avg. rating</p>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">from {trainer.traineeCount} participants</p>
                        <hr className="my-2 border-slate-200 dark:border-slate-700" />
                        <div className="mt-3 flex-1">
                            <h5 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Courses Conducted:</h5>
                            <div className="flex flex-wrap gap-2">
                                {trainer.trainingsConducted.map(course => (
                                    <span key={course} className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{course}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {currentUser.role === 'Higher Management' ? 'Executive Hub' : 'HR Dashboard'}
                </h2>
                <div className="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                    <TabButton tabId="global" label="Global Dashboard" />
                    <TabButton tabId="managerial" label="Managerial Training" />
                    <TabButton tabId="trainer" label="Trainer Analytics" />
                </div>
            </div>
            
            <div className="animate-fade-in">
              {activeTab === 'global' && renderGlobalDashboard()}
              {activeTab === 'managerial' && renderManagerialDashboard()}
              {activeTab === 'trainer' && renderTrainerDashboard()}
            </div>
        </div>
    );
};

export default HRView;
