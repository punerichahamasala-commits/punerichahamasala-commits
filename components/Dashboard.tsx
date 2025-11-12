
import React from 'react';
import { User } from '../types';
import ManagerView from './ManagerView';
import EmployeeView from './EmployeeView';
import HRView from './HRView';

interface DashboardProps {
    currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
    switch (currentUser.role) {
        case 'Manager':
            return <ManagerView currentUser={currentUser} />;
        case 'Employee':
            return <EmployeeView currentUser={currentUser} />;
        case 'HR':
            return <HRView currentUser={currentUser} />;
        default:
            return <div>Invalid user role.</div>;
    }
};

export default Dashboard;