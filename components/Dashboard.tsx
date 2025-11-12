
import React, { useState } from 'react';
import { User } from '../types';
import ManagerView from './ManagerView';
import EmployeeView from './EmployeeView';
import HRView from './HRView';

interface DashboardProps {
    currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
    const [managerTab, setManagerTab] = useState<'myDashboard' | 'teamDashboard'>('myDashboard');

    switch (currentUser.role) {
        case 'Manager':
            const managerEmployeeId = currentUser.id;
            return (
                <div className="space-y-6">
                    <div className="flex justify-center p-1 bg-slate-200 dark:bg-slate-700 rounded-lg max-w-md mx-auto">
                        <button
                            onClick={() => setManagerTab('myDashboard')}
                            className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${managerTab === 'myDashboard' ? 'bg-white dark:bg-slate-800 text-brand-primary shadow' : 'text-slate-600 dark:text-slate-300'}`}
                            aria-current={managerTab === 'myDashboard'}
                        >
                            My Dashboard
                        </button>
                        <button
                            onClick={() => setManagerTab('teamDashboard')}
                            className={`w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors ${managerTab === 'teamDashboard' ? 'bg-white dark:bg-slate-800 text-brand-primary shadow' : 'text-slate-600 dark:text-slate-300'}`}
                            aria-current={managerTab === 'teamDashboard'}
                        >
                            Team Dashboard
                        </button>
                    </div>
                    <div className="animate-fade-in">
                        {managerTab === 'myDashboard' && (
                            <EmployeeView employeeId={managerEmployeeId} currentUserRole={currentUser.role} />
                        )}
                        {managerTab === 'teamDashboard' && (
                            <ManagerView currentUser={currentUser} />
                        )}
                    </div>
                </div>
            );
        case 'Employee':
            if (!currentUser.employeeId) {
                return <div>Error: Employee ID not found for the current user.</div>;
            }
            return <EmployeeView employeeId={currentUser.employeeId} currentUserRole={currentUser.role} />;
        case 'HR':
        case 'Higher Management':
            return <HRView currentUser={currentUser} />;
        default:
            return <div>Invalid user role.</div>;
    }
};

export default Dashboard;