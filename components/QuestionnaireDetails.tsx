
import React from 'react';
import { Employee, Question } from '../types';
import { PERIMETERS_ORDER } from '../constants';

interface QuestionnaireDetailsProps {
  employee: Employee;
}

const ScoreVisualizer: React.FC<{ score: number }> = ({ score }) => (
  <div className="flex items-center gap-1" aria-label={`Score: ${score} out of 5`}>
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < score ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const QuestionThread: React.FC<{ question: Question }> = ({ question }) => (
  <div className="relative">
    <p className="font-semibold text-sm text-slate-600 dark:text-slate-300">{question.text}</p>
    <p className="text-sm text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded p-2 mt-1">
      {typeof question.answer === 'number' ? `Rating: ${question.answer}/5` : question.answer}
    </p>

    {question.followUp && question.answer === question.followUp.onAnswer && (
      <div className="mt-4 ml-4 pl-4 border-l-2 border-slate-300 dark:border-slate-600/50 relative">
        <div className="absolute -left-[9px] top-1 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600/50 ring-4 ring-slate-100 dark:ring-slate-600"></div>
        <QuestionThread question={question.followUp.question} />
      </div>
    )}
  </div>
);

const QuestionnaireDetails: React.FC<QuestionnaireDetailsProps> = ({ employee }) => {
  return (
    <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
        Detailed Proficiency Breakdown
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PERIMETERS_ORDER.map((perimeter) => {
          const profData = employee.proficiency.find(p => p.perimeter === perimeter);
          if (!profData) return null;

          const isLowScore = profData.score < 3;

          return (
            <div 
              key={profData.perimeter} 
              className={`p-4 rounded-lg flex flex-col transition-colors duration-300 ${
                isLowScore 
                ? 'bg-status-red/10 border border-status-red/20' 
                : 'bg-slate-50 dark:bg-slate-700/50'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="font-bold text-md text-brand-primary flex-1 flex items-center">
                  {isLowScore && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-status-red mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {profData.perimeter}
                </h4>
                <ScoreVisualizer score={profData.score} />
              </div>
              <hr className="my-2 border-slate-200 dark:border-slate-600" />
              <div className="mt-3 space-y-4 flex-1">
                {profData.questions.map((q) => (
                   <QuestionThread key={q.id} question={q} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionnaireDetails;