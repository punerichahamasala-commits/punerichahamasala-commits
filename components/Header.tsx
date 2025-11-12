
import React from 'react';
import { User } from '../types';

interface HeaderProps {
    currentUser: User;
    users: User[];
    onUserChange: (userId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, users, onUserChange }) => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ProficiencyPro</h1>
        </div>

        <div className="flex items-center gap-2">
            <label htmlFor="user-select" className="text-sm font-medium text-slate-600 dark:text-slate-300">Viewing as:</label>
            <select 
              id="user-select"
              value={currentUser.id}
              onChange={(e) => onUserChange(e.target.value)}
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-brand-primary focus:border-brand-primary"
            >
              {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
            </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
