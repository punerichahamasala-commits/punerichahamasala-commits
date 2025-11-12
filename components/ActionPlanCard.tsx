
import React from 'react';
import { ActionPlan, ActionStep, UserRole } from '../types';

interface ActionPlanCardProps {
  actionPlan: ActionPlan;
  onUpdateStepStatus: (stepIndex: number, newStatus: ActionStep['status']) => void;
  isReadOnly?: boolean;
  highlightRole?: UserRole;
}

const statusColors: { [key in ActionStep['status']]: string } = {
  'Not Started': 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
};

const ownerColors: { [key in ActionStep['owner']]: string } = {
  'Employee': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  'Manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  'HR': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
};

const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ actionPlan, onUpdateStepStatus, isReadOnly = false, highlightRole }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg animate-fade-in">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Personalized Action Plan
      </h3>

      <div className="bg-brand-light dark:bg-slate-700/50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-md text-slate-700 dark:text-slate-300 mb-1">Development Goal</h4>
        <p className="text-slate-800 dark:text-slate-200">{actionPlan.goal}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Action Step</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Owner</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Timeline</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Resources</th>
              <th className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {actionPlan.actionSteps.map((step, index) => (
              <tr 
                key={index} 
                className={`border-b border-slate-100 dark:border-slate-700/50 transition-colors ${
                  highlightRole && step.owner === highlightRole ? 'bg-brand-primary/5 dark:bg-brand-primary/10' : ''
                }`}
              >
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300 align-top">{step.step}</td>
                <td className="px-4 py-3 text-sm align-top">
                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ownerColors[step.owner] || 'bg-slate-200'}`}>
                        {step.owner}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 align-top">{step.timeline}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 align-top">{step.resources}</td>
                <td className="px-4 py-3 text-sm align-top">
                  <select
                    value={step.status}
                    onChange={(e) => onUpdateStepStatus(index, e.target.value as ActionStep['status'])}
                    className={`border-0 rounded-md py-1 px-2 text-xs font-medium focus:ring-2 focus:ring-brand-primary transition-colors ${statusColors[step.status]} ${isReadOnly ? 'appearance-none cursor-not-allowed' : ''}`}
                    aria-label={`Update status for step: ${step.step}`}
                    disabled={isReadOnly}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActionPlanCard;