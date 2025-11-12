
import React from 'react';
import { Status } from '../types';

interface StatusIndicatorProps {
  status: Status;
}

const statusConfig = {
  [Status.GREEN]: {
    bgColor: 'bg-status-green/10',
    textColor: 'text-status-green',
    dotColor: 'bg-status-green',
    text: "Excelling: On track to become an expert. Ready for new challenges."
  },
  [Status.YELLOW]: {
    bgColor: 'bg-status-yellow/10',
    textColor: 'text-status-yellow',
    dotColor: 'bg-status-yellow',
    text: "Developing: Showing progress. Key areas for improvement identified."
  },
  [Status.RED]: {
    bgColor: 'bg-status-red/10',
    textColor: 'text-status-red',
    dotColor: 'bg-status-red',
    text: "Needs Support: Significant gaps detected. Action plan required."
  }
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const config = statusConfig[status];

  return (
    <div className={`p-3 rounded-lg w-full text-center ${config.bgColor}`}>
      <div className="flex items-center justify-center gap-2">
        <span className={`w-3 h-3 rounded-full ${config.dotColor}`}></span>
        <p className={`font-semibold ${config.textColor}`}>{status}</p>
      </div>
      <p className={`text-sm mt-1 ${config.textColor}`}>{config.text}</p>
    </div>
  );
};

export default StatusIndicator;
