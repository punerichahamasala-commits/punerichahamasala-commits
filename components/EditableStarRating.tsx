import React, { useState } from 'react';

interface EditableStarRatingProps {
  score: number;
  onScoreChange: (score: number) => void;
  isReadOnly?: boolean;
}

const Star: React.FC<{ filled: boolean; onHover: () => void; onClick: () => void; isReadOnly: boolean }> = ({ filled, onHover, onClick, isReadOnly }) => (
  <svg
    className={`w-6 h-6 ${filled ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'} ${!isReadOnly ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    onMouseEnter={!isReadOnly ? onHover : undefined}
    onClick={!isReadOnly ? onClick : undefined}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const EditableStarRating: React.FC<EditableStarRatingProps> = ({ score, onScoreChange, isReadOnly = false }) => {
  const [hoverScore, setHoverScore] = useState(0);

  return (
    <div className="flex items-center gap-1" onMouseLeave={!isReadOnly ? () => setHoverScore(0) : undefined}>
      {[...Array(5)].map((_, i) => {
        const currentScore = i + 1;
        return (
          <Star
            key={i}
            filled={currentScore <= (hoverScore || score)}
            onHover={() => setHoverScore(currentScore)}
            onClick={() => onScoreChange(currentScore)}
            isReadOnly={isReadOnly}
          />
        );
      })}
    </div>
  );
};

export default EditableStarRating;
