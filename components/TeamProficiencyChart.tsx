
import React from 'react';
import { Employee } from '../types';
import { PERIMETERS_ORDER } from '../constants';

interface TeamProficiencyChartProps {
  employees: Employee[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const TeamProficiencyChart: React.FC<TeamProficiencyChartProps> = ({ employees }) => {
  const getScore = (employee: Employee, perimeter: string) => {
    return employee.proficiency.find(p => p.perimeter === perimeter)?.score || 0;
  };

  return (
    <div className="h-full w-full flex flex-col">
        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
            {employees.map((employee, index) => (
            <div key={employee.id} className="flex items-center">
                <div 
                    className="w-3 h-3 rounded-sm mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-xs text-slate-600 dark:text-slate-400">{employee.name}</span>
            </div>
            ))}
        </div>

        {/* Chart */}
        <div className="flex-grow space-y-4">
            {PERIMETERS_ORDER.map((perimeter) => (
                <div key={perimeter}>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{perimeter}</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-6 flex overflow-hidden">
                        {employees.map((employee, index) => {
                            const score = getScore(employee, perimeter);
                            const widthPercentage = (score / 5) * 100 / employees.length;
                            return (
                                <div
                                    key={`${employee.id}-${perimeter}`}
                                    className="h-full transition-all duration-500"
                                    style={{
                                        width: `${widthPercentage}%`,
                                        backgroundColor: COLORS[index % COLORS.length],
                                    }}
                                >
                                    <span className="sr-only">{`${employee.name} score for ${perimeter}: ${score}`}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
         <div className="w-full flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 border-t border-slate-200 dark:border-slate-700 pt-1">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
        </div>
    </div>
  );
};

export default TeamProficiencyChart;
