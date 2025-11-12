import React from 'react';
import { ProficiencyData } from '../types';
import { PERIMETERS_ORDER } from '../constants';

interface ProficiencyChartProps {
  data: ProficiencyData[];
}

const ProficiencyChart: React.FC<ProficiencyChartProps> = ({ data }) => {
  const size = 300;
  const center = size / 2;
  const maxRadius = center * 0.8;
  const numLevels = 5;
  const numSides = PERIMETERS_ORDER.length;
  const angleSlice = (Math.PI * 2) / numSides;

  const getPoint = (value: number, i: number) => {
    const radius = (value / numLevels) * maxRadius;
    const angle = angleSlice * i - Math.PI / 2; // Start from top
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const gridLevels = Array.from({ length: numLevels }, (_, i) => {
    const level = i + 1;
    const points = Array.from({ length: numSides }, (__, j) => {
      const { x, y } = getPoint(level, j);
      return `${x},${y}`;
    }).join(' ');
    return <polygon key={`grid-${level}`} points={points} fill="none" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />;
  }).reverse();

  const axes = Array.from({ length: numSides }, (_, i) => {
    const { x, y } = getPoint(numLevels, i);
    return <line key={`axis-${i}`} x1={center} y1={center} x2={x} y2={y} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" />;
  });

  const labels = PERIMETERS_ORDER.map((perimeter, i) => {
    const { x, y } = getPoint(numLevels * 1.18, i);
    const textAnchor = Math.abs(x - center) < 1 ? 'middle' : x < center ? 'end' : 'start';
    const dominantBaseline = Math.abs(y - center) < 1 ? 'middle' : y < center ? 'alphabetic' : 'hanging';
    
    return (
      <text
        key={`label-${i}`}
        x={x}
        y={y}
        fontSize="11"
        className="fill-slate-500 dark:fill-slate-400 font-medium"
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
      >
        {perimeter.split('(')[0].trim()}
      </text>
    );
  });

  const dataPoints = PERIMETERS_ORDER.map((perimeter, i) => {
    const score = data.find(p => p.perimeter === perimeter)?.score || 0;
    const { x, y } = getPoint(score, i);
    return `${x},${y}`;
  }).join(' ');

  const dataCircles = PERIMETERS_ORDER.map((perimeter, i) => {
      const score = data.find(p => p.perimeter === perimeter)?.score || 0;
      if(score === 0) return null;
      const { x, y } = getPoint(score, i);
      return (
          <circle key={`point-${i}`} cx={x} cy={y} r="4" className="fill-brand-primary" strokeWidth="2" stroke="white">
            <title>{`${perimeter}: ${score} / 5`}</title>
          </circle>
      );
  });

  return (
    <div className="flex justify-center items-center h-full w-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`}>
        <g>
          {gridLevels}
          {axes}
          <polygon points={dataPoints} stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} strokeWidth="2" />
          {dataCircles}
          {labels}
        </g>
      </svg>
    </div>
  );
};

export default ProficiencyChart;